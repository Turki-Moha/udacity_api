"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const products_1 = __importDefault(require("./handlers/products"));
const users_1 = __importDefault(require("./handlers/users"));
const orders_1 = __importDefault(require("./handlers/orders"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const address = "localhost:3000";
app.use(body_parser_1.default.json());
const corsOptions = {
    origin: 'http://localhost',
    optionSuccessStatus: 200
};
dotenv_1.default.config();
const { PORT } = process.env;
app.use((0, cors_1.default)(corsOptions));
products_1.default.productRoute(app);
users_1.default.usersRoute(app);
orders_1.default.ordersRoute(app);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(PORT, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
