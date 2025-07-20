const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  message: { type: String, required: true },
  from: { type: String, required: true },        // User who created the offer
  acceptedBy: { type: String, required: true },  // User who accepted
  participants: {
    type: [String],                               // Array of both usernames
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;