import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    detection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Detection", required: true },
    hasil_rekomendasi: { type: String, required: true },
    waktu: { type: Date, default: Date.now },
});

export default mongoose.model("Recommendation", recommendationSchema);
