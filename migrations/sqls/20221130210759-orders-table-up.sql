/* Replace with your SQL commands */
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    CONSTRAINT fk_user_id_users 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);