import express from "express";
import { listDetections, listTodayDetections, createDetection } from "../controllers/detections.controller.js";

const router = express.Router();

router.get("/", listDetections);
router.get("/today", listTodayDetections);
router.post("/", createDetection);

export default router;
