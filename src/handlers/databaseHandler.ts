import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();
const config = process.env;

export const db = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PWD,
    database: config.DB_NAME
});