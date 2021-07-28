const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guestResults = new Schema(
  {
    guest_id: { type: mongoose.ObjectId, index: true },
    result: [[{ type: Object }]],
  },
  {
    strict: false,
    versionKey: false,
    timestamps: true,
  }
);

guestResults.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("guestResults", guestResults);
