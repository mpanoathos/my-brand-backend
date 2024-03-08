import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;

  // Mocking the mongoose connection
  jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve({} as mongoose.Mongoose));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    await connectDB();
    // Add more assertions based on your application's behavior
    // For example, you can check if the connection is successful or if certain collections exist
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, expect.any(Object));
  });

  // Add more tests as needed
});
