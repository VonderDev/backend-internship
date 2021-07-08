require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let isConnected;
let db;

module.exports = async function connectToDatabase() {
  console.log("connectToDatabase...");

  if (isConnected) {
    console.log("=> use existing database connection");
    return db;
  }
  console.log("=> using new database connection");
  db = await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  isConnected = db.connections[0].readyState;
  return db;
};
