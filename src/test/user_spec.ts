import { Users } from '../models/user';
import users from '../handlers/users';
import supertest from 'supertest';
import application from '../server';

const store = new Users();

describe('User model test', () => {
  it('should include an index ', () => {
    expect(store.index).toBeDefined();
  });

  it('index should return nothing', async () => {
    const result = await store.index();
    expect(result).toHaveSize(1);
  });

  it('should include a show', () => {
    expect(store.show).toBeDefined();
  });

  it('show should return undefined', async () => {
    const result = await store.show(1000);
    expect(result).toBeUndefined();
  });

  it('should include a create', () => {
    expect(store.show).toBeDefined();
  });

  it('create should return id', async () => {
    const result = await store.create({
      first_name: 'Hello',
      last_name: 'World',
      password: 'pass',
    });
    expect(result.id).toEqual(2);
  });

  it('should return 2 objects from the index', async () => {
    const result = await store.index();
    expect(result.length).toEqual(2);
  });

  it('should return data from an ID', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(1);
  });
});

describe('User handlers test', () => {
  let token: string;
  beforeAll(() => {
    supertest(application)
      .post('/users')
      .send({ firstName: 'A', lastName: 'B', password: 'p1234' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((response) => {
        token = response.body;
      });
  });
  it('should include a show', () => {
    expect(users.show).toBeDefined();
  });
  it('should include a create', () => {
    expect(users.create).toBeDefined();
  });
  it('should include an index', () => {
    expect(users.index).toBeDefined();
  });
  it('index response with an invalid token', () => {
    return supertest(application)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });
  it('should response with an unauthorized page', () => {
    return supertest(application)
      .get('/users/1000')
      .set('Accept', 'application/json')
      .set('authorization', token)
      .expect('Content-Type', /json/)
      .expect(401);
  });
  it('create should response with an error', () => {
    return supertest(application)
      .post('/users')
      .send({ lastName: 'missing parameters', password: 'No' })
      .set('authorization', token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500);
  });
});
