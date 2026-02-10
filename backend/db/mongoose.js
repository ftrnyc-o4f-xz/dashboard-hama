import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import User from "../src/models/user.model.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl);
    console.log("✅ MongoDB connected");

    // Otomatis buat admin jika belum ada (untuk antisipasi deploy pertama)
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        email: "admin@sitani.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("🚀 Otomatis membuat user admin: admin / admin123");
    }

  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

export default connectDB;

