import mongoose from "mongoose";

const hamaSchema = new mongoose.Schema({
    nama_hama: { type: String, required: true },
    deskripsi: { type: String },
});

export default mongoose.model("Hama", hamaSchema);
