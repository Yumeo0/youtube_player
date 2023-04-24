function insert (user, pass, passA, con) {
  if (pass == passA) {
    let sql = `INSERT INTO User (id, Username, Password) VALUES (0, "${user}", "${pass}");`
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log('1 record inserted')
    })
  } else console.log('password != password')
}

async function login(user, pass, con) {
  let sql = `SELECT * FROM User WHERE Username="${user}" AND Password= "${pass}";`
  await con.query(sql, function (err, result) {
    if (err) {
      console.log(err)
      return { status: 400 }
    }
    return result.length == 1 ? { status: 200, id: result[0].id } : { status: 400 }
  })
}

module.exports = { insert, login }
