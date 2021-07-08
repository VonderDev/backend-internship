const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const admins = new Schema(
  {
    name: { type: String, default: "-" },
    lastname: { type: String, default: "-" },
    username: { type: String, default: "-" },
    email: { type: String, default: "-" },
    password: { type: String, default: "-" },
    image: { type: String, default: "-" },
    deleteAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("admins", admins);
