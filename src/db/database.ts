import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB || "mongodb://localhost:27017/gym-manager";

export async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default mongoose;
