const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guests = new Schema(
  {
    resultId: { type: mongoose.ObjectId, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("guests", guests);
