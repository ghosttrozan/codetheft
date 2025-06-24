// Update your Redis client configuration in @/lib/redis
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  lazyConnect: true,
});

// Add connection event handlers
redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
