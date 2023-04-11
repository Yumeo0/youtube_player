const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// TODO: Connect do DB and create Account
// Check if User already exists!
app.get('/register', (req, res) => {
  console.log(req.header("username"));
  console.log(req.header("password"));
  res.send({
    status: "err"
  })
})

// TODO: Connect to DB and check if credentials are correct
// Generate Random string and associate it with the user id
// Bsp: logins.push({"randomString": 1});
const logins = []
app.get('/login', (req, res) => {
  console.log(req.header("username"));
  console.log(req.header("password"));
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
