import { Orders } from '../models/order';
import supertest from 'supertest';
import orders from '../handlers/orders';
import application from '../server';

const store = new Orders();

describe('Order model test', () => {
  it('Should include index method', () => {
    expect(store.index).toBeDefined();
  });
  it('Should return empty when given a user with number 100', async () => {
    const res = await store.show('100');
    expect(res).toEqual([]);
  });
});

describe('Orders handlers', () => {
  it('Should include show method', () => {
    expect(orders.show).toBeDefined();
  });
  it('Should send an unauthorized access', () => {
    return supertest(application)
      .get('/orders')
      .set('Accept', 'application/json')
      .expect(401);
  });
});
