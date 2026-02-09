import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
    hama_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hama", required: true },
    ambang_batas: { type: Number, required: true },
    aksi: { type: String, required: true },
    status: { type: String, default: "active" },
});

export default mongoose.model("Rule", ruleSchema);
