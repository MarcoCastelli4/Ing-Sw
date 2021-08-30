const {
    respF,
    uuid,
    hubSchema
} = require("../utilities");

async function routes(fastify, options, next) {
    // DB HUBS
    const dbHubs = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Hubs");

    fastify.route({
        url: "/hubs",
        method: "GET",
        response: {
            200: {
                type: "object",
                properties: {
                    role: { type: "string" },
                    hubs: {
                        type: "array",
                        items: {
                            hubSchema
                        }
                    }
                }
            }
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let hubs = await dbHubs.find().toArray();
                let res = {
                    role: request.data.role,
                    hubs: hubs
                }

                return respF(reply, res);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    })
}
//sono una classe richiambile dall'esterno
module.exports = routes;