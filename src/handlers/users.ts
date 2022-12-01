import express, {Request,Response} from 'express'
import { User,Users } from '../models/user'
import jwt from 'jsonwebtoken'

const store = new Users()

const usersRoute = (app:express.Application) => {
    app.get('/users',index)
    app.get('/users/:id',show)
    app.post('/users',create)
}

const index = async (req:Request,res:Response) => {
    try{
        jwt.verify(
            req.headers.authorization as string,
            process.env.TOKEN_SECRET as string
            )
    }catch(err){
        res.status(401)
        res.json('invalid token')
        return
    }
    try{
        const user = await store.index()
        res.json(user)
    }catch(err){
        res.status(500)
        res.json('Error occured while retriving user')
        return
    }
}

const create = async(req:Request,res:Response) => {
    const user:User = {
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        password: req.body.password
    }
    try{
        const newUserToken = await store.create(user)
        let token = jwt.sign({user:newUserToken},process.env.TOKEN_SECRET as string)
        res.json(token)
    }catch(err){
        res.status(500)
        res.json('Error while creating token')
    }
}

const show = async (req:Request,res:Response) => {
    try{
        jwt.verify(
            req.headers.authorization as string,
            process.env.TOKEN_SECRET as string
        )
    }catch(err){
        res.status(401)
        res.json('invalid token')
        return
    }
    try{
        const user = await store.show(req.params.id as string)
        if(!user){
            res.status(404)
            res.json('page not found')
        }else
            res.json(user)
    }catch(err){
        res.status(500)
        res.json('Error occured while retriving user')
        return
    }
}

export default {
    usersRoute,
    index,
    show,
    create
}