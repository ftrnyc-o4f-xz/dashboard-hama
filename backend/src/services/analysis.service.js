import Detection from "../models/detection.model.js";

// Responsibilities: implement recommendation rules based on detection data
export const getRecommendations = async () => {
  // 1. Mengambil data deteksi hama (Fokus ke 3 hama utama)
  const allLatest = await Detection.find().sort({ waktu_deteksi: -1 }).limit(30);
  const focusedPests = ["burung", "wereng", "tikus"];

  // Hanya ambil data yang masuk kategori fokus
  const latestDetections = allLatest.filter(d =>
    focusedPests.includes(d.jenis_hama?.toLowerCase())
  ).slice(0, 10);

  if (latestDetections.length === 0) {
    return null; // Memenuhi alur "Tidak memenuhi rule / Belum ada data"
  }

  // 2. Mengambil rule rekomendasi (Logika Rule-Based)
  const totalHama = latestDetections.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);
  const avgHama = totalHama / latestDetections.length;
  const dominantPest = [...new Set(latestDetections.map(d => d.jenis_hama))][0];

  // 3. Menentukan rekomendasi berdasarkan kondisi (Decision Box)
  let recommendations = [];

  // Rekomendasi Umum berdasarkan Ambalng Batas
  if (avgHama > 10) {
    recommendations.push({
      tingkat: "Bahaya",
      hama: dominantPest,
      tindakan: "Populasi sangat tinggi! Segera lakukan pengendalian kimiawi atau fisik secara massal.",
      warna: "bg-red-50 text-red-600 border-red-200"
    });
  } else if (avgHama > 5) {
    recommendations.push({
      tingkat: "Waspada",
      hama: dominantPest,
      tindakan: "Kondisi waspada. Siapkan alat pengusir hama dan pantau pergerakan hama setiap 3 jam.",
      warna: "bg-amber-50 text-amber-600 border-amber-200"
    });
  }

  // Rekomendasi Spesifik (FOKUS: BURUNG, WERENG, TIKUS)
  const pestInput = dominantPest?.toLowerCase();

  if (pestInput === "burung") {
    recommendations.push({
      tingkat: "Spesifik",
      hama: "Burung",
      tindakan: "Gunakan bunyi-bunyian (kaleng) atau orang-orangan sawah untuk mengusir burung di siang hari.",
      warna: "bg-sky-50 text-sky-600 border-sky-200"
    });
  } else if (pestInput === "wereng") {
    recommendations.push({
      tingkat: "Spesifik",
      hama: "Wereng",
      tindakan: "Kurangi penggunaan pupuk urea berlebih dan gunakan lampu perangkap (light trap) di malam hari.",
      warna: "bg-emerald-50 text-emerald-600 border-emerald-200"
    });
  } else if (pestInput === "tikus") {
    recommendations.push({
      tingkat: "Spesifik",
      hama: "Tikus",
      tindakan: "Pasang Trap Barrier System (TBS) dan bersihkan pematang dari rumput liar agar tidak jadi sarang.",
      warna: "bg-orange-50 text-orange-600 border-orange-200"
    });
  }

  // Fallback jika populasi rendah dan tidak ada rekomendasi spesifik yang berat
  if (recommendations.length === 0) {
    recommendations.push({
      tingkat: "Aman",
      hama: "Semua",
      tindakan: "Kondisi lahan terpantau aman. Lanjutkan pemantauan rutin lewat dashboard.",
      warna: "bg-emerald-50 text-emerald-600 border-emerald-200"
    });
  }

  return recommendations;
};
