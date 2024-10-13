const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbURL = process.env.Mongo_URI;

const dbconnect = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connected sucessfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbconnect; //exporting the function
