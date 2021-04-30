const env = require("dotenv").config();
const nodemailer = require("nodemailer");
// Email credentials
const { username, password, SMTPserver, SMTPport, host } = env.parsed;
// Server setup
const port = 4040;
const express = require("express");
let app = express();
const fs = require("fs");
const csvjson = require("csvjson");

// Basic middleware -> intercept the request
app.use("/1x1-0000ff7f.png", function (req, res, next) {
  const id = req.query && req.query.id ? req.query.id : null;
  console.log(id);
  next(); // Continue on to the next middleware/route handler
});

// Load the pixel image
app.use(express.static(__dirname + "/images"));

// create reusable transporter object using the default SMTP transport
let credentials = {
  host: SMTPserver,
  port: Number(SMTPport),
  secure: true, // I'm using the 465 port
  auth: {
    user: username, // generated ethereal user
    pass: password, // generated ethereal password
  },
};
const transporter = nodemailer.createTransport(credentials);

async function sendEmail(emailObject) {
  // send mail with defined transport object
  transporter.sendMail(
    {
      from: '"Paolo De Giglio" <paolo@satiurn.com>', // sender address
      to: "luca@yopmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html:
        "<img src='" +
        host +
        ":" +
        port +
        "/1x1-0000ff7f.png?id=erede'><b>Hello world?</b>", // html body
    },
    (err, info) => {
      // check for errors here
      console.error(err);
      console.log(info);
    }
  );

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/data", function (req, res) {
  let filename = "./data.csv";
  var data = fs.readFileSync(filename);
  var file_data = fs.readFileSync("./data.csv", { encoding: "utf8" });
  var options = {
    delimiter: ";", // optional
  };
  var result = csvjson.toObject(file_data, options);
  console.log(result);
  res.render("data.pug", { data: result });
});

// Server started
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  /* sendEmail({}).catch((error) => {
   *   console.error(error);
   * }); */
});
