import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/mongoose.js";
import config from "./config/index.js";
import { setupMqtt } from "./mqttHandler.js";

const app = express();

app.get("/", (req, res) => {
    res.json({ status: "Backend SiTani Smart is Running! 🚀" });
});

const allowedOrigins = [
    "https://dashboard-hama.vercel.app",
    "https://dahsboard-hama.vercel.app",
    "http://localhost:5173"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`[${req.method}] ${req.url} - Origin: ${origin}`);

    if (origin && (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.includes("localhost"))) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        // Fallback ke domain utama, jangan pakai '*' karena credentials: true
        res.setHeader("Access-Control-Allow-Origin", "https://dashboard-hama.vercel.app");
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

/* =========================
   HTTP + SOCKET SERVER
========================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(null, true); // Permissive for debug, can be tightened later
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"]
});

/* =========================
   DATABASE & MQTT
========================= */
connectDB();
setupMqtt(io);

/* =========================
   ROUTES
========================= */
import authRoutes from "./src/routes/auth.routes.js";
import detectionsRoutes from "./src/routes/detections.routes.js";
import analysisRoutes from "./src/routes/analysis.routes.js";

app.use(`/api${config.apiPrefix}/auth`, authRoutes);
app.use(`/api${config.apiPrefix}/detections`, detectionsRoutes);
app.use(`/api${config.apiPrefix}/analysis`, analysisRoutes);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
