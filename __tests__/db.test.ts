// Import the function to test
import connectDB from '../config/db.js';
import mongoose from 'mongoose';

// Mock mongoose module
jest.mock('mongoose', () => ({
  set: jest.fn(),
  connect: jest.fn(),
}));

// Define environment variable
process.env.MONGODB_URI_TEST = 'mongodb+srv://athos:barera0009@cluster0.myuobr9.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

describe('connectDB function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  it('should connect to the database', async () => {
    // Mock successful connection
    const mockConnection = {
      connection: {
        host: 'localhost',
      },
    };
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockConnection);

    // Call the function
    await connectDB();

    // Check if mongoose.connect is called with the correct URI
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI_TEST);

    // Check if console.log is called with the expected message
    expect(console.log).toHaveBeenCalledWith('Database connected localhost');
  });

  it('should handle database connection error', async () => {
    // Mock connection error
    const mockError = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockImplementationOnce(() => {
      throw mockError;
    });

    // Call the function
    await connectDB();

    // Check if console.log is called with the error message
    expect(console.log).toHaveBeenCalledWith(mockError);
  });
});
