const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

function checkUsername(username, con) {
    return new Promise(async function (resolve, reject) {
        resolve((await getUser(username, con))?.count > 0);
    });
}

function getUser(username, con) {
    return new Promise(function (resolve, reject) {
        // query the database to check if the username exists
        con.query(`SELECT *
                   FROM User
                   WHERE username = ?`, [username], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

function insert(user, pass, passA, con) {
    if (user != "" && user != undefined && user != null) {
        if (pass == passA && pass != "" && passA != "") {
            checkUsername(user, con).then(function (usernameExists) {
                if (!usernameExists) {
                    bcrypt.hash(pass, 10, function (err, hash) {
                        if (err) {
                            console.log(err)
                        } else {
                            let sql = `INSERT INTO User (id, Username, Password)
                                   VALUES (0, "${user}", "${hash}");`
                            con.query(sql, function (err, result) {
                                if (err) throw err
                                console.log('1 record inserted')
                            })
                        }
                    })
                } else {
                    console.log("username is already taken")
                }
            }).catch(function (error) {
                console.error(error)
            });

        } else console.log('password != passwordA')
    } else {
        console.log("need any information")
    }
}

async function login(user, pass, con) {
    const userObj = await getUser(user, con);
    return bcrypt.compare(pass, userObj.Password).then((matches) => {

        if (matches)
            return {
                status: 200,
                code: uuidv4(),
                id: userObj.id
            }
        else return {
            status: 400
        }
    })
}

module.exports = { insert, login }
