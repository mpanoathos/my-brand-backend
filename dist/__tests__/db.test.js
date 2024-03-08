"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("../config/db"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = new mongodb_memory_server_1.MongoMemoryServer();
    const mongoUri = yield mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    // Mocking the mongoose connection
    jest.spyOn(mongoose_1.default, 'connect').mockImplementation(() => Promise.resolve({}));
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe('Database Connection', () => {
    it('should connect to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.default)();
        // Add more assertions based on your application's behavior
        // For example, you can check if the connection is successful or if certain collections exist
        expect(mongoose_1.default.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, expect.any(Object));
    }));
    // Add more tests as needed
});
//# sourceMappingURL=db.test.js.map