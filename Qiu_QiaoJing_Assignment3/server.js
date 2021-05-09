// Reference: Class website assignment 1 instruction
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
var products_data = require('./products.json');

// create a secret for session
// Reference: Professor Daniel Port Lab 15
// Reference: Professor Daniel Port - Assignment 3 Code Example - https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html
app.use(session({secret: "ITM352 rocks!"}));
//Reference: Assignment 3 Code Example - From Professor Daniel Port - To create a session to store order information
app.all('*', function (request, response, next) {
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } // If session is undefined, that means that we did not send out a session to the user before, then create a new one
    next();
});

app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});


// To load file system
// Reference Lab 14 from Professor Daniel Port
var fs = require('fs');
// Read user information file
var user_info_file = './user_information.json'
var user_info = JSON.parse(fs.readFileSync(user_info_file, 'utf-8'));

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./store_information'));

function isNonNegInt(q,returnErrors=false) {
    if(q =='') q=0; // Client should not receive any error message if there is no input in the textbox
    var errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); // If there is no error message in the array, the length should be 0, which returns back to true, the input is a positive integer
};

app.get('/add_to_cart', function (request, response) { // create a specific router to handle tax service order
    var product_key = request.query['product_key'] // get product's name
    var product_quantity= request.query['quantity'] // get quantity from the query and put them in a variable
    var errs = [];
    if (typeof request.query['tax_year'] != 'undefined') {
        var product_tax_year = request.query['tax_year']// get tax year from the query and out them in a variable
        }
    for (i=0; i< product_quantity.length; i++) {
        if (Number(product_quantity[i]) != product_quantity[i]) {
           errs.push('Your input is not a number!')
        };
        if (product_quantity[i] < 0) {
            errs.push('Please enter a positive value!');
        };
        if (parseInt(product_quantity[i]) != product_quantity[i]) {
            errs.push('Your input is not an integer!');
        };
        if (typeof product_tax_year != 'undefined') {
            if (product_quantity[i] >0) {
                if (product_tax_year[i] == '0' || product_tax_year[i] == '') {
                    errs.push(`Please enter your tax year in box ${[i+1]}!`);
                }
            }
        };
    };
    if (errs.length == 0) {
        if (typeof request.session.cart[product_key] == 'undefined') {
            request.session.cart[product_key] = {};
        }
    request.session.cart[product_key]['tax_year'] = product_tax_year; // create an object in session to store tax year information specifically for tax service
    request.session.cart[product_key]['quantity'] = product_quantity; // create an object in session to store quantity information specifically for tax service
    response.redirect(`display_${product_key}.html?message=Your order has been added to the shopping cart! You can change your order by modifying the input box.`);
    //response.json(request.session.cart);  
    console.log(request.session.cart);
    } else {
        response.redirect(`display_${product_key}.html?error=${errs.join(" ; ")}`);
    }
});


app.post("/get_cart", function (request, response) {
    console.log(request.session.cart);
    response.json(request.session.cart);  
});

// process login information
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
app.post('/process_login', function(request, response, next){
    console.log(request.query)
    // Check login information with database information
    // Reference Professor Daniel Port Lab 14
    let username_inputted = request.body['user_name'];
    let password_inputted = request.body['user_password'];
    // Check if the client is login by checking cookie
    if (typeof request.cookies['user_name'] != 'undefined') {
    // if cookie is not undefined, redirect back to login page
        console.log(`Session is sent, session ID is ${request.session.id}`)
        response.redirect('login_page.html');
    }
    if (typeof user_info[username_inputted]!= 'undefined') { //Check if the username exists 
        if(user_info[username_inputted]['password'] == password_inputted ) {
    // Successfully login
    // If password matches, send client a cookie to record client login status
        response.cookie('userlogin',username_inputted);
        response.redirect('login_page.html'); 
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
    let error_message = []; // to push error message
    var letters = /^[A-Za-z]+$/; // for full name validation
    var validinput = /^[0-9a-zA-Z]+$/; // for username validation
    var password = request.body['password']; // checking passwords
    var confirm_password = request.body['confirm_password']; 
    var mailformat = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // for email validation
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
    if (typeof request.cookie != 'undefine') {
    // if client had login before, delete the previous cookie first
    // Reference: https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm
    response.clearCookie('userlogin');
    };
    // Send client a new cookie regarding the new account
    response.cookie('userlogin',request.body['new_user_name']);
    // After create an account, redirect to login page and let client login
    response.redirect('login_page.html');}
    else {
        // not response to client submission if there is any invalid input
        console.log('Invalid input, not response to registration!');
    }
});

app.get('/send_invoice', function(request, response) {
    if (typeof request.cookies['userlogin'] == 'undefined') {
        response.redirect('login_page.html?message=Please login your account to finish checkout'); 
    }
    else {
        response.redirect('invoice_purchase.html');
    }
});
