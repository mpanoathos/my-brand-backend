var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = new MongoMemoryServer();
    const mongoUri = yield mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    // Mocking the mongoose connection
    jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve({}));
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.disconnect();
    yield mongoServer.stop();
}));
describe('Database Connection', () => {
    it('should connect to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        yield connectDB();
        // Add more assertions based on your application's behavior
        // For example, you can check if the connection is successful or if certain collections exist
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, expect.any(Object));
    }));
    // Add more tests as needed
});
//# sourceMappingURL=db.test.js.map