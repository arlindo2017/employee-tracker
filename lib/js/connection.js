const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'CE.~R?kl{7[C5y$9u&z@nd*|FOZ_n1T8-W]6vk%a1Xek2WmJ',
        database: 'employee_db'
    },
    console.log(`Connected to the database.`)
);

module.exports = {db};