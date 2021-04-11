// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

// User information
var users_reg_data = {
    "dport": {"name": "Dan Port", "password": "portspassword", "email": "dport@hawaii.edu"},
    "kazman": {"name": "Rick Kazman", "password": "kazmanpassword", "email": "kazman@hawaii.edu"},
    "itm352": {"name": "ITM 352", "password": "grader", "email": "itm352@hawaii.edu"}
    };