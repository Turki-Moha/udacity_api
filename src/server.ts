import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import products from './handlers/products'
import users from './handlers/users'
import orders from './handlers/orders'

const app: express.Application = express()
const address: string = "localhost:3000"

app.use(bodyParser.json())

const corsOptions = {
    origin:'http://localhost',
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

products.productRoute(app)
users.usersRoute(app)
orders.ordersRoute(app)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app