"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var products_1 = __importDefault(require("./handlers/products"));
var users_1 = __importDefault(require("./handlers/users"));
var orders_1 = __importDefault(require("./handlers/orders"));
var app = (0, express_1["default"])();
var address = "localhost:3000";
app.use(body_parser_1["default"].json());
var corsOptions = {
    origin: 'http://localhost',
    optionSuccessStatus: 200
};
app.use((0, cors_1["default"])(corsOptions));
products_1["default"].productRoute(app);
users_1["default"].usersRoute(app);
orders_1["default"].ordersRoute(app);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    console.log("starting app on: ".concat(address));
});
exports["default"] = app;
