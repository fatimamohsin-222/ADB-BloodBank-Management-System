const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema(
    {
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true,
      },
      bloodGroup: {
        type: String,
        required: true,
      },
      donationDate: {
        type: Date,
        default: Date.now,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Donation", donationSchema);