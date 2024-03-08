var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import app from '../app.js';
describe('Integration Tests for app.ts', () => {
    it('should handle GET request to /api/docs', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get('/api/docs');
        expect(response.status).toBe(301);
        // Add more assertions based on your application's behavior
    }));
    // Add more integration tests for different routes and functionalities
});
//# sourceMappingURL=app.test.js.map