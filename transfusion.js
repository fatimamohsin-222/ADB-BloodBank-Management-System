const mongoose = require('mongoose');
const transfusionSchema = new mongoose.Schema(
    {
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true,
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipient",
        required: true,
      },
      bloodGroup: {
        type: String,
        required: true,
      },
      transfusionDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["Successful", "Failed"],
        default: "Successful",
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Transfusion", transfusionSchema);