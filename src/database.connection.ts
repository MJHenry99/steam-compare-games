const mysql = require('mysql2');

export const dbConnection = mysql.createPool({
    host: "remote.ac",
    user: "WS269879_CSG_GOD",
    password: "T2y#0Dg&&A^OEThZVJmj",
    database: "WS269879_CSG"
    // here you can set connection limits and so on
});
