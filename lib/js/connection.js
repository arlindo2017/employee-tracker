const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const db = process.env.JAWSDB_URL || mysql.createConnection(
    {
        // Connection Parameters from .env
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        host: 'localhost',
    },
    console.log(`Connected to the database.`)
);

module.exports = {db};