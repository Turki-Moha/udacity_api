"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new user_1.Users();
const usersRoute = (app) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
};
const index = async (req, res) => {
    try {
        jsonwebtoken_1.default.verify(req.headers.authorization, process.env.TOKEN);
    }
    catch (err) {
        res.status(401);
        res.json('invalid token');
        return;
    }
    try {
        const user = await store.index();
        res.json(user);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured while retriving user');
        return;
    }
};
const create = async (_req, res) => {
    const user = {
        first_name: _req.body.first_name,
        last_name: _req.body.last_name,
        password: _req.body.password,
    };
    try {
        const newUserToken = await store.create(user);
        let token = jsonwebtoken_1.default.sign({ user: newUserToken }, process.env.TOKEN);
        res.json(token);
    }
    catch (err) {
        res.status(500);
        res.json('Error while creating token');
    }
};
const show = async (req, res) => {
    try {
        jsonwebtoken_1.default.verify(req.headers.authorization, process.env.TOKEN);
    }
    catch (err) {
        res.status(401);
        res.json('invalid token');
        return;
    }
    try {
        const id = req.params.id.replace(':', '');
        const user = await store.show(id);
        if (!user) {
            res.status(404);
            res.json('page not found');
        }
        else
            res.json(user);
    }
    catch (err) {
        res.status(500);
        res.json('Error occured while retriving user');
        return;
    }
};
exports.default = {
    usersRoute,
    index,
    show,
    create,
};
