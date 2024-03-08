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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = __importDefault(require("../models/Post"));
describe('Blog Routes', () => {
    it('should retrieve all posts with an initial length of 0', () => __awaiter(void 0, void 0, void 0, function* () {
        // Clear existing posts or set up the test environment to ensure no posts exist
        const response = yield (0, supertest_1.default)(app_1.default).get('/blogs');
        expect(response.status).toBe(200);
        expect(response.body);
    }));
    it('should get a specific blog by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Set up the test environment if needed
        const postId = new mongoose_1.default.Types.ObjectId(); // Generate a valid ObjectId
        const testPost = new Post_1.default({
            _id: postId,
            title: 'Test Blog',
            body: 'This is a test blog content.',
            // other required fields
        });
        yield testPost.save();
        const response = yield (0, supertest_1.default)(app_1.default).get(`/blogs/${postId}`);
        // Assertions for retrieving a specific post
    }));
});
//# sourceMappingURL=route.test.js.map