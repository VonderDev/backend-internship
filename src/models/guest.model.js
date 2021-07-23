const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guests = new Schema(
  {},
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

guests.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("guests", guests);
