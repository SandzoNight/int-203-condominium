require('dotenv').config()
var express = require('express');
const PORT = process.env.PORT || 3001;
const cors = require('cors')
const server = express();
var bodyParser = require('body-parser')
server.use(cors(),bodyParser.json())
const http = server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
var mysql = require('mysql')
var pool = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_SCHEMA
});
pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

// pool.ping(function (err) {
//   if (err) throw err;
//   console.log('Server responded to ping');
// })
const io = require('socket.io').listen(http)
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

//============================================//
var condosetting
const getCondosetting =  () => {
  var statement = `SELECT * FROM condosetting`
  pool.query(statement, function (err, rows, fields) {
  if (err) {
    throw err
  }
  condosetting = rows[0]
  })
}
getCondosetting()

//API Request
server.get('/api/condosetting', (req, res) => {
  res.json(condosetting)
});

server.post('/api/login',upload.array(), (req, res) => {
  console.log(req.body.username)
  console.log(req.body.password)
  var statement = `SELECT * FROM users WHERE username="${req.body.username}" 
                  AND password="${req.body.password}"`
                  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});

server.get('/api/employee', function(req, res) {
  var statement = `SELECT e.empid,e.fname,e.lname,p.name pos,b.name building FROM employees e JOIN positions p ON e.positionid=p.positionid LEFT JOIN buildings b ON e.buildingid=b.buildingid`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});

server.get('/api/employee/empid/:id', function(req, res) {
  var statement = `SELECT e.*,b.name AS building,p.name AS position FROM employees e LEFT JOIN buildings b ON e.buildingid=b.buildingid LEFT JOIN positions p ON e.positionid=p.positionid WHERE e.empid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});
server.get('/api/employee/buildingid/:id', function(req, res) {
  var statement = `SELECT * FROM employees WHERE buildingid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/employee/buildingname/:name', function(req, res) {
  var statement = `SELECT *,b.name building,p.name pos FROM employees e JOIN buildings b ON e.buildingid=b.buildingid JOIN positions p ON p.positionid=e.positionid WHERE e.buildingid=ANY(SELECT buildingid FROM buildings WHERE name LIKE '%${req.params.name}%')`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/employee/positionname/:name', function(req, res) {
  var statement = `SELECT *,b.name building,p.name pos FROM employees e JOIN buildings b ON e.buildingid=b.buildingid JOIN positions p ON e.positionid=p.positionid WHERE p.positionid=ANY(SELECT positionid FROM positions WHERE name LIKE '%${req.params.name}%')`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/employee/buildingname/:bname/positionname/:pname', function(req, res) {
  console.log(req.params.pname)
  console.log(req.params.bname)
  var statement
  if(req.params.pname==" " && req.params.bname!=" "){
    statement = `SELECT *,b.name building,p.name pos FROM employees e 
    JOIN buildings b ON e.buildingid=b.buildingid 
    JOIN positions p ON e.positionid=p.positionid 
    WHERE b.name LIKE '%${req.params.bname}%'`
  } else if(req.params.bname==" " && req.params.pname!=" "){
    statement = `SELECT *,b.name building,p.name pos FROM employees e 
    JOIN buildings b ON e.buildingid=b.buildingid 
    JOIN positions p ON e.positionid=p.positionid 
    WHERE p.name LIKE '%${req.params.pname}%'`
  }else if(req.params.bname==" " && req.params.pname==" "){
    statement = `SELECT *,b.name building,p.name pos FROM employees e 
    LEFT JOIN buildings b ON e.buildingid=b.buildingid 
    LEFT JOIN positions p ON e.positionid=p.positionid`
  }else {
    statement = `SELECT *,b.name building,p.name pos FROM employees e 
    JOIN buildings b ON e.buildingid=b.buildingid 
    JOIN positions p ON e.positionid=p.positionid 
    WHERE p.name LIKE '%${req.params.pname}%' AND b.name LIKE '%${req.params.bname}%'`
    console.log(statement)
  }
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});

server.get('/api/building', function(req, res) {
  var statement = `SELECT * FROM buildings`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/building/buildingid/:id', function(req, res) {
  var statement = `SELECT * FROM buildings WHERE buildingid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});

server.get('/api/waterbill', function(req, res) {
  var statement = `SELECT * FROM waterbills w JOIN rooms r ON w.roomid=r.roomid`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/billid/:id', function(req, res) {
  var statement = `SELECT * FROM waterbills w JOIN rooms r ON w.roomid=r.roomid WHERE billid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});
server.get('/api/waterbill/roomid/:id', function(req, res) {
  var statement = `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid 
  WHERE w.roomid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      console.log(err)
      res.send(err)
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/roomid/:id/status/:status', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid WHERE w.roomid="${req.params.id}"
  AND billstatusid=(SELECT statusid FROM billstatus WHERE name="${req.params.status}")`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/buildingid/:id', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid WHERE r.buildingid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/buildingid/:id/status/:status', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid WHERE r.buildingid="${req.params.id}"
  AND billstatusid=(SELECT statusid FROM billstatus WHERE name="${req.params.status}")`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/buildingid/:id/floor/:floor', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid 
  WHERE r.buildingid="${req.params.id}" AND r.floorNum="${req.params.floor}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/buildingid/:id/floor/:floor/status/:status', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON r.roomid=w.roomid WHERE r.buildingid="${req.params.id}"
  AND r.floornum="${req.params.floor}" AND billstatusid=(SELECT statusid FROM billstatus WHERE name="${req.params.status}")`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/waterbill/ownerid/:id', function(req, res) {
  var statement = 
  `SELECT * FROM waterbills w JOIN rooms r ON w.roomid=r.roomid WHERE r.ownerid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});


//=============================================//
//Socket
io.on('connection', function(socket){
  console.log('a user connected')
  if(!pool){
    pool = mysql.createPool({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_SCHEMA
    });
    console.log("connect db on socket")
  }

  socket.on('disconnect', (socket)=>{
    console.log('a user disconnected')
  })

  socket.on('addRoom', (room)=> {
    console.log(room)
  })
});