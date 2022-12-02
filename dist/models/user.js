"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
class Users {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = `SELECT * FROM users`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive users. Error: ${err}`);
        }
    }
    async create(userID) {
        try {
            const conn = await database_1.default.connect();
            const sql = `INSERT INTO users (id,first_name,last_name,password) VALUES (DEFAULT,$1,$2,$3) RETURNING *`;
            const hashedPassword = bcrypt_1.default.hashSync(userID.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS));
            const result = await conn.query(sql, [
                userID.first_name,
                userID.last_name,
                hashedPassword,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create new user ${userID.first_name}. Error: ${err}`);
        }
    }
    async show(userid) {
        try {
            const sql = `SELECT * FROM users WHERE id=($1)`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [userid]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not retrive users: ${userid}. Error:${err}`);
        }
    }
    async delete(userid) {
        try {
            const sql = `DELETE FROM users WHERE id = ($1)`;
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [userid]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`cound not remove order ${userid}. Error:${err}`);
        }
    }
    async authenticate(userID, password) {
        const conn = await database_1.default.connect();
        const sql = `SELEC password_digest FROM users WHERE id=($1)`;
        const result = await conn.query(sql, [userID]);
        if (result.rows.length) {
            const userResult = result.rows[0];
            if (bcrypt_1.default.compareSync(userResult.password_digest, password + BCRYPT_PASSWORD)) {
                return userResult;
            }
        }
        return null;
    }
}
exports.Users = Users;
