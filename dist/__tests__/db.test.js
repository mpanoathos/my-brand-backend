var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    it('should connect to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock successful connection
        const mockConnection = {
            connection: {
                host: 'localhost',
            },
        };
        mongoose.connect.mockResolvedValueOnce(mockConnection);
        // Call the function
        yield connectDB();
        // Check if mongoose.connect is called with the correct URI
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI_TEST);
        // Check if console.log is called with the expected message
        expect(console.log).toHaveBeenCalledWith('Database connected localhost');
    }));
    it('should handle database connection error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock connection error
        const mockError = new Error('Connection failed');
        mongoose.connect.mockImplementationOnce(() => {
            throw mockError;
        });
        // Call the function
        yield connectDB();
        // Check if console.log is called with the error message
        expect(console.log).toHaveBeenCalledWith(mockError);
    }));
});
//# sourceMappingURL=db.test.js.map