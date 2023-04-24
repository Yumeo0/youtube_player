const { insert, login } = require('./db.js')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = 3001

const mysql = require('mysql2')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'youtubePlayerDB',
  port: 3306
})

con.connect(function (err) {
  if (err) {
    //console.error(err);
    console.error("Couldn't connect to database")
    return
  }
  console.log('Connected!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// TODO: Connect to DB and create Account
// Check if User already exists!
app.get('/register', (req, res) => {
  const username = req.header('username')
  const password = req.header('password')
  const passwordA = req.header('passwordA')
  insert(username, password, passwordA, con)
  res.send({
    status: 200
  })
})

// TODO: Connect to DB and check if credentials are correct
// Generate Random string and associate it with the user id
// Bsp: logins.push({"randomString": 1});
const logins = []
app.get('/login', async (req, res) => {
  const username = req.header('username')
  const password = req.header('password')
  const response = await login(username, password, con)
  if(response?.code) {
    logins.push([response.code, response.id])
    console.log("logged in", logins[logins.length - 1])
  }
  res.send({
    "status": response.status,
    "code": response?.code
  })
})

app.get('/youtube', async (req, res) => {
  const url = req.header('url')
  console.log('Link:', req.header('url'))

  if (!ytdl.validateID(url) && !ytdl.validateURL(url)) {
    if (!ytpl.validateID(url)) {
      res.send({ status: 400 })
      return
    }
    const playlist = await ytpl(url, {limit: Infinity})
    res.send({
      status: 200,
      type: 'playlist',
      playlist: playlist
    })
    return
  }
  let video = {}
  try {
    video = await ytdl.getInfo(url)
  } catch (err) {
    console.error(err)
    return
  }
  video = {
    formats: video.formats,
    videoDetails: video.videoDetails
  }
  res.send({
    status: 200,
    type: 'video',
    video: video
  })
  return
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
