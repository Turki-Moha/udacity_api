# API Requirements
The company stakeholders want to create an online storefront to showcase their
great product ideas. Users need to be able to browse an index of all products,
see the specifics of a single product, and add products to an order that they
can view in a cart page. You have been tasked with building the API that will
support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what
endpoints the API needs to supply, as well as data shapes the frontend and backend
have agreed meet the requirements of the application.

## API Endpoints
#### Products
- Index
    - 'products' [GET]
- Show
    - 'products/:id' [GET]
- Create [token required]
    - 'products' [POST] [with authorization token as a header]
- Add Product to an order
  - '/products/addProduct' [POST]

#### Users
- Index [token required]
    - 'users' [GET]
- Show [token required]
    - 'users/:id' [GET]
- Create N[token required]
    - 'users' [POST]

#### Orders
- Current Order by user (args: user id)[token required]
    - 'order' [GET] [with authorization token as a header]


## Data Shapes
#### Product
-  id
- name
- price
```
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price REAL NOT NULL
);
```


#### User
- id
- firstName
- lastName
- password
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  password varchar(75) NOT NULL
);
```


#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    CONSTRAINT fk_user_id_users 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```


```
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_order 
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_products
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```
