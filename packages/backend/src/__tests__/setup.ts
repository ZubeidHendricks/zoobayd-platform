import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Redis from 'ioredis-mock';

let mongod: MongoMemoryServer;

// Mock Redis
jest.mock('../config/redis', () => {
  return {
    redis: new Redis(),
    cacheGet: jest.fn(),
    cacheSet: jest.fn()
  };
});

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});