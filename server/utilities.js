const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const slotSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    date: { type: "number" },
    slot: { type: "string" },
    campaign_id: { type: "string" },
    hub_id: { type: "string" },
    user_ids: {
      type: "array",
      properties: { type: "string" }
    },
    quantity: { type: "number" },
  }
}

const hubSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    city: { type: "string" },
    totQty: { type: "number" },
    slots: {
      type: "array",
      items: {
        slotSchema
      }
    }
  }
};

const campaignSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    totQty: { type: "number" },
    type: { type: "string" },
    hubs: {
      type: "array",
      items: {
        hubSchema
      }
    },
    priority: { type: "string" }

  }
}

/**
 * Get the access token from jwt
 *
 * @params {object} payload: payload with the info inside token
 */
const getAccessToken = (payload) => {
  // Sign the token
  return jwt.sign({ user: payload }, process.env.SECRET_JWT, {
    expiresIn: "25min",
  });
};

/**
 * Get the refreshToken for specific user
 *
 * @params {object} dbUsers: db with users info
 * @params {object} payload: payload with the info inside token
 * @params {boolean} isnew: check if it is new
 */
const getRefreshToken = async (dbUsers, payload, isnew) => {
  // Get the user
  const user = await dbUsers.find({ _id: payload._id });

  if (!user) {
    return null;
  }

  const refreshToken = jwt.sign({ user: payload }, process.env.SECRET_JWT, {
    expiresIn: "90d",
  });

  if (!isnew) {
    // Add to the db refreshTokens list
    await dbUsers.updateOne(
      { _id: payload._id },
      { $push: { refreshTokens: { $each: [refreshToken], $slice: -10 } } }
    );
  }

  return refreshToken;
};

/**
 * Utility for return the response to the user
 *
 * @params {object} reply: reply of fastify
 * @params {object} body: body request
 */
const respF = (reply, body) => {
  reply
    .code(200)
    .headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    })
    .send(JSON.stringify(body));
};

/**
* Check if the user exist and if is only one return the values
*
* @params {object: db} dbUsers: db of the users
* @params {string} field: username or email
* @params {string} value: value of the field searched
*/
//const checkField = async (db, field, value) => {
//  if (!value) {
//    return false;
//  }
//  try {
//    users = await db.find({ [field]: value }).toArray();
//  } catch (error) {
//    return false;
//  }
//  if (users && users.length >= 1) {
//    return false;
//  } else {
//    return true;
//  }
//};

module.exports = {
  respF,
  getAccessToken,
  getRefreshToken,
  jwt,
  uuid,
  hubSchema,
  campaignSchema,
  slotSchema
};
