const {insert}=require('./db.js')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = 3000

/*t
  Update node_modules/ytdl-core/lib/utils.js file. 
  On line 63 replace /(^|[[{:;,])\s?$/ with /(^|[[{:;,/])\s?$/ otherwhise big error.
*/

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// TODO: Connect to DB and create Account
// Check if User already exists!
app.get('/register', (req, res) => {
  const username = req.header("username");
  const password = req.header("password");
  const passwordA = req.header("passwordA");
  insert(username, password, passwordA);
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

app.get('/youtube', async (req, res) => {
  const url = req.header("url");
  console.log("Link:", req.header("url"));

  if(!ytdl.validateID(url) && !ytdl.validateURL(url)) {
    if(!ytpl.validateID(url)) {
      res.send({"status": 400});
      return;
    }
    const playlist = await ytpl(url);
    res.send({
      "status": 200,
      "type": "playlist",
      "playlist": playlist
    });
    return;
  }
  let video = {};
  try {
    video = await ytdl.getBasicInfo(url)
  } catch (err) {
    console.error("Update node_modules/ytdl-core/lib/utils.js file. On line 63 replace /(^|[[{:;,])\\s?$/ with /(^|[[{:;,/])\\s?$/ otherwhise big error.");
    return;
  }
  video = {
    "formats": video.formats,
    "videoDetails":  video.videoDetails
  }
  res.send({
    "status": 200,
    "type": "video",
    "video": video
  });
  return;
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
