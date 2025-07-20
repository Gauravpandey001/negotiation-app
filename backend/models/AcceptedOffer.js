const mongoose = require("mongoose");

const acceptedOfferSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  acceptedBy: {
    type: String,
    required: true,
  },
  acceptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AcceptedOffer", acceptedOfferSchema);