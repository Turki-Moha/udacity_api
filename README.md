# Storefront backend project

## to get started:
 `npm install`


### make sure to install Postgres locally on your OS

## use the port:5432 to connect to the database
## create a user in PG
 ```
 CREATE USER full_stack_user WITH PASSWORD 'password123';
 ```
## create a database in PG
 ```
 CREATE DATABASE full_stack_dev;
 CREATE DATABASE full_stack_test;
 ```
## give access to the user "full_stack_user"
```
 GRANT ALL PRIVILAGES ON DATABASE full_stack_dev TO full_stack_user;
 GRANT ALL PRIVILAGES ON DATABASAE full_stack_test TO full_stack_user;
```
## RUN the test command to test the project
 `npm run test`
## if you want to run the project on the dev environment type:
 ` db-migrate up`
 ` npm run watch`
