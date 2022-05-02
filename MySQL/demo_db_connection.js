var mysql = require('mysql');

console.log("Connecting to localhost...");
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "username",
  port: 3306,
  database: "Travel",
  password: "pw"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query("SELECT * FROM Room where price > 25", function (err, result, fields) {
    if (err) throw err;
    console.log(result);  
});