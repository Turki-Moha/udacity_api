import client from '../database'

export type Product = {
    id?:number;
    name:string;
    price:number;
}

export class Products{
    async index():Promise<Product[]>{
        try{
            const conn = await client.connect()
            const sql = "SELECT * FROM products"

            const result = await conn.query(sql)

            conn.release()
            return result.rows 
        }catch(err){
            throw new Error(`Could not retrive products. Error: ${err}`)
        }
    }

    async create(product:Product):Promise<Product>{
        try{
            const sql = "INSERT INTO products (name,price) VALUES ($1,$2) RETURNING *)"
            const conn = await client.connect()
            const result = await conn.query(sql, [product.name,product.price])

            conn.release()

            return result.rows[0]
        }catch(err){
            throw new Error(`Could not insert new order ${product.id}. Error: ${err}`)
        }
    }

    async show(productID:string):Promise<Product>{
        try{
            const sql = "SELECT * FROM products WHERE id=($1)"

            const conn = await client.connect()
            const result = await conn.query(sql,[productID])
            conn.release()
            return result.rows[0]
        }catch(err){
            throw new Error(`Could not retrive product: ${productID}. Error:${err}`)
        }
    }

    async delete(productID:string):Promise<Product>{
        try{
            const sql = "DELETE FROM products WHERE id = ($1)"
            const conn = await client.connect()

            const result = await conn.query(sql,[productID])

            conn.release()

            return result.rows[0]
        }catch(err){
            throw new Error(`cound not remove order ${productID}. Error:${err}`)
        }
    }

    // the following code is from Udacity course
    async addProduct(
        quantity: number, 
        userID: string, 
        productId: string
    ):Promise<Product> {
        let newOrderID
        try {
            const ordersql = "SELECT * FROM orders WHERE id=($1) AND status='active'"
            const conn = await client.connect()
        
            const result = await conn.query(ordersql, [userID])
        
            const order = result.rows
        
            if (!order) {
                const addProductQuery = "INSERT INTO orders (user_id,status) VALUES ($1,'active') RETURNING *"
                const result = await conn.query(addProductQuery,[userID])
                newOrderID = result.rows[0].id
            }else
                newOrderID = order[0].id
        
            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }
    
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
            //@ts-ignore
            const conn = await client.connect()
        
            const result = await conn.query(sql, [quantity, newOrderID, productId])
        
            const order = result.rows[0]
        
            conn.release()
        
            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${newOrderID}: ${err}`)
        }
    }
}
