import mongoose from "mongoose";

export const connectDb = async (uri) => {
  try {
    const mongoUri = uri || process.env.MONGO_URI || "mongodb://localhost:27017/leaf-notes";
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[db] connected to ${mongoUri}`);
  } catch (err) {
    console.error("[db] connection error", err.message);
    process.exit(1);
  }
};
