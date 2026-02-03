const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipient",
        required: true,
      },
      bloodGroup: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Fulfilled", "Cancelled"],
        default: "Pending",
      },
      requestDate: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Request", requestSchema);