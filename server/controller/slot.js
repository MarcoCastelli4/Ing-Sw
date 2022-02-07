const { respF, uuid, slotSchema, nodemailer } = require("../utilities");
var ObjectID = require("mongodb").ObjectID;

async function routes(fastify, options, next) {
  // DB HUBS
  const dbHubs = fastify.mongo.db(process.env.DATABASE).collection("Hubs");
  // DB CITIZENS
  const dbCitizens = fastify.mongo
    .db(process.env.DATABASE)
    .collection("Citizens");
  // DB CAMPAIGN
  const dbCampaigns = fastify.mongo
    .db(process.env.DATABASE)
    .collection("Campaigns");

  fastify.route({
    url: "/slots",
    method: "GET",
    querystring: {
      type: "object",
      required: ["_id"],
      properties: {
        _id: {
          type: "string",
        },
      },
    },
    response: {
      200: {
        type: "array",
        items: {
          slotSchema,
        },
      },
    },
    preValidation: [fastify.checkAuth],
    handler: async (request, reply) => {
      try {
        let hub;
        if (request.query._id)
          hub = await dbHubs.findOne({ _id: ObjectID(request.query._id) });
        else throw new Error("ID required!");

        return respF(reply, hub?.slots);
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.internalServerError(err);
      }
    },
  });

  fastify.route({
    url: "/slot",
    method: "POST",
    schema: {
      body: {
        slotSchema,
      },
      response: {
        201: {
          type: "string",
        },
      },
    },
    preValidation: [fastify.checkAuth],
    handler: async (request, reply) => {
      try {
        let inputData = request.body;
        let slots = inputData.slots;
        let i = 0;
        for (let slot of slots) {
          inputData._id = uuid.v4() + i;
          inputData.availableQty = inputData.quantity;
          inputData.user_ids = [];
          delete inputData.slots;
          inputData.slot = slot;

          await dbHubs.findOneAndUpdate(
            { _id: ObjectID(inputData.hub_id) },
            { $push: { slots: inputData } }
          );

          i++;
        }

        let campaign = await dbCampaigns.findOne({
          _id: inputData.campaign_id,
        });

        if (campaign.deletable) {
          await dbCampaigns.findOneAndUpdate(
            { _id: inputData.campaign_id },
            { $set: { deletable: false } }
          );
        }

        if (Array.isArray(campaign.citizen_to_notify)) {
          // Send email
          let config = {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "prenotazione.vaccini.univr",
              pass: "studentiunivr.2000",
            },
          };

          let transporter = nodemailer.createTransport(config);
          let res;
          for (let email of campaign.citizen_to_notify) {
            res = await transporter.sendMail({
              from: '"Sistema di prenotazione vaccini" <prenotazione.vaccini.univr@gmail.com>',
              to: email,
              subject: "Nuovi vaccini disponibili per " + campaign.name,
              text:
                "Sono state inserite nuove disponibilità per la campagna '" +
                campaign.name +
                "'; accedi subito per prenotarti! http://localhost:4200/pages/reservation?id=" +
                campaign._id +
                "'",
            });
          }
        }

        return respF(reply, inputData._id);
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.internalServerError(err);
      }
    },
  });
  /**
   * Funzione che nella tabella utenti aggiunge un elemento all'array reservations (con id di campaing, hub e slot)
   * e nella tabella degli hub, all'altezza dello slot selezionato lo user_id e decrementa la disponibilità
   * Se l'utente ha già prenotato un vaccino per la campagna selezionata ritorna errore (esplicitato nel FE)
   */

  fastify.route({
    url: "/reservation",
    method: "POST",
    schema: {
      body: {
        slotSchema,
      },
      response: {
        201: {
          type: "string",
        },
      },
    },
    preValidation: [fastify.checkAuth],
    handler: async (request, reply) => {
      try {
        let inputData = request.body;

        let citizenReservation = {
          campaign_id: inputData._campaign_id,
          hub_id: inputData._hub_id,
          reservations: [inputData.__id],
        };

        let user = await dbCitizens.findOne({
          _id: ObjectID(request.data._id),
        });
        let hub = await dbHubs.findOne({
          _id: ObjectID(inputData._hub_id),
          "slots._id": inputData.__id,
        });
        let slot;
        for (slot of hub.slots) {
          if (slot._id == inputData.__id)
            break;
        }
        for (let x of user?.reservations) {
          if (x.campaign_id == inputData._campaign_id) {
            throw fastify.httpErrors.badRequest(
              "User already reserved a vaccine for this campaign"
            );
          }
        }

        if (slot.availableQty < 1) throw "No available vaccine for this slot";

        let citizenQuery = await dbCitizens.updateOne(
          { _id: ObjectID(request.data._id) },
          { $push: { reservations: citizenReservation } },
          { upsert: true }
        );

        let hubQuery = await dbHubs.updateOne(
          { _id: ObjectID(inputData._hub_id), "slots._id": inputData.__id },
          {
            $push: { "slots.$.user_ids": request.data._id },
            $inc: { "slots.$.availableQty": -1 },
          }
        );

        if (hubQuery?.modifiedCount == 0 || citizenQuery?.modifiedCount == 0) {
          throw "DB query failed";
        }

        return respF(reply, "Success");
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.badRequest(err);
      }
    },
  });
  /**
   * Funzione che serve per segnalare un utente che vuole o non vuole ricevere notifiche quando la campagna scelta riceve altri vaccini e dunque
   * dispone di ulteriori slot
   */
  fastify.route({
    url: "/notification",
    method: "POST",
    schema: {
      body: {
        campaign_id: "string",
        on: "boolean",
      },
      response: {
        201: {
          type: "string",
        },
      },
    },
    preValidation: [fastify.checkAuth],
    handler: async (request, reply) => {
      try {
        let inputData = request.body;
        let tokenData = request.data;
        let query;

        if (inputData.on) {
          query = await dbCampaigns.updateOne(
            { _id: inputData.campaign_id },
            { $push: { citizen_to_notify: tokenData.email } }
          );
        } else {
          query = await dbCampaigns.updateOne(
            { _id: inputData.campaign_id },
            { $pull: { citizen_to_notify: tokenData.email } }
          );
        }

        if (!query || query.result.nModified == 0)
          throw fastify.httpErrors.internalServerError(query);

        return respF(reply, "Success");
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.internalServerError(err);
      }
    },
  });
}
//sono una classe richiambile dall'esterno
module.exports = routes;
