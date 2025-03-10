const mongoose = require("mongoose");
require('dotenv').config()

// Replace this with your local MongoDB URI.
const MONGOURI = `mongodb://localhost:27017/${process.env.MONGODB_DATABASE_NAME}`;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("useFindAndModify", false);
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
