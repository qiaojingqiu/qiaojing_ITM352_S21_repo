// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs')

// To load file system
var fs = require('fs');
// Read user data file
var user_data_file = './user_data.json'
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${file_stats["size"]} characters.`);
var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8'));}
else {
console.log(`${user_data_file} does not exist`);}

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./store_information'));

app.get('/process_submit', function(request, response, next) {
    response.redirect('login_page.html?'+ qs.stringify(request.query))
});

// process login information
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
app.post('/process_login', function(request, response, next){
    console.log(request.body)
    // Check user information database
    let username_entered = request.body['user_name'];
    let password_entered = request.body['user_password'];
    if(typeof user_data != 'undefined') {
        if(user_data[username_entered]['password'] == password_entered) {
            response.send (`${username_entered} is logged in`);
        } else {
            response.send(`${username_entered} password wrong`);
        }
    } else {
        response.send(`${username_entered} not found`);
        
    }
    // Account information doesn't match with database


    // Successfully login
    //To separate the original purchase submit, and use this to load the invoice page in the display.html
    request.query['purchased'] = "true";
    request.query['user_name'] = request.body['user_name'];
    response.redirect('display.html?' + qs.stringify(request.query));
});

// process registration 
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
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

