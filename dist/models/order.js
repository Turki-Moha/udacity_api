"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const database_1 = __importDefault(require("../database"));
class Orders {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive orders. Error: ${err}`);
        }
    }
    async create(product) {
        try {
            const sql = `INSERT INTO orders (id,user_id,status) VALUES (DEFAULT,$1,$2) RETURNING *`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                product.user_id,
                product.status,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not insert new order ${product.id}. Error: ${err}`);
        }
    }
    async show(userID) {
        try {
            const sql = `SELECT * FROM orders O LEFT JOIN order_products OP on OP.order_id = o.id LEFT JOIN products P ON OP.product_id = P.id  WHERE user_id =($1) AND status='active'`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [userID]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive order for the user ${userID}. Error:${err}`);
        }
    }
    async delete(orderID) {
        try {
            const sql = `DELETE FROM orders WHERE id = ($1)`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [orderID]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`cound not remove order ${orderID}. Error:${err}`);
        }
    }
    // the following code is from Udacity course
    async addProduct(quantity, orderId, productId) {
        try {
            const sql = `SELECT * FROM orders WHERE id=($1)`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [orderId]);
            if (result.rows[0] !== 'active') {
                throw new Error(`Could not add product ${productId} to order 
                ${orderId} because order status is ${result.rows[0].status}`);
            }
            conn.release();
        }
        catch (err) {
            throw new Error(`${err}`);
        }
        try {
            const sql = `INSERT INTO order_products (id,order_id,product_id,quantity) VALUES(DEFAULT,$1, $2, $3) RETURNING *`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [orderId, productId, quantity]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
    }
}
exports.Orders = Orders;
