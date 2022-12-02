"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const supertest_1 = __importDefault(require("supertest"));
const orders_1 = __importDefault(require("../handlers/orders"));
const server_1 = __importDefault(require("../server"));
const store = new order_1.Orders();
describe('Order model test', () => {
    it('Should include index method', () => {
        expect(store.index).toBeDefined();
    });
    it('Should return empty when given a user with number 100', async () => {
        const res = await store.show('100');
        expect(res).toEqual([]);
    });
});
describe('Orders handlers', () => {
    it('Should include show method', () => {
        expect(orders_1.default.show).toBeDefined();
    });
    it('Should send an unauthorized access', () => {
        return (0, supertest_1.default)(server_1.default)
            .get('/orders')
            .set('Accept', 'application/json')
            .expect(401);
    });
});
