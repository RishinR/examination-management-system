const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const teacher = require("./routes/teacher");
const student = require("./routes/student");
const InitiateMongoServer = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var path = require("path");
require("dotenv").config();

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// Middleware for POST, PUT, PATCH requests with JSON body
app.use(bodyParser.json());  // For parsing application/json

// Middleware for other headers and cookies
app.use(cookieParser());
app.use(cors());

// Your routes
app.use("/user", user);
app.use("/teacher", teacher);
app.use("/student", student);

// Serve static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/esm-client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/esm-client/build", "index.html"));
  });
}

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
