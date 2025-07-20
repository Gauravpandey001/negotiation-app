const express = require("express");
const router = express.Router();
const AcceptedOffer = require("../models/AcceptedOffer");

router.get("/:roomCode", async (req, res) => {
  try {
    const { roomCode } = req.params;
    const offers = await AcceptedOffer.find({ roomCode }).sort({ createdAt: -1 });

    res.status(200).json(offers);
  } catch (error) {
    console.error("❌ Error fetching offers:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;