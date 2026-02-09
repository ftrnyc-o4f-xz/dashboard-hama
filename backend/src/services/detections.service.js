import Detection from "../models/detection.model.js";

// Responsibilities: business logic for detections
export const fetchLatestDetections = async (limit = 50) => {
  // Ambil data deteksi, urutkan berdasarkan waktu descending (Sesuai Class Diagram)
  return await Detection.getDataTerbaru(limit);
};

export const fetchTodayDetections = async () => {
  return await Detection.getTodayDetections();
};

export const createDetectionRecord = async (payload) => {
  const detection = new Detection(payload);
  return await detection.save();
};

