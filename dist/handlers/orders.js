"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ordersRoute = (app) => {
    app.get('/orders', show);
};
const store = new order_1.Orders();
const show = async (_req, res) => {
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(_req.headers.authorization, process.env.TOKEN);
    }
    catch (err) {
        res.status(401);
        res.json('invalid token');
        return;
    }
    try {
        const order = await store.show(jwtPayload.user.id);
        res.json(order);
    }
    catch (err) {
        res.status(500);
        res.json('Error Occured while retriving your order');
    }
};
exports.default = {
    show,
    ordersRoute,
};
