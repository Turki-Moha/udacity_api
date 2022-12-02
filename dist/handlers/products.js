"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new product_1.Products();
const productRoute = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.post('/products/addProduct', addProduct);
};
const index = async (_req, res) => {
    try {
        const retriveProducts = await store.index();
        res.json(retriveProducts);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured while retreving data');
        return;
    }
};
const create = async (req, res) => {
    try {
        jsonwebtoken_1.default.verify(req.headers.authorization, process.env.TOKEN);
    }
    catch (err) {
        res.status(401);
        res.json('invalid token');
    }
    try {
        const product = {
            name: req.body.name,
            price: req.body.price,
        };
        const createProducts = await store.create(product);
        res.json(createProducts);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured While inserting the product');
        return;
    }
};
const show = async (req, res) => {
    try {
        const product = await store.show(req.params.id);
        if (!product) {
            res.status(404);
            res.json('Product not found');
        }
        else
            res.json(product);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured while retriving data');
        return;
    }
};
const addProduct = async (req, res) => {
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.TOKEN);
    }
    catch (err) {
        res.status(401);
        res.json('invalid token');
        return;
    }
    try {
        const product = await store.addProduct(req.body.quantity, jwtPayload.user.id, req.body.product_id);
        res.json(product);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured while inserting new product');
        return;
    }
};
exports.default = {
    index,
    create,
    show,
    addProduct,
    productRoute,
};
