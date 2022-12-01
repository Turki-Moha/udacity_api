import client from '../database'

export type Order = {
    id?:number;
    user_id:number;
    status:string;
};

export class Orders{
    async index():Promise<Order[]>{
        try{
            const conn = await client.connect()
            const sql = "SELECT * FROM orders"

            const result = await conn.query(sql)

            conn.release()
            return result.rows 
        }catch(err){
            throw new Error(`Could not retrive orders. Error: ${err}`)
        }
    }

    async create(product:Order):Promise<Order>{
        try{
            const sql = "INSERT INTO orders (user_id,status) VALUES ($1,$2) RETURNING *)"
            const conn = await client.connect()
            const result = await conn.query(sql, [product.user_id,product.status])

            conn.release()

            return result.rows[0]
        }catch(err){
            throw new Error(`Could not insert new order ${product.id}. Error: ${err}`)
        }
    }

    async show(userID:string):Promise<Object>{
        try{
            const sql = "SELECT order.*,products.name,products.price,order_products.quantity, FROM orders LEFT JOIN orders_products ON order_products.order_id = orders.id LEFT JOIN products ON order_products.product_id WHERE user_id =($1) AND status='open'"

            const conn = await client.connect()
            const result = await conn.query(sql,[userID])
            conn.release()
            return result.rows
        }catch(err){
            throw new Error(`Could not retrive order for the user ${userID}. Error:${err}`)
        }
    }

    async delete(id:string):Promise<Order>{
        try{
            const sql = "DELETE FROM orders WHERE id = ($1)"
            const conn = await client.connect()

            const result = await conn.query(sql,[id])

            conn.release()

            return result.rows[0]
        }catch(err){
            throw new Error(`cound not remove order ${id}. Error:${err}`)
        }
    }

    // the following code is from Udacity course
    async addProduct(
        quantity: number, 
        orderId: string, 
        productId: string
    ):Promise<Order> {
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await client.connect()
        
            const result = await conn.query(ordersql, [orderId])
        
            const order = result.rows[0]
        
            if (order.status !== "open") {
                throw new Error(`Could not add product ${productId} to order 
                ${orderId} because order status is ${order.status}`)
            }
        
            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }
    
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
            //@ts-ignore
            const conn = await client.connect()
        
            const result = await conn.query(sql, [quantity, orderId, productId])
        
            const order = result.rows[0]
        
            conn.release()
        
            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
    }
}