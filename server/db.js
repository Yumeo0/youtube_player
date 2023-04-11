const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "secret",
    database: "youtubePlayerDB",
    port: 3306
});

con.connect(function(err) {
    if (err) {
        //console.error(err);
        console.error("Couldn't connect to database");
        return;
    }
    console.log("Connected!");
});