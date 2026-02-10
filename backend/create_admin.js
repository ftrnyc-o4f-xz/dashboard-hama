import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/user.model.js";

// Menggunakan MONGO_URL dari environment variable
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("❌ ERROR: MONGO_URL tidak ditemukan di environment variables!");
    process.exit(1);
}

async function createAdmin() {
    try {
        console.log("📡 Mencoba menghubungkan ke Database Railway...");
        await mongoose.connect(MONGO_URL);
        console.log("✅ Terhubung ke Database.");

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const adminUser = {
            username: "admin",
            email: "admin@sitani.com",
            password: hashedPassword,
            role: "admin"
        };

        const existing = await User.findOne({ username: "admin" });
        if (existing) {
            console.log("⚠️ User 'admin' sudah ada di database.");
        } else {
            await User.create(adminUser);
            console.log("🚀 BERHASIL! User admin telah dibuat.");
            console.log("---------------------------");
            console.log("Username: admin");
            console.log("Password: admin123");
            console.log("---------------------------");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Gagal membuat admin:", err);
        process.exit(1);
    }
}

createAdmin();
