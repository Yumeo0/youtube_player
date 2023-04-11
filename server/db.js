const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "secret",
    database: "youtubePlayerDB",
    port: 3306
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});