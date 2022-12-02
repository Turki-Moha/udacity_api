"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const products_1 = __importDefault(require("../handlers/products"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const store = new product_1.Products();
describe('Product Model test', () => {
    it('Should include an index', () => {
        expect(store.index).toBeDefined();
    });
    it('retrun an empty array from the index', async () => {
        const res = await store.index();
        expect(res).toEqual([]);
    });
    it('Should include a create', () => {
        expect(store.create).toBeDefined();
    });
    it('retrun an empty array from the index', async () => {
        const res = await store.create({
            name: 'laptop',
            price: 1000,
        });
        expect(res).toEqual({
            id: 1,
            name: 'laptop',
            price: 1000,
        });
    });
    it('index should return the new products', async () => {
        const res = await store.index();
        expect(res).toEqual([
            {
                id: 1,
                name: 'laptop',
                price: 1000,
            },
        ]);
    });
    it('index should return the new product by id', async () => {
        const res = await store.show('1');
        expect(res).toEqual({
            id: 1,
            name: 'laptop',
            price: 1000,
        });
    });
});
describe('Product handler test', () => {
    let token;
    beforeAll(() => {
        (0, supertest_1.default)(server_1.default)
            .post('/users')
            .send({ first_name: 'Hi', last_name: 'All', password: 'password' })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response) => {
            token = response.body;
        });
    });
    it('should include create method', () => {
        expect(products_1.default.create).toBeDefined();
    });
    it('should include show method', () => {
        expect(products_1.default.show).toBeDefined();
    });
    it('should include addProduct method', () => {
        expect(products_1.default.addProduct).toBeDefined();
    });
    it('should include index method', () => {
        expect(products_1.default.index).toBeDefined();
    });
    it('the index method should respond with a success code', () => {
        return (0, supertest_1.default)(server_1.default)
            .get('/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it('show should include json response', () => {
        return (0, supertest_1.default)(server_1.default)
            .get('/products/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it('should send an error if the product not found', () => {
        return (0, supertest_1.default)(server_1.default).get('/products/1000').expect(404);
    });
    it('should create a product successfully', () => {
        return (0, supertest_1.default)(server_1.default)
            .post('/products')
            .send({
            name: 'charger',
            price: 100,
        })
            .set('authorization', token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it('Should add a new product successfully', () => {
        return (0, supertest_1.default)(server_1.default)
            .post('/products/addProduct')
            .send({ product_id: 2, quantity: 3 })
            .set('authorization', token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});
