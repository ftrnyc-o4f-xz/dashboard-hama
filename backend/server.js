import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/mongoose.js";
import config from "./config/index.js";
import { setupMqtt } from "./mqttHandler.js";
import authRoutes from "./src/routes/auth.routes.js";
import detectionsRoutes from "./src/routes/detections.routes.js";
import analysisRoutes from "./src/routes/analysis.routes.js";
import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const app = express();

// 1. ULTRA PERMISSIVE CORS (The most aggressive fix)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, token");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// 2. Body Parser
app.use(express.json());

// 3. Request Logger
app.use((req, res, next) => {
    console.log(`>>> [${req.method}] ${req.url} | Origin: ${req.headers.origin}`);
    next();
});

// 4. Health Check
app.get("/", (req, res) => {
    res.json({
        status: "Backend SiTani Smart is Running! 🚀",
        db: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
        timestamp: new Date()
    });
});


/* =========================
   HTTP + SOCKET SERVER
 ========================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"]
});

/* =========================
   DATABASE & AUTO-ADMIN
 ========================= */
connectDB().then(async () => {
    console.log("🛠️  Checking Admin User...");
    try {
        const adminExists = await User.findOne({ username: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "admin",
                email: "admin@sitani.com",
                password: hashedPassword,
                role: "admin"
            });
            console.log("✅ AUTO-ADMIN CREATED: admin / admin123");
        } else {
            console.log("ℹ️  Admin user already exists.");
        }
    } catch (err) {
        console.error("❌ Failed to check/create admin:", err.message);
    }
});

setupMqtt(io);

/* =========================
   ROUTES
 ========================= */
app.use(`/api${config.apiPrefix}/auth`, authRoutes);
app.use(`/api${config.apiPrefix}/detections`, detectionsRoutes);
app.use(`/api${config.apiPrefix}/analysis`, analysisRoutes);

/* =========================
   ERROR HANDLERS
========================= */
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\n*****************************************`);
    console.log(`🚀 SITANI-SMART-V6 IS LIVE!`);
    console.log(`📡 PORT: ${PORT} | HOST: 0.0.0.0`);
    console.log(`*****************************************\n`);
});
