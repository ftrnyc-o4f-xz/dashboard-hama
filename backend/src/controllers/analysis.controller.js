import { getRecommendations } from "../services/analysis.service.js";


// Responsibilities: handle recommendation-related HTTP requests
export const listRecommendations = async (req, res, next) => {
    try {
        const recommendations = await getRecommendations();
        res.status(200).json({
            success: true,
            data: recommendations // Jika null, frontend akan menampilkan "Belum ada rekomendasi"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
