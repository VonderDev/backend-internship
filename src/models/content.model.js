const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contents = new Schema(
  {
    content_body: { type: String, default: "-" },
    title: { type: String, default: "-" },
    uid_likes: [{ type: [mongoose.ObjectId], default: ["-"] }],
    author_id: { type: mongoose.ObjectId, defalut: "-" },
    tag: { type: [String], defalut: ["-"] },
    content_type: { type: String, default: "board", require: true },
    image: { type: String, default: "-" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("contents", contents);
