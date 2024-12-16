const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Model
const AuctionItem = mongoose.model(
  "AuctionItem",
  new mongoose.Schema({
    title: String,
    description: String,
    start_price: Number,
    reserve_price: Number,
  }),
  'auctions'  // Explicitly specify the collection name
);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    // Log database information
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    console.log("Current database name:", db.databaseName);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Search Route
app.get("/api/search", async (req, res) => {
  const { keyword } = req.query;

  // Validate keyword
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ message: "Keyword is required" });
  }

  try {
    const query = {
      $or: [
        { title: { $regex: new RegExp(keyword, "i") } }, // Case-insensitive regex for title
        { description: { $regex: new RegExp(keyword, "i") } }, // Case-insensitive regex for description
      ],
    };

    console.log("Query:", query); // Log the constructed query

    const results = await AuctionItem.find(query); // Execute the query
    console.log("Results:", results); // Log the results

    res.status(200).json(results); // Respond with the results
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

// Debugging Route to Fetch All Data
app.get("/api/test", async (req, res) => {
  try {
    console.log('Attempting to fetch all items...');
    console.log('Collection name:', AuctionItem.collection.name);
    console.log('Database name:', mongoose.connection.db.databaseName);
    const results = await AuctionItem.find();
    console.log('Query results:', results);
    console.log('Number of items found:', results.length);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

// Debug route to check raw collections
app.get("/api/debug", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const auctionsData = await db.collection('auctions').find({}).toArray();
    const auctionitemsData = await db.collection('auctionitems').find({}).toArray();
    
    res.json({
      auctions: {
        count: auctionsData.length,
        data: auctionsData
      },
      auctionitems: {
        count: auctionitemsData.length,
        data: auctionitemsData
      }
    });
  } catch (error) {
    console.error("Debug route error:", error);
    res.status(500).json({ message: "Error in debug route", error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
