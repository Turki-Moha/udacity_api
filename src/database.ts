import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB_TEST,
    POSTGRES_PORT,
    ENV,
} = process.env

let client = new Pool({
    host:POSTGRES_HOST,
    database:POSTGRES_DB,
    user:POSTGRES_USER,
    port:(POSTGRES_PORT as unknown) as number,
    password:POSTGRES_PASSWORD
})

console.log(ENV)

if(ENV === 'test'){
    client = new Pool({
        host:POSTGRES_HOST,
        database:POSTGRES_DB,
        user:POSTGRES_USER,
        port:(POSTGRES_PORT as unknown) as number,
        password:POSTGRES_PASSWORD
    })
}

export default client