/// SETTING THE DB
const {
  respF,
  jwt,
  getAccessToken,
  getRefreshToken,
  uuid,
} = require("../utilities");
const mongodb = require("mongodb").MongoClient;
var argvs = process.argv.slice(2);
var envfile = ".env";
argvs[0] = "test";
if (argvs[0] == "test") {
  envfile = envfile + "test";
}
const env = require("dotenv").config({
  path: envfile,
});

async function main() {
  prod = true;
  let url = process.env.DB_URL;
  // Options of mongo
  let opts = {};
  opts.useNewUrlParser = true;
  opts.useUnifiedTopology = true;
  // Set payload for jwt
  let payload = {
    _id: uuid.v1(),
    username: inputData.username,
    role: 1,
  };

  const accessToken = getAccessToken(payload);
  const refreshToken = await getRefreshToken(dbUsers, payload, true);

  // Decorate for set the property of mongo everywhere in the app
  const dbo = await mongodb.connect(url, opts);
  const db = dbo
    .db(process.env.DATABASE)
    .collection(process.env.COLLECTIONUS ? process.env.COLLECTIONUS : "");

  let user = {
    _id: payload._id,
    username: inputData.username,
    email: inputData.email,
    password: md5(inputData.password),
    refreshTokens: [refreshToken],
    role: 1,
  };
  await db.insertOne(user);
}

main();
