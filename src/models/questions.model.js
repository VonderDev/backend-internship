const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questions = new Schema(
  {
    questionIndex: { type: String, default: "-" },
    category_id: { type: String, default: "-" },
    questionBody: { type: String, default: "-" },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("questions", questions);
