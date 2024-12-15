#!/usr/bin/env node

const mongoose = require("mongoose");
const fs = require("fs");
const { program } = require("commander");
require("dotenv").config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  start_price: Number,
  reserve_price: Number,
});

const Auction = mongoose.model("Auction", auctionSchema);

const seedData = async () => {
  const data = JSON.parse(
    fs.readFileSync("./data/auction_items.json", "utf-8")
  );
  await Auction.deleteMany(); // Clean slate
  await Auction.insertMany(data);
  console.log("Data seeded successfully");
};

const deleteData = async () => {
  await Auction.deleteMany();
  console.log("All data deleted successfully");
};

program
  .command("seed")
  .description("Seed data into the database")
  .action(async () => {
    await connectDB();
    await seedData();
    mongoose.connection.close();
  });

program
  .command("delete")
  .description("Delete all data from the database")
  .action(async () => {
    await connectDB();
    await deleteData();
    mongoose.connection.close();
  });

program.parse(process.argv);
