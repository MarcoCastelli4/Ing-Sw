const {
    respF,
    uuid,
    campaignSchema
} = require("../utilities");

async function routes(fastify, options, next) {
    // DB CAMPAIGN
    const dbCampaigns = fastify.mongo
        .db(process.env.DATABASE)
        .collection("Campaigns");

    fastify.route({
        url: "/campaigns",
        method: "GET",
        response: {
            200: {
                type: "object",
                properties: {
                    role: { type: "string" },
                    hubs: {
                        type: "array",
                        items: {
                            campaignSchema
                        }
                    }
                }
            }
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let campaigns = await dbCampaigns.find().toArray();

                let res = {
                    role: request.data.role,
                    campaigns: campaigns
                }

                return respF(reply, res);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    })

    fastify.route({
        url: "/campaign",
        method: "POST",
        schema: {
            body: {
                campaignSchema
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
                inputData.deletable = true;

                let query = await dbCampaigns.insertOne(inputData);

                if (query.insertedCount == 0)
                    throw fastify.httpErrors.internalServerError("Error while creating the element");

                return respF(reply, inputData._id);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    });

    fastify.route({
        url: "/campaign",
        method: "PUT",
        schema: {
            body: {
                campaignSchema
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
                const inputData = request.body;

                let query = await dbCampaigns.updateOne(
                    { _id: inputData._id },
                    { $set: { name: inputData.name, type: inputData.type, hubs: inputData.hubs, priority: inputData.priority }, },
                    { upsert: true }
                );

                if (query.modifiedCount == 0)
                    throw fastify.httpErrors.internalServerError("Error while updating the element");

                return respF(reply, "OK");
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    });

    fastify.route({
        url: "/campaign",
        method: "DELETE",
        querystring: {
            type: "object",
            required: ["_id"],
            properties: {

            },
        },
        response: {
            200: {
                type: "string",
            }
        },
        preValidation: [fastify.checkAuth],
        handler: async (request, reply) => {
            try {
                let query = await dbCampaigns.deleteOne({ _id: request.query._id });

                if (query.deletedCount == 0)
                    throw fastify.httpErrors.internalServerError("Error while deleting the element");

                return respF(reply, request.query._id);
            } catch (err) {
                console.log(err);
                throw fastify.httpErrors.internalServerError(err);
            }
        }
    })
}
module.exports = routes;
