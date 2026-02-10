import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/mongoose.js";
import config from "./config/index.js";
import { setupMqtt } from "./mqttHandler.js";

const app = express();

/* =========================
   CORS CONFIG 
========================= */
const allowedOrigins = [
    "https://dashboard-hama.vercel.app",
    "https://dahsboard-hama.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* =========================
   HTTP + SOCKET SERVER
========================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"] // Match frontend
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
