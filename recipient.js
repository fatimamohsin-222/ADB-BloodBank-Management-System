const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipient", recipientSchema);
