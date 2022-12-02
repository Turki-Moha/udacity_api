import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import products from './handlers/products'
import users from './handlers/users'
import orders from './handlers/orders'
import dotenv from 'dotenv'

const app: express.Application = express()
const address: string = "localhost:3000"

app.use(bodyParser.json())

const corsOptions = {
    origin:'http://localhost',
    optionSuccessStatus: 200
}
dotenv.config()
const {PORT}=process.env

app.use(cors(corsOptions))

products.productRoute(app)
users.usersRoute(app)
orders.ordersRoute(app)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(PORT, function () {
    console.log(`starting app on: ${address}`)
})

export default app