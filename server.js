const express = require("express");
// const fileupload = require("express-fileupload");

// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const bodyParser = require("body-parser"); /* deprecated */
// const client = require("./app/models/db");
const app = express();
const dbConfig = require('./app/config/db.config')
require('dotenv').config()

var corsOptions = {
  // origin: "http://localhost:8081"
};
app.use(cors()) // Use this
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
// app.use(fileupload());
app.use(express.static("files"));
// parse requests of content-type - application/json
// app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */
app.use("/imges_uploads", express.static("imges_uploads"))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Doc-Megician" });
});

require("./app/routes/admin")(app);
require("./app/routes/auth")(app);
require("./app/routes/docToPdf")(app);
require("./app/routes/pdfToDoc")(app);
require("./app/routes/imgToPdf")(app);
require("./app/routes/pdf")(app);
require("./app/routes/favourite")(app);
require("./app/routes/PrivacyPolicy")(app);
require("./app/routes/TermsConditions")(app);
require("./app/routes/subscription")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

