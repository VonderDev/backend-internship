const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comments = new Schema(
  {
    comment_body: { type: String, default: "-" },
    uid: { type: mongoose.ObjectId },
    content_id: { type: mongoose.ObjectId, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("comments", comments);
