import client from '../database';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  last_name: string;
  first_name: string;
  password: string;
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export class Users {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM users`;

      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive users. Error: ${err}`);
    }
  }

  async create(userID: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO users (id,first_name,last_name,password) VALUES (DEFAULT,$1,$2,$3) RETURNING *`;

      const hashedPassword = bcrypt.hashSync(
        userID.password + BCRYPT_PASSWORD,
        parseInt(<string>SALT_ROUNDS)
      );

      const result = await conn.query(sql, [
        userID.first_name,
        userID.last_name,
        hashedPassword,
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not create new user ${userID.first_name}. Error: ${err}`
      );
    }
  }

  async show(userid: number): Promise<User> {
    try {
      const sql = `SELECT * FROM users WHERE id=($1)`;

      const conn = await client.connect();
      const result = await conn.query(sql, [userid]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not retrive users: ${userid}. Error:${err}`);
    }
  }

  async delete(userid: string): Promise<User> {
    try {
      const sql = `DELETE FROM users WHERE id = ($1)`;
      const conn = await client.connect();

      const result = await conn.query(sql, [userid]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cound not remove order ${userid}. Error:${err}`);
    }
  }

  async authenticate(userID: string, password: string): Promise<null | User> {
    const conn = await client.connect();
    const sql = `SELEC password_digest FROM users WHERE id=($1)`;

    const result = await conn.query(sql, [userID]);

    if (result.rows.length) {
      const userResult = result.rows[0];
      if (
        bcrypt.compareSync(
          userResult.password_digest,
          password + BCRYPT_PASSWORD
        )
      ) {
        return userResult;
      }
    }
    return null;
  }
}
