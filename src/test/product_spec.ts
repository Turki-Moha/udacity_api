import { Products } from '../models/product';
import products from '../handlers/products';
import supertest from 'supertest';
import application from '../server';

const store = new Products();

describe('Product Model test', () => {
  it('Should include an index', () => {
    expect(store.index).toBeDefined();
  });
  it('retrun an empty array from the index', async () => {
    const res = await store.index();
    expect(res).toEqual([]);
  });
  it('Should include a create', () => {
    expect(store.create).toBeDefined();
  });
  it('retrun an empty array from the index', async () => {
    const res = await store.create({
      name: 'laptop',
      price: 1000,
    });
    expect(res).toEqual({
      id: 1,
      name: 'laptop',
      price: 1000,
    });
  });
  it('index should return the new products', async () => {
    const res = await store.index();
    expect(res).toEqual([
      {
        id: 1,
        name: 'laptop',
        price: 1000,
      },
    ]);
  });
  it('index should return the new product by id', async () => {
    const res = await store.show('1');
    expect(res).toEqual({
      id: 1,
      name: 'laptop',
      price: 1000,
    });
  });
});

describe('Product handler test', () => {
  let token: string;
  beforeAll(() => {
    supertest(application)
      .post('/users')
      .send({ first_name: 'Hi', last_name: 'All', password: 'password' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((response) => {
        token = response.body;
      });
  });
  it('should include create method', () => {
    expect(products.create).toBeDefined();
  });
  it('should include show method', () => {
    expect(products.show).toBeDefined();
  });
  it('should include addProduct method', () => {
    expect(products.addProduct).toBeDefined();
  });
  it('should include index method', () => {
    expect(products.index).toBeDefined();
  });
  it('the index method should respond with a success code', () => {
    return supertest(application)
      .get('/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('show should include json response', () => {
    return supertest(application)
      .get('/products/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should send an error if the product not found', () => {
    return supertest(application).get('/products/1000').expect(404);
  });
  it('should create a product successfully', () => {
    return supertest(application)
      .post('/products')
      .send({
        name: 'charger',
        price: 100,
      })
      .set('authorization', token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('Should add a new product successfully', () => {
    return supertest(application)
      .post('/products/addProduct')
      .send({ product_id: 2, quantity: 3 })
      .set('authorization', token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
