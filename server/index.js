
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
var NULL = require('mysql/lib/protocol/constants/types')
var pool = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_SCHEMA,
  dateStrings: 'date'
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
server.put(`/api/employee/add/:fname/:lname/:citizenid/:telno/:email/:salary/:address/:tumbol/:amphoe/:province/:country/:postcode/:positionid/:buildingid`, function(req, res) {
  let fname = req.params.fname
  let lname = req.params.lname
  let citizenid = req.params.citizenid
  let telno = req.params.telno
  let email = req.params.email
  let salary = req.params.salary
  let address = req.params.address
  let tumbol = req.params.tumbol
  let amphoe = req.params.amphoe
  let province = req.params.province
  let country = req.params.country
  let postcode = req.params.postcode
  let positionid = req.params.positionid
  let buildingid = req.params.buildingid
  var statement = `
  INSERT INTO employees (fname,lname,citizenid,telno,email,salary,address,tumbol,amphoe,province,country,
  postcode,positionid,buildingid) VALUES
  ('${fname}','${lname}',${citizenid},'${telno}','${email}','${salary}','${address}','${tumbol}'
  ,'${amphoe}','${province}','${country}','${postcode}',${positionid},${buildingid==" "?'NULL':buildingid})
  `
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.delete('/api/employee/empid/:id', function(req, res) {
  var statement = `DELETE FROM employees WHERE empid=${req.params.id}`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});

server.get('/api/owner/', function(req, res) {
  var statement = `SELECT * FROM owners`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/owner/ownerid/:id', function(req, res) {
  var statement = `SELECT o.*,b.name AS building,r.roomNum FROM owners o LEFT JOIN rooms r ON o.ownerid=r.ownerid LEFT JOIN buildings b ON r.buildingid=b.buildingid WHERE o.ownerid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});
server.get('/api/owner/name/:name/email/:email', function(req, res) {
  let name = req.params.name
  let email = req.params.email
  var statement
  if(name==" " && email==" ") {
    statement = `SELECT * FROM owners o`
  }else if(name!==" " && email==" ") {
    statement = `SELECT * FROM owners o WHERE CONCAT(fname,' ',lname) LIKE '%${name}%'`
  }else if(name==" " && email!==" ") {
    statement = `SELECT * FROM owners o WHERE email LIKE '${email}'`
  }else if(name!=="" && email!==" ") {
    statement = `SELECT * FROM owners o WHERE CONCAT(fname,' ',lname) LIKE '%${name}%' AND email LIKE '%${email}%'`
  }
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/owner/ownedroom/ownerid/:id', function(req, res) {
  let ownerid=req.params.id
  var statement = `SELECT r.roomNum,b.name AS building FROM rooms r LEFT JOIN buildings b ON r.buildingid=b.buildingid WHERE r.ownerid='${ownerid}'`
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
    res.send(rows[0])
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
server.get('/api/bill/water/billid/:id', function(req, res) {
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
server.get(`/api/bill/water/buildingid/:buildingid/roomno/:roomno/floor/:floor/statusid/:statusid/start/:start/startend/:startend/due/:due/dueend/:dueend/paid/:paid`, function(req, res) {
  let buildingid = req.params.buildingid
  let roomno = req.params.roomno
  let floor = req.params.floor
  let statusid = req.params.statusid
  let start = req.params.start
  let startend = req.params.startend
  let due = req.params.due
  let dueend = req.params.dueend
  let paid = req.params.paid
  console.log(buildingid)
  console.log(roomno)
  console.log(floor)
  console.log(statusid)
  console.log(start)
  console.log(due)
  console.log(paid)
  var statement
  if(buildingid!==" "||roomno!==" "||floor!==" "||statusid!==" "||start!==" "||due!==" "||paid!==" ") {
    statement = 
    `${buildingid!==" "?`SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.buildingid="${buildingid}"`:"SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${roomno!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.roomnum="${roomno}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${floor!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.floornum="${floor}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${start!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.startdate BETWEEN '${start}' AND '${startend}'`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${due!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.startdate BETWEEN '${due}' AND '${dueend}'`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${paid!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.paiddate="${paid}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${statusid!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.billstatusid="${statusid}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ORDER BY startdate DESC`
  }else {
    statement = "SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM waterbills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid ORDER BY startdate DESC"
  }
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    console.log(rows)
    res.send(rows)
  })
});
server.post(`/api/bill/water/billid/:billid/paiddate/:paiddate/statusid/:statusid`, function(req, res) {
  let billid = req.params.billid
  let paiddate = req.params.paiddate
  let statusid = req.params.statusid
  console.log(billid)
  console.log(paiddate)
  console.log(statusid)
  var statement = `UPDATE waterbills SET paiddate=${paiddate==" "?'NULL':`'${paiddate}'`}, billstatusid='${statusid}' WHERE billid='${billid}'`
  console.log(statement)
  pool.query(statement, function (err, result) {
    if (err) {
      throw err
    }
    console.log(result)
    res.send(result)
  })
});

server.get('/api/bill/maintenance/billid/:id', function(req, res) {
  var statement = `SELECT * FROM maintenancebills m JOIN rooms r ON m.roomid=r.roomid WHERE billid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});
server.get(`/api/bill/maintenance/buildingid/:buildingid/roomno/:roomno/floor/:floor/statusid/:statusid/start/:start/startend/:startend/due/:due/dueend/:dueend/paid/:paid/paidend/:paidend`, function(req, res) {
  let buildingid = req.params.buildingid
  let roomno = req.params.roomno
  let floor = req.params.floor
  let statusid = req.params.statusid
  let start = req.params.start
  let startend = req.params.startend
  let due = req.params.due
  let dueend = req.params.dueend
  let paid = req.params.paid
  let paidend = req.params.paidend
  console.log(buildingid)
  console.log(roomno)
  console.log(floor)
  console.log(statusid)
  console.log(start)
  console.log(due)
  console.log(paid)
  var statement
  if(buildingid!==" "||roomno!==" "||floor!==" "||statusid!==" "||start!==" "||due!==" "||paid!==" ") {
    statement = 
    `${buildingid!==" "?`SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.buildingid="${buildingid}"`:"SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${roomno!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.roomnum="${roomno}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${floor!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE r.floornum="${floor}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${start!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.startdate BETWEEN '${start}' AND '${startend}'`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${due!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.startdate BETWEEN '${due}' AND '${dueend}'`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${paid!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.paiddate BETWEEN '${paid}' AND '${paidend}'`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ${statusid!==" "?`INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid
    WHERE b.billstatusid="${statusid}"`:"INTERSECT SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid"}
    ORDER BY startdate DESC`
  }else {
    statement = "SELECT b.*,bs.name AS status,r.roomnum,bd.name AS building FROM maintenancebills b JOIN billstatus bs ON b.billstatusid=bs.statusid JOIN rooms r ON b.roomid=r.roomid JOIN buildings bd ON r.buildingid=bd.buildingid ORDER BY startdate DESC"
  }
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    console.log(rows)
    res.send(rows)
  })
});
server.post(`/api/bill/maintenance/billid/:billid/paiddate/:paiddate/statusid/:statusid/chargecost/:chargecost/totalcost/:totalcost`, function(req, res) {
  let billid = req.params.billid
  let paiddate = req.params.paiddate
  let statusid = req.params.statusid
  let chargecost = req.params.chargecost
  let totalcost = req.params.totalcost
  console.log(billid)
  console.log(paiddate)
  console.log(statusid)
  console.log(chargecost)
  console.log(totalcost)
  var statement = `UPDATE maintenancebills SET paiddate=${paiddate==" "?'NULL':`'${paiddate}'`}, billstatusid='${statusid}', chargecost='${chargecost}', totalcost='${totalcost}' WHERE billid='${billid}'`
  console.log(statement)
  pool.query(statement, function (err, result) {
    if (err) {
      throw err
    }
    console.log(result)
    res.send(result)
  })
});

server.get('/api/room/buildingid/:id', function(req, res) {
  var statement = `SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid WHERE buildingid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/room/buildingid/:id/roomno/:roomno/floor/:floor/status/:status', function(req, res) {
  let building = req.params.id
  let roomno = req.params.roomno
  let floor = req.params.floor
  let status = req.params.status==" "?" ":req.params.status=="hasowner"?1:0
  let statement
  if(roomno!==" "||floor!==" "||status!==" ") {
    statement =
    `${roomno!==" "?`SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid WHERE buildingid=${building}
    AND r.roomnum="${roomno}"`:`SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid WHERE buildingid=${building}`}
    ${floor!==" "?`INTERSECT SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid WHERE buildingid=${building}
    AND r.floornum='${floor}'`:`INTERSECT SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid WHERE buildingid=${building}`}
    ${status!==" "?`INTERSECT SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid  WHERE buildingid=${building}
    AND ownerid ${status==0?'IS NULL':'IS NOT NULL'}`:`INTERSECT SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid  WHERE buildingid=${building}`}
    ORDER BY roomnum
    `
  }else {
    statement = `SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid  WHERE buildingid=${building} ORDER BY roomnum`
  }
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});
server.get('/api/room/roomid/:id', function(req, res) {
  var statement = `SELECT * FROM rooms r JOIN roomsizes s ON r.sizeid=s.sizeid LEFT JOIN owners o ON r.ownerid=o.ownerid WHERE roomid="${req.params.id}"`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});
server.post('/api/room/roomid/:id/ownerid/:ownerid', function(req, res) {
  let roomid = req.params.id
  let ownerid = req.params.ownerid
  var statement = `UPDATE rooms SET ownerid=${ownerid==" "?'NULL':`'${ownerid}'`} WHERE roomid='${roomid}'`
  console.log(statement)
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows[0])
  })
});

server.get('/api/position', function(req, res) {
  var statement = `SELECT * FROM positions`
  pool.query(statement, function (err, rows, fields) {
    if (err) {
      throw err
    }
    res.send(rows)
  })
});

server.get(`/api/billstatus`, function(req, res) {
  var statement = "SELECT * FROM billstatus"
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