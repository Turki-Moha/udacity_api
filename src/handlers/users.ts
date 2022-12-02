import express, { Request, Response } from 'express';
import { User, Users } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new Users();

const usersRoute = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
};

const index = async (req: Request, res: Response) => {
  try {
    jwt.verify(<string>req.headers.authorization, <string>process.env.TOKEN);
  } catch (err) {
    res.status(401);
    res.json('invalid token');
    return;
  }
  try {
    const user = await store.index();
    res.json(user);
  } catch (err) {
    res.status(500);
    res.json('Error occured while retriving user');
    return;
  }
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    first_name: _req.body.first_name,
    last_name: _req.body.last_name,
    password: _req.body.password,
  };
  try {
    const newUserToken = await store.create(user);
    let token = jwt.sign({ user: newUserToken }, <string>process.env.TOKEN);
    res.json(token);
  } catch (err) {
    res.status(500);
    res.json('Error while creating token');
  }
};

const show = async (req: Request, res: Response) => {
  try {
    jwt.verify(
      req.headers.authorization as string,
      process.env.TOKEN as string
    );
  } catch (err) {
    res.status(401);
    res.json('invalid token');
    return;
  }
  try {
    const id = req.params.id.replace(':', '');
    const user = await store.show(id as unknown as number);

    if (!user) {
      res.status(404);
      res.json('page not found');
    } else res.json(user);
  } catch (err) {
    res.status(500);
    res.json('Error occured while retriving user');
    return;
  }
};

export default {
  usersRoute,
  index,
  show,
  create,
};
