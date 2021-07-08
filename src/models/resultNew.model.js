const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultNew = new Schema(
  {
    userid: { type: mongoose.ObjectId, index: true },
    results: [[{ type: Number }]],
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("resultNew", resultNew);
