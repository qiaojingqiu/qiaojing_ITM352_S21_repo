// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// play with cookies
app.get('/set_cookie', function(req,res,next) {
    console.log(req.cookies);
    let my_name = 'Hana Qiu'
    res.cookie('my_name',my_name, {maxAge: 5000});
    res.send(`Cookie for ${my_name} sent`)
    next();
});

// used cookies
app.get('/use_cookie', function(req,res,next) {
    console.log(req.cookie);
    if (typeof req.cookies["my_name"] != 'undefined') {
    res.send(`Hello ${req.cookies["my_name"]};`)} 
    else {
        res.send("I don't know you");
    }
    next();
});





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
    if(typeof user_data[username_entered] != 'undefined') { //Check whether the username exists or not
        if(user_data[username_entered]['password'] == password_entered) {
            // Successfully login
            //To separate the original purchase submit, and use this to load the invoice page in the display.html
            request.query['purchased'] = "true";
            request.query['user_name'] = request.body['user_name'];
            response.redirect('display.html?' + qs.stringify(request.query));
        } else {
            // password not matches with database, redirect to login page and ask client to try again
            request.query['user_name'] = request.body['user_name'];
            request.query['user_password'] = "notmatch";
            response.redirect('login_page.html?' + qs.stringify(request.query));
        }
    } else {
        // Account information doesn't match with database
        request.query['user_name'] = "notexist";
        response.redirect('login_page.html?' + qs.stringify(request.query));     
    }
});

// process registration 
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
app.post('/process_register', function(request, response, next){
    // Add a new user to the database
    // Check the valiation the new information (exist or not and validation)
    username = request.body["new_user_name"];
    user_data[username] = {};
    user_data[username].password = request.body["password"];
    user_data[username].email = request.body["new_email"];
    user_data[username].name = request.body["new_client_full_name"];
    // Save updated user data to file (DB)
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    // After create an account, redirect to login page and let client login
    response.redirect('login_page.html?' + qs.stringify(request.query));
});


