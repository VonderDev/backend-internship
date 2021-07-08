const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const summarise = new Schema(
  {
    category_id: { type: Number, default: "-" },
    description: { type: String, default: "-" },
    description_career: { type: String, default: "-" },
    image_charactor: { type: String, default: "-" },
    skill_summarize: { type: String, default: "-" },
    charactor_summarize: { type: String, default: "-" },
    skill: { type: String, default: "-" },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("summarise", summarise);
