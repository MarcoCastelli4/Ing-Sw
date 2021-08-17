const {
    respF,
    campaignSchema
} = require("../utilities");

async function routes(fastify, options, next) {
    // DB CAMPAIGN
    const dbCampagins = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Campaigns");
    // DB HUBS
    const dbHubs = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Hubs");

    // DB CITIZENS
    const dbCitizens = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Citizens");

    // DB OPERATORS
    const dbOperators = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Operators");

    fastify.route({
        url: "/campaigns",
        method: "GET",
        response: {
            200: {
                type: "array",
                items: {
                    campaingSchema
                }
            }
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let campaigns = await db.find().toArray();
                console.log(campaigns);
                return respF(reply, campaigns);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    })

}