import express, { Request, Response } from 'express';
import { Products, querryProduct } from '../models/product';
import jwt, { JwtPayload } from 'jsonwebtoken';

const store = new Products();

const productRoute = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.post('/products/addProduct', addProduct);
};

const index = async (_req: Request, res: Response) => {
  try {
    const retriveProducts = await store.index();
    res.json(retriveProducts);
  } catch (err) {
    res.status(500);
    res.json('Error occured while retreving data');
    return;
  }
};

const create = async (req: Request, res: Response) => {
  try {
    jwt.verify(
      req.headers.authorization as unknown as string,
      process.env.TOKEN as unknown as string
    );
  } catch (err) {
    res.status(401);
    res.json('invalid token');
  }
  try {
    const product: querryProduct = {
      name: req.body.name as string,
      price: req.body.price as unknown as number,
    };

    const createProducts = await store.create(product);
    res.json(createProducts);
  } catch (err) {
    res.status(500);
    res.json('Error occured While inserting the product');
    return;
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id as unknown as string);
    if (!product) {
      res.status(404);
      res.json('Product not found');
    } else res.json(product);
  } catch (err) {
    res.status(500);
    res.json('Error occured while retriving data');
    return;
  }
};

const addProduct = async (req: Request, res: Response) => {
  let jwtPayload;
  try {
    jwtPayload = jwt.verify(
      req.headers.authorization as unknown as string,
      process.env.TOKEN as unknown as string
    ) as JwtPayload;
  } catch (err) {
    res.status(401);
    res.json('invalid token');
    return;
  }
  try {
    const product = await store.addProduct(
      req.body.quantity as number,
      jwtPayload.user.id as string,
      req.body.product_id as string
    );
    res.json(product);
  } catch (err) {
    res.status(500);
    res.json('Error occured while inserting new product');
    return;
  }
};

export default {
  index,
  create,
  show,
  addProduct,
  productRoute,
};
