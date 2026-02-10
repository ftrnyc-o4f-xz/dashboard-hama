import dotenv from "dotenv";
dotenv.config();

export default {
  apiPrefix: "/v1",
  dbUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || "smart_farm_secret_key",
};
