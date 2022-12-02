import client from '../database';

export interface Order {
  id: number;
  user_id: number;
  status: string;
}

export class Orders {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';

      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive orders. Error: ${err}`);
    }
  }

  async create(product: Order): Promise<Order> {
    try {
      const sql = `INSERT INTO orders (id,user_id,status) VALUES (DEFAULT,$1,$2) RETURNING *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [
        product.user_id as unknown as number,
        product.status,
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not insert new order ${product.id}. Error: ${err}`
      );
    }
  }

  async show(userID: string): Promise<Object> {
    try {
      const sql = `SELECT * FROM orders O LEFT JOIN order_products OP on OP.order_id = o.id LEFT JOIN products P ON OP.product_id = P.id  WHERE user_id =($1) AND status='active'`;

      const conn = await client.connect();

      const result = await conn.query(sql, [userID as unknown as number]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not retrive order for the user ${userID}. Error:${err}`
      );
    }
  }

  async delete(orderID: string): Promise<Order> {
    try {
      const sql = `DELETE FROM orders WHERE id = ($1)`;
      const conn = await client.connect();

      const result = await conn.query(sql, [orderID]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cound not remove order ${orderID}. Error:${err}`);
    }
  }

  // the following code is from Udacity course
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const sql = `SELECT * FROM orders WHERE id=($1)`;
      const conn = await client.connect();

      const result = await conn.query(sql, [orderId]);

      if (result.rows[0] !== 'active') {
        throw new Error(`Could not add product ${productId} to order 
                ${orderId} because order status is ${result.rows[0].status}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql = `INSERT INTO order_products (id,order_id,product_id,quantity) VALUES(DEFAULT,$1, $2, $3) RETURNING *`;
      const conn = await client.connect();

      const result = await conn.query(sql, [orderId, productId, quantity]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
}
