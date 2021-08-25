//
// ───────────────────────────────────────────────────────────── DEPENDENCIES ─────
//
"use strict";
const fastify = require("fastify")({
  logger: {
    level: "info",
    file: "./logs",
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          headers: request.headers,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.connection.remotePort,
        };
      },
    },
  },
});
const fastifyPlugin = require("fastify-plugin");

// Check for test or production env
var argvs = process.argv.slice(2);
var envfile = ".env";
if (argvs[0] == "test") {
  envfile = envfile + "test";
}
const env = require("dotenv").config({
  path: envfile,
});

// Schema compiler
const Ajv = require("ajv");
const ajv = new Ajv({
  // the fastify defaults (if needed)
  removeAdditional: true,
  useDefaults: false,
  coerceTypes: true,
  allErrors: true,
  nullable: true,
});
fastify.setSchemaCompiler(function (schema) {
  return ajv.compile(schema);
});

// SET CORS
fastify.register(require("fastify-cors"), {
  origin: (origin, cb) => {
    //  Request from localhost will pass
    cb(null, true);
    return;
  },
});

// SWAGGER
fastify.register(require("fastify-swagger"), {
  swagger: {
    info: {
      title: "Test swagger",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["applicatin/json"],
  },
  exposeRoute: true,
});

// ERROR HANDLING
fastify.register(require("fastify-sensible"));

//
// ───────────────────────────────────────────────────── SERVER CONFIGURATION ─────
//

// DB
fastify.register(require("./db"));

// AUTH
fastify.register(require("./auth"));

// ERROR HANDLER
fastify.setErrorHandler(function (error, request, reply) {
  const statusCode = error.statusCode;
  let response;

  const { validation, validationContext } = error;

  // check if we have a validation error
  if (validation) {
    response = {
      message: `A validation error occured when validating the ${validationContext}...`, // validationContext will be 'body' or 'params' or 'headers' or 'query'
      errors: validation, // this is the result of your validation library...
    };
  } else {
    response = {
      message: "ServerError",
    };
  }

  reply.status(statusCode).send(response);
});

//
// ──────────────────────────────────────────────────────────── SERVER ROUTES ─────
//

fastify.get("/admin/", (req, reply) => {
  console.log("serving /admin/");
  const stream = fs.createReadStream(path.join("", "dist", "index.html"));
  reply.type("text/html").send(stream);
});

fastify.get("/admin/*", (req, reply) => {
  console.log("serving /admin/*");
  const stream = fs.createReadStream(
    path.join("../client", "dist", "index.html")
  );
  reply.code(200).type("text/html").send(stream);
});

fastify.get("/admin/:filename(.[A-Za-z]{1,4})", function (req, reply) {
  console.log("Serving /admin/:filename");
  let filename = req.params.filename;
  let fileext = filename.split(".").last();
  let type = "text/plain";
  if (fileext == "css") {
    type = "text/css";
  }
  if (fileext == "js") {
    type = "text/javascript";
  }
  if (fileext == "html") {
    type = "text/html";
  }
  const stream = fs.createReadStream(path.join("../client", "dist", filename));
  reply.code(200).type(type).send(stream);
});

// ROUTES USERS
fastify.register(require("./controller/user"));
// ROUTES CAMPAIGNS
fastify.register(require("./controller/campaign"));
//ROUTES HUBS
fastify.register(require("./controller/hub"));
//ROUTES SLOTS
fastify.register(require("./controller/slot"));


//
// ─── LOAD THE SERVER ────────────────────────────────────────────────────────────
//
fastify.listen(3000, "0.0.0.0", async (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("listening");
});
