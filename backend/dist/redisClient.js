"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ioredis_1 = __importDefault(require("ioredis"));
// Logging environment variables (ensure these are set correctly)
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_PASSWORD:', process.env.REDIS_PASS);
// Creating Redis client
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined, // Redis port
    password: process.env.REDIS_PASS, // Password
    retryStrategy: (times) => {
        // Retry only if an error occurs and limit the retries
        return times < 3 ? Math.min(times * 50, 2000) : null; // 3 retries max
    },
    maxRetriesPerRequest: 3, // Retry limit for requests
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Redis successfully!");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient.on("close", () => {
    console.log("❌ Redis connection closed.");
});
redisClient.on("reconnecting", () => {
    console.log("🔄 Reconnecting to Redis...");
});
exports.default = redisClient;
//https://console.upstash.com/redis/2b6762e0-bbad-49ff-b690-21af8f7759d5?teamid=0
