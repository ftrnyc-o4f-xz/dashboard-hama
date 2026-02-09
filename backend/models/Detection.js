import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  jenis_hama: String,
  waktu: String,
  jumlah: Number,
});

export default mongoose.model("Detection", detectionSchema);
