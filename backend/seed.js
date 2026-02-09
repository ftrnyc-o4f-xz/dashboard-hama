import mongoose from "mongoose";
import Detection from "./src/models/detection.model.js";
import config from "./config/index.js";

const seedData = async () => {
    try {
        console.log("🌱 Menghubungkan ke database untuk simulasi...");
        await mongoose.connect(config.dbUrl);

        // Bersihkan data lama agar bersih
        await Detection.deleteMany({});
        console.log("🧹 Data lama dibersihkan.");

        const hamaJenis = ["Tikus", "Wereng", "Burung Pipit"];
        const desaTempuran = ["Desa Tempuran", "Desa Pagadungan", "Desa Dayeuhluhur", "Desa Cikuntul"];
        const dummyDetections = [];

        // Buat data untuk 7 hari terakhir
        for (let i = 0; i < 60; i++) {
            const date = new Date();
            date.setHours(date.getHours() - Math.floor(Math.random() * 168));

            dummyDetections.push({
                jenis_hama: hamaJenis[Math.floor(Math.random() * hamaJenis.length)],
                jumlah: Math.floor(Math.random() * 20) + 1,
                waktu_deteksi: date,
                lokasi: desaTempuran[Math.floor(Math.random() * desaTempuran.length)] + ", Karawang",
                sumber_alat: "SiTani-Node-" + (Math.floor(Math.random() * 3) + 1)
            });
        }

        await Detection.insertMany(dummyDetections);
        console.log(`✅ Berhasil menyuntikkan ${dummyDetections.length} data simulasi!`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Gagal simulasi:", err);
        process.exit(1);
    }
};

seedData();
