import express from "express";
import { listRecommendations } from "../controllers/analysis.controller.js";

const router = express.Router();

router.get("/", listRecommendations);

export default router;
