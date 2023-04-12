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

export function insert(user, pass, passA) {
    if(pass == passA) {
    let sql = "INSERT INTO user (id, user, password) VALUES (0, ${user}, ${pass})"
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
    }
    else console.log("password != password");
}

