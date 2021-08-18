const fastifyPlugin = require("fastify-plugin");
const jwt = require("jsonwebtoken");

// CREATE THE PLUGIN FOR AUTHENTICATION
module.exports = fastifyPlugin(async (fastify, opts) => {
  const db = fastify.mongo
    .db(process.env.DATABASE)
    .collection("Campaigns");

  const dbUsers = fastify.mongo.db(process.env.DATABASE).collection("Users");

  async function checkAuth(request, reply, done) {

    let token;
    if (request.headers.Authorization) {
      token = request.headers.Authorization.split(" ")[1];
    } else if (request.headers.authorization) {
      token = request.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw fastify.httpErrors.unauthorized("Unauthorized");
    }

    // Verify the token and if is avaible set it
    try {
      const decoded = jwt.verify(token, process.env.SECRET_JWT);

      // if(!(decoded.user.confirmed)){
      //   throw "Verify mail"
      // }
      if (decoded && decoded.user) {
        request.data = decoded.user;
      } else {
        throw "Unauthorized"
      }
    } catch (err) {
      throw fastify.httpErrors.unauthorized(err)
    }

  }
  fastify.decorate("checkAuth", checkAuth);
});
