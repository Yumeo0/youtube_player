
function insert(user, pass, passA, con) {
    console.log("use me daddy")
    if(pass == passA) {
    let sql = `INSERT INTO User (id, Username, Password) VALUES (0, "${user}", "${pass}");`
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
    }
    else console.log("password != password");
}

module.exports = {insert};

