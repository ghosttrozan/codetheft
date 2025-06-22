// Update your Redis client configuration in @/lib/redis
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => Math.min(times * 50, 2000),
  // Enable offline queue to buffer commands when disconnected
  enableOfflineQueue: true,
  // Other recommended options
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true; // Reconnect on READONLY error
    }
    return false;
  },
  maxRetriesPerRequest: 3
});

// Add connection event handlers
redis.on('connect', () => console.log('Redis connected!'));
redis.on('error', (err) => console.error('Redis error:', err));

export default redis;