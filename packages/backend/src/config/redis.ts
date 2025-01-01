import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => Math.min(times * 50, 2000)
};

export const redis = new Redis(redisConfig);

// Cache utilities
export const cacheGet = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const cacheSet = async (key: string, data: any, ttl?: number) => {
  const serialized = JSON.stringify(data);
  if (ttl) {
    await redis.setex(key, ttl, serialized);
  } else {
    await redis.set(key, serialized);
  }
};