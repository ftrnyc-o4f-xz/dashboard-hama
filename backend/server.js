import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/mongoose.js";
import config from "./config/index.js";
import { setupMqtt } from "./mqttHandler.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: [
            "https://dashboard-hama.vercel.app",
            "https://dashboard-hama-3c7uurcj9-dashboard-hamas-projects.vercel.app"
        ],
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// DB
connectDB();

// MQTT
setupMqtt(io);

// routes
import authRoutes from "./src/routes/auth.routes.js";
import detectionsRoutes from "./src/routes/detections.routes.js";
import analysisRoutes from "./src/routes/analysis.routes.js";

app.use(`/api${config.apiPrefix}/auth`, authRoutes);
app.use(`/api${config.apiPrefix}/detections`, detectionsRoutes);
app.use(`/api${config.apiPrefix}/analysis`, analysisRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
