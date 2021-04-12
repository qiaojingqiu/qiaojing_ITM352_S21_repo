// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs')

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./store_information'));

app.get('/process_submit', function(request, response, next) {
    response.redirect('login_page.html?'+ qs.stringify(request.query))
});

// process login information
app.post('/process_login', function(request, response, next){
    console.log(request.query)
    // Account information doesn't match with database


    // Successfully login
    //To separate the original purchase submit, and use this to load the invoice page in the display.html
    request.query['purchased'] = "true";
    request.query['user_name'] = request.body['user_name'];
    response.redirect('display.html?' + qs.stringify(request.query));
});

// process registration 
app.post('/process_register', function(request, response, next){
    // After create an account, redirect to login page and let client login
    response.redirect('login_page.html?' + qs.stringify(request.query));
});

// User information
var users_reg_data = {
    "dport": {"name": "Dan Port", "password": "portspassword", "email": "dport@hawaii.edu"},
    "kazman": {"name": "Rick Kazman", "password": "kazmanpassword", "email": "kazman@hawaii.edu"},
    "itm352": {"name": "ITM 352", "password": "grader", "email": "itm352@hawaii.edu"}
    };

