var express = require('express');

const PORT = process.env.PORT || 3001;
const cors = require('cors')
const server = express();

require('dotenv').config()

server.use(cors())
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_SCHEMA
});
connection.ping(function (err) {
  if (err) throw err;
  console.log('Server responded to ping');
})

server.get('/api/user', (req, res) => {
  res.json([{
  	id: 1,
  	username: "samsepi0l"
  }, {
  	id: 2,
  	username: "D0loresH4ze"
  }]);
});

server.get('/api/hello', (req, res) => {
  res.send('Hello')
});