import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function resetDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB || "mongodb://localhost:27017/gym-manager";
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Drop all collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    if (collections) {
      for (const collection of collections) {
        await mongoose.connection.db?.dropCollection(collection.name);
        console.log(`🗑️  Dropped collection: ${collection.name}`);
      }
    }

    console.log("✅ Database reset successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
