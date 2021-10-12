const {
    respF,
    uuid,
    slotSchema
} = require("../utilities");
var ObjectID = require("mongodb").ObjectID;

async function routes(fastify, options, next) {
    // DB HUBS
    const dbHubs = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Hubs");
    // DB CITIZENS
    const dbCitizens = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Citizens");

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
                    slotSchema
                }
            }
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let hubs = await dbHubs.findOne({ _id: ObjectID(request.query._id) });

                return respF(reply, hubs.slots);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    })

    fastify.route({
        url: "/slot",
        method: "POST",
        schema: {
            body: {
                slotSchema
            },
            response: {
                201: {
                    type: "string"
                },
            },
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let inputData = request.body;
                let slots = inputData.slots;

                slots.forEach(async (slot) => {
                    inputData._id = uuid.v1();
                    inputData.availableQty = inputData.quantity;
                    inputData.user_ids = [];
                    delete inputData.slots;
                    inputData.slot = slot;
                    
                    console.log(slot)
                    let res = await update(inputData, slot)
                    console.log(res)
                });

                return respF(reply, inputData._id);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    });
    function update(inputData, slot) {
        return new Promise((resolve, reject) => {
            let operation = dbHubs.findOneAndUpdate(
                { _id: ObjectID(inputData.hub_id) },
                { $push: { slots: inputData } }
            );
            resolve(operation)
        })
    }
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
                slotSchema
            },
            response: {
                201: {
                    type: "string"
                },
            },
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let inputData = request.body;

                let citizenReservation = {
                    campaign_id: inputData.campaign_id,
                    hub_id: inputData.hub_id,
                    reservations: [inputData.slot]
                }
                let user = await dbCitizens.findOne({ _id: request.data._id });
                user.reservations?.forEach(x => {
                    if (x.campaign_id == inputData.campaign_id) {
                        throw fastify.httpErrors.badRequest("User already reserved a vaccine for this campaign");
                    }
                });

                await dbCitizens.updateOne(
                    { _id: request.data._id },
                    { $push: { reservations: citizenReservation } }
                );

                await dbHubs.updateOne(
                    { _id: ObjectID(inputData.hub_id), "slots._id": inputData.slot },
                    { $push: { "slots.$.user_ids": request.data._id }, $inc: { "slots.$.availableQty": -1 } }
                );

                return respF(reply, "Success");
            } catch (err) {
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    });
}
//sono una classe richiambile dall'esterno
module.exports = routes;