import dotenv from "dotenv";
dotenv.config();

// Central configuration
export default {
  apiPrefix: "/v1",
  dbUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/iot_dashboard",
  jwtSecret: process.env.JWT_SECRET || "smart_farm_secret_key",
};

