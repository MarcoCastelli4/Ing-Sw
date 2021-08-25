const {
    respF,
    uuid,
    slotSchema
} = require("../utilities");
var ObjectID = require("mongodb").ObjectID

async function routes(fastify, options, next) {
    // DB HUBS
    const dbHubs = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Hubs");

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
                
                return respF(reply, hubs.slot);
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
                inputData._id = uuid.v1();
                console.log(inputData)

                let query = await dbHubs.findOneAndUpdate(
                    { _id: ObjectID(inputData.hub_id) },
                    { $push: { slot: inputData } }
                );

                return respF(reply, inputData._id);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    });
}
//sono una classe richiambile dall'esterno
module.exports = routes;