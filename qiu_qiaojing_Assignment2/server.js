// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs')

// To load file system
// Reference Lab 14 from Professor Daniel Port
var fs = require('fs');
// Read user information file
var user_info_file = './user_information.json'
var user_info = JSON.parse(fs.readFileSync(user_info_file, 'utf-8'));

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./store_information'));

app.get('/process_submit', function(request, response, next) {
    response.redirect('login_page.html?'+ qs.stringify(request.query))
});

// process login information
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
app.post('/process_login', function(request, response, next){
    console.log(request.query)
    // Check login information with database information
    // Reference Professor Daniel Port Lab 14
    let username_inputted = request.body['user_name'];
    let password_inputted = request.body['user_password'];
    if (typeof user_info[username_inputted]!= 'undefined') { //Check if the username exists 
        if(user_info[username_inputted]['password'] == password_inputted ) {
    // Successfully login
    //To separate the original purchase submit, and use this to load the invoice page in the display.html
        request.query['purchased'] = "true";
        request.query['user_name'] = request.body['user_name'];
        response.redirect('display.html?' + qs.stringify(request.query)); 
        } else { // Password doesn't match with database, redirect back to login page
            request.query['password_wrong'] = 'true';
            response.redirect('login_page.html?' + qs.stringify(request.query));

        }
    } else { //If the username doesn't exist, ask client to create an account
        request.query['uname_notexist'] = 'true';
        response.redirect('login_page.html?' + qs.stringify(request.query)); // Redirect back to login page with order information
        
    }
});

// process registration 
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
app.post('/process_register', function(request, response, next){
    // Check input validation
    // push method reference: Lab 11 - Professor Daniel Port
    // Set different variable for validation checking
    let error_message = [];
    var letters = /^[A-Za-z]+$/;
    var validinput = /^[0-9a-zA-Z]+$/;
    var password = request.body['password'];
    var mailformat = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var confirm_password = request.body['confirm_password']; 

    // Check full name
    if (letters.test(request.body['new_client_full_name'])) {
        // no error meessage is displayed if it returns ture
        // .test() refers from https://www.w3schools.com/jsref/jsref_regexp_test.asp
        console.log('valid full name');
    } else {
        error_message.push('Please enter valid full name!')
    };
    
    // Checl username
    if (validinput.test(request.body['new_user_name'])) {
        // no error meessage is displayed if it returns ture
        console.log('valid username');
    } else {
        error_message.push('Please enter valid user name!');
    };

    // Check password
    if (password == confirm_password) {
        // no error meessage is displayed if it returns ture
        console.log('Matched password');
    } else {
        error_message.push('Passwords Not Match')
    };

    // Check email
    if (mailformat.test(request.body['new_email'])) {
        // no error meessage is displayed if it returns ture
        console.log('valid email');
    } else {
        error_message.push('Please enter valid email!')
    };

    // Update database with registration information
    // Reference Professor Daniel Port Lab 14
    username = request.body["new_user_name"];
    user_info[username] = {};
    user_info[username].password = request.body["password"];
    user_info[username].email = request.body["new_email"];
    user_info[username].name = request.body["new_client_full_name"];
    if (error_message.length == 0) {
    // Use file system write to update database
    fs.writeFileSync(user_info_file, JSON.stringify(user_info));
    // After create an account, redirect to login page and let client login
    request.query['purchased'] = "true";
    request.query['user_name'] = request.body['new_user_name'];
    response.redirect('display.html?' + qs.stringify(request.query));}
    else {
        // not response to client submission if there is any invalid input
        console.log('Invalid input, not response to registration!');
    }
});

