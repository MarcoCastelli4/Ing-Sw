// REQUIRE ALL THE UTILITIES
const {
  respF,
  jwt,
  getAccessToken,
  getRefreshToken,
  uuid,
} = require("../utilities");
const md5 = require("md5");

async function routes(fastify, options, next) {
  // DB
  const db = fastify.mongo
    .db(process.env.DATABASE)
    .collection(process.env.COLLECTION);

  // DB USERS
  const dbUsers = fastify.mongo
    .db(process.env.DATABASE)
    .collection(process.env.COLLECTIONUS);

  //
  // ─────────────────────────────────────────────────────────── LOGIN ─────
  //
  fastify.route({
    url: "/login",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["password"],
        properties: {
          email: { type: "string" },
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
      },
    },
    preValidation: [],
    handler: async (request, reply) => {
      const inputData = request.body;

      // Check if the user exist
      let user = null;
      if (inputData.username) {
        user = await dbUsers.findOne({ username: inputData.username });
      } else if (!user && inputData.email) {
        user = await dbUsers.findOne({ email: inputData.email });
      }

      if (
        user &&
        inputData.password &&
        user.password == md5(inputData.password)
      ) {
        // Set payload for jwt
        let payload = {
          _id: user._id,
          username: user.username,
          role: 1,
        };

        const accessToken = getAccessToken(payload);
        const refreshToken = await getRefreshToken(dbUsers, payload, true);

        let response = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          username: user.username,
          id: user._id,
          email: user.email,
        };
        respF(reply, response);
      } else {
        throw fastify.httpErrors.badRequest("userNotExists");
      }
    },
  });

  //
  // ─────────────────────────────────────────────────────────── SIGNUP ─────
  //
  fastify.route({
    url: "/signup",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["email", "password", "username"],
        properties: {
          email: { type: "string" },
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
      },
    },
    preValidation: [],
    handler: async (request, reply) => {
      const inputData = request.body;

      if (
        (await checkField(dbUsers, "username", inputData.username)) &&
        (await checkField(dbUsers, "email", inputData.email))
      ) {
        // Set payload for jwt
        let payload = {
          _id: uuid.v1(),
          username: inputData.username,
          role: 1,
        };

        const accessToken = getAccessToken(payload);
        const refreshToken = await getRefreshToken(dbUsers, payload, true);

        // Add user
        let user = {
          _id: payload._id,
          username: inputData.username,
          email: inputData.email,
          password: md5(inputData.password),
          refreshTokens: [refreshToken],
          role: 1,
        };

        await dbUsers.insertOne(user);

        let response = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        respF(reply, response);
      } else {
        throw fastify.httpErrors.badRequest("userExists");
      }
    },
  });

  //
  // ───────────────────────────────────────────────── REFRESH TOKEN ─────
  //
  fastify.route({
    url: "/token",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
      },
    },
    preValidation: [],
    handler: async (request, reply) => {
      let refreshToken = request.body.refreshToken;

      // Verify the token
      try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_JWT);
        if (decoded && decoded.user) {
          // Check if the user exist and if the refreshToken is inside the refreshTokens list

          request.data = decoded.user;
          let user = await dbUsers.findOne({ _id: decoded.user._id });

          if (user && user.refreshTokens && user.refreshTokens.length > 0) {
            // The token is valid return the accessToken
            let payload = {
              _id: user._id,
              username: user.username,
              role: user.role,
            };

            // Return another refreshToken
            const accessToken = getAccessToken(payload);
            const refreshToken = await getRefreshToken(dbUsers, payload, true);

            let response = {
              accessToken: accessToken,
              refreshToken: refreshToken,
            };

            return respF(reply, response);
          } else {
            console.log("ERROR DECODED", decoded);
            throw fastify.httpErrors.badRequest("Unauthorized");
          }
        } else {
          throw fastify.httpErrors.badRequest("Unauthorized");
        }
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.badRequest("Unauthorized");
      }
    },
  });

  //
  // ────────────────────────────────────────────────── GET PRIVILEGES ─────
  //
  fastify.route({
    url: "/userprivilege",
    method: "GET",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            userId: { type: "string" },
            email: { type: "string" },
            refreshToken: { type: "string" },
            role: { type: "number" },
            username: { type: "string" },
          },
        },
      },
    },
    preValidation: [fastify.authForced],
    handler: async (request, reply) => {
      let userId = request.data._id;
      let user = await dbUsers.findOne({ _id: userId });

      let response = {
        id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        refreshToken: user.refreshTokens[user.refreshTokens.length - 1],
      };

      return respF(reply, response);
    },
  });

  //
  // ─────────────────────────────────────────── CHANGE USER PASSWORD ────
  //
  fastify.route({
    url: "/userpassword",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldpassword: { type: "string" },
          newpassword: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    preValidation: [fastify.authForced],
    handler: async (request, reply) => {
      let userId = request.data._id;
      let user = await dbUsers.findOne({ _id: userId });

      // Set params
      let oldPassword = request.body.oldPassword;
      let newPassword = request.body.newPassword;

      // Check user
      if (user) {
        // Check password validity
        if (
          user.password === md5(oldPassword) &&
          newPassword &&
          newPassword.length > 3
        ) {
          // Update password
          await dbUsers.updateOne(
            { _id: userId },
            { $set: { password: md5(newPassword) } }
          );

          return respF(reply, { message: "ok" });
        } else {
          throw fastify.httpErrors.badRequest("WrongPassword");
        }
      } else {
        throw fastify.httpErrors.badRequest("Server error");
      }
    },
  });
}

module.exports = routes;
