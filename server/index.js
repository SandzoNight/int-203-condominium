var express = require('express');
const PORT = process.env.PORT || 3001;
const cors = require('cors')
const server = express();
var bodyParser = require('body-parser')
require('dotenv').config()
server.use(cors(),bodyParser.json())
const http = server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_SCHEMA
});
// connection.end()
connection.connect()
connection.ping(function (err) {
  if (err) throw err;
  console.log('Server responded to ping');
})
const io = require('socket.io').listen(http)
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

//============================================//
//API Request
server.get('/api/hello', (req, res) => {
  console.log(req)
});

server.post('/api/login',upload.array(), (req, res) => {
  console.log(req.body.username)
  console.log(req.body.password)
  var statement = `SELECT * FROM users WHERE username="${req.body.username}" 
                  AND password="${req.body.password}"`
  connection.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
  
});
//=============================================//
//Socket
io.on('connection', function(socket){
  console.log('a user connected')

  socket.on('disconnect', (socket)=>{
    console.log('a user disconnected')
  })

  socket.on('addRoom', (room)=> {
    console.log(room)
  })
});