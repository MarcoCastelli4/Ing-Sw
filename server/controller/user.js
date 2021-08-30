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

  // DB CAMPAIGN
  const dbCampaigns = fastify.mongo
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
      try {
        const inputData = request.body;

        // Check if the user exist
        let user = null;
        let role = null;
        if (inputData.email) {
          user = await dbCitizens.findOne({ email: inputData.email });
          role = "Citizen";
        }

        else if (inputData.opCode) {
          user = await dbOperators.findOne({ email: inputData.opCode });
          role = "Operator";
        }

        if (user) {
          if (inputData.password && user.password == md5(inputData.password)) {

            // Set payload for jwt
            let payload = {
              _id: user._id,
              role: role
            };

            const accessToken = getAccessToken(payload);
            const refreshToken = await getRefreshToken(inputData.email ? dbCitizens : dbOperators, payload, true);

            delete user.password;
            user["role"] = role;

            let response = {
              accessToken: accessToken,
              refreshToken: refreshToken,
              user: user,
            };
            respF(reply, response);
          } else {
            throw fastify.httpErrors.badRequest("Wrong password");
          }
        } else {
          throw fastify.httpErrors.badRequest("User does not exist");
        }
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.internalServerError(err);
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
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
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
      try {
        const inputData = request.body;
        let role = null;

        let user = await dbCitizens.findOne({ fcCode: inputData.fcCode })
        if (!user)
          throw fastify.httpErrors.badRequest("fcCode is not recorded in the DB");

        if (user?.birthplace) {
          throw fastify.httpErrors.badRequest("Citizen already registered");
        }
        let email = await dbCitizens.findOne({ email: inputData.email })
        if (!email) {
          // Set payload for jwt
          let payload = {
            _id: uuid.v1(),
            role: "Citizen"
          };

          const accessToken = getAccessToken(payload);
          const refreshToken = await getRefreshToken(dbCitizens, payload, true);

          // Add user
          let user = await dbCitizens.findOneAndUpdate(
            { fcCode: inputData.fcCode },
            {
              $set: {
                email: inputData.email,
                password: md5(inputData.password),
                refreshTokens: [refreshToken],
                birthplace: inputData.birthplace,
                birthday: Date.parse(inputData.birthday),
                reservations: []
              }
            }
          );
          user.value["email"] = inputData.email;
          user.value["birthplace"] = inputData.birthplace;
          user.value["birthday"] = Date.parse(inputData.birthday);

          let response = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user.value
          };
          respF(reply, response);
        } else {
          throw fastify.httpErrors.badRequest("Email already in use");
        }
      } catch (err) {
        console.log(err);
        throw fastify.httpErrors.internalServerError(err);
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
      console.log("Refreshing token");
      let refreshToken = request.body.refreshToken;

      // Verify the token
      try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_JWT);
        if (decoded && decoded.user) {
          // Check if the user exist and if the refreshToken is inside the refreshTokens list

          request.data = decoded.user;
          let user;
          if(decoded.user.role == "Citizen")
            user = await dbCitizens.findOne({ _id: decoded.user._id });
          else
            user = await dbOperators.findOne({ _id: decoded.user._id });

          if (user && user.refreshTokens && user.refreshTokens.length > 0) {
            // The token is valid return the accessToken
            let payload = {
              _id: user._id,
              role: decoded.user.role,
            };

            // Return another refreshToken
            const accessToken = getAccessToken(payload);
            const refreshToken = await getRefreshToken(dbCitizens, payload, true);

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
          },
        },
      },
    },
    preValidation: [fastify.checkAuth],
    handler: async (request, reply) => {
      let userId = request.data._id;
      let user = await dbUsers.findOne({ _id: userId });

      let response = {
        id: userId,
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
    preValidation: [fastify.checkAuth],
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
