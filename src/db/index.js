// src/db/index.js

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the app on DB connection failure
  }
};

export default connectDB;
