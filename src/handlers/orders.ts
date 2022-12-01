import express, {Request,Response} from 'express'
import { Order,Orders } from '../models/order'
import jwt,{JwtPayload} from 'jsonwebtoken'

const ordersRoute = (app:express.Application) =>{
    app.get('/orders',show)
}

const store = new Orders()

const show = async (_req:Request, res: Response) => {
    try{
        const token = jwt.verify(
            _req.headers.authorization as string,
            process.env.TOKEN_SECRET as string           
            )as JwtPayload
    }catch(err){
        res.status(401)
        res.json('invalid token')
        return
    }
    try {
        const token = jwt.verify(
            _req.headers.authorization as string,
            process.env.TOKEN_SECRET as string           
            )as JwtPayload
        const order = await store.show(token.user as string)
        res.json(order)
    }catch(err){
        res.status(500)
        res.json("Error Occured while retriving your order")
    }

}

export default {
    show,
    ordersRoute
}