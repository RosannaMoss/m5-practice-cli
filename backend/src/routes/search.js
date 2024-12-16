const express = require("express");
const AuctionItem = require("../models/AuctionItem");
const router = express.Router();

// GET /search
router.get("/", async (req, res) => {
  const { keyword } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    console.log("Query:", query);
    const results = await AuctionItem.find(query);
    console.log("Results:", results);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

module.exports = router;
