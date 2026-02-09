import mongoose from "mongoose";
import { connectDB } from "./db/mongoose.js";
import Detection from "./src/models/detection.model.js";

const clearData = async () => {
    try {
        await connectDB();
        console.log("🧹 Memulai pembersihan data...");

        const result = await Detection.deleteMany({});
        console.log(`✅ Berhasil menghapus ${result.deletedCount} data lama.`);

        console.log("🚀 Selesai! Sekarang jalankan simulator lagi untuk data Burung, Wereng, Tikus.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

clearData();
