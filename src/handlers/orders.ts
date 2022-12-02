import express, { Request, Response } from 'express';
import { Orders } from '../models/order';
import jwt, { JwtPayload } from 'jsonwebtoken';

const ordersRoute = (app: express.Application) => {
  app.get('/orders', show);
};

const store = new Orders();

const show = async (_req: Request, res: Response) => {
  let jwtPayload;
  try {
    jwtPayload = jwt.verify(
      _req.headers.authorization as unknown as string,
      process.env.TOKEN as unknown as string
    ) as JwtPayload;
  } catch (err) {
    res.status(401);
    res.json('invalid token');
    return;
  }
  try {
    const order = await store.show(jwtPayload.user.id as unknown as string);
    res.json(order);
  } catch (err) {
    res.status(500);
    res.json('Error Occured while retriving your order');
  }
};

export default {
  show,
  ordersRoute,
};
