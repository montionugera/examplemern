
const _ = require("colors");
const mongoose = require("mongoose");
const config = require("config");
const db = process.env.MONGODB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("DB Connected ..".green);
    mongoose.set('useFindAndModify', false);
  } catch (err) {
    console.log(err.message.red);
    process.exit(1);
  }
};

module.exports = connectDB;