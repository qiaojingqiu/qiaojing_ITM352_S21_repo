// Reference: Class website assignment 1 instruction
// to set up and install system and functions
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended:true}));
var qs = require('qs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
var nodemailer = require("nodemailer");

// create a secret for session
// Reference: Professor Daniel Port Lab 15
// Reference: Professor Daniel Port - Assignment 3 Code Example - https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html
app.use(session({secret: "ITM352 rocks!"})); // set up secret for session
//Reference: Assignment 3 Code Example - From Professor Daniel Port - To create a session to store order information
app.all('*', function (request, response, next) {
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } // If session is undefined, that means that we did not send out a session to the user before, then create a new one
    next();
});

// To load file system
// Reference Lab 14 from Professor Daniel Port
var fs = require('fs');
// Read user information file
var user_info_file = './user_information.json'
var user_info = JSON.parse(fs.readFileSync(user_info_file, 'utf-8')); // to read user information database and decrypt

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./store_information'));

app.get('/add_to_cart', function (request, response) { // create a router to handle adding order to shopping cart
    var product_key = request.query['product_key'] // get product's name
    var product_quantity= request.query['quantity'] // get quantity from the query and put them in a variable
    var errs = []; // to put error message and it is used for input validation
    if (typeof request.query['tax_year'] != 'undefined') { // only one display page has tax year input, if the query is defined, that means the router is handling that (tax service) display page order
        var product_tax_year = request.query['tax_year']// get tax year from the query and put them in a variable
        }
    for (i=0; i< product_quantity.length; i++) { 
        if (Number(product_quantity[i]) != product_quantity[i]) { // check quantity input is a number or not
           errs.push('Your input is not a number!') // if it is not a number, push error message in the error array
        };
        if (product_quantity[i] < 0) { // check quantity input is a positive number or not
            errs.push('Please enter a positive value!'); // if it is not a positive number, push error message in the error array
        };
        if (parseInt(product_quantity[i]) != product_quantity[i]) { // check quantity input is an integer or not
            errs.push('Your input is not an integer!'); // if it is not an integer, push error message in the error array
        };
        if (typeof product_tax_year != 'undefined') { 
            if (product_quantity[i] >0) { // push error message only when the client has inputted quantity for the related product
                if (product_tax_year[i] == '0' || product_tax_year[i] == '') {
                    errs.push(`Please enter your tax year in box ${[i+1]}!`); // indicate which textbox input is invalid
                }
            }
        };
    };
    if (errs.length == 0) { // if the error array is empty, there is no error in all inputs, continue process input to session
        if (typeof request.session.cart[product_key] == 'undefined') { // if the product's session is not set up before, then set up
            request.session.cart[product_key] = {}; // initiate the product's session
        }
    request.session.cart[product_key]['tax_year'] = product_tax_year; // create an object in session to store tax year information
    request.session.cart[product_key]['quantity'] = product_quantity; // create an object in session to store quantity information
    response.redirect(`display_${product_key}.html?message=Your order has been added to the shopping cart! You can change your order by modifying the input box.`); // to redirect to the original display page with message, tell client that order is in the shopping cart
    console.log(request.session.cart);
    } else {
        response.redirect(`display_${product_key}.html?error=${errs.join(" ; ")}`); // if there is error message, redirect back to the display page and present the error message
    }
});

// Reference: Professor Daniel Port - Assignment 3 Code Example - Example 2: A simple shopping cart example
app.post("/get_cart", function (request, response) { // use this router to send session information to the shopping cart page and display pages
    console.log(request.session.cart);
    response.json(request.session.cart);  
});

// process login information
// Reference Professor Daniel Port Screencast:https://www.youtube.com/watch?v=cJxLxCzL-0M
// for security purpose, use POST to handle the submission
app.post('/process_login', function(request, response, next){
    console.log(request.query)
    // Check login information with database information
    // Reference Professor Daniel Port Lab 14
    let username_inputted = request.body['user_name']; // get user_name from request
    let password_inputted = request.body['user_password']; // get password from request
    // Check if the client is login by checking cookie
    if (typeof request.cookies['userlogin'] != 'undefined') {
    // if cookie is not undefined, redirect back to login page
    // the login page will change the welcome message to show the login status
        response.redirect('login_page.html');
    }
    if (typeof user_info[username_inputted]!= 'undefined') { //Check if the username exists 
        if(user_info[username_inputted]['password'] == password_inputted ) { // for existing client, check password if it is same with the database information
    // Successfully login
    // If password matches, send client a cookie to record client login status
        response.cookie('userlogin',username_inputted); // send cookie if the client's username and password match with database information to contain username information
        response.redirect('login_page.html');  // redirect back to login page, the login page will change the welcome message to show the login status
        } else { // Password doesn't match with database, redirect back to login page
            request.query['password_wrong'] = 'true'; // existing client with wrong password
            response.redirect('login_page.html?' + qs.stringify(request.query)); // redirect back to login page and display the error message
        }
    } else { //If the username doesn't exist, ask client to create an account
        request.query['uname_notexist'] = 'true'; // no an existing client
        response.redirect('login_page.html?' + qs.stringify(request.query)); // Redirect back to login page with error message
        
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
    if (letters.test(request.body['new_client_full_name'])) { // check if full name only include letters
        // no error meessage is displayed if it returns ture
        // .test() refers from https://www.w3schools.com/jsref/jsref_regexp_test.asp
        console.log('valid full name');
    } else {
        error_message.push('Please enter valid full name!') // push error message in the error array for later validation use
    };
    
    // Check username
    if (validinput.test(request.body['new_user_name'])) { // check if input is only number and letter
        // no error meessage is displayed if it returns ture
        console.log('valid username');
    } else {
        error_message.push('Please enter valid user name!'); // push error message in the error array for later validation use
    };

    // Check username
    if (typeof user_info[request.body['new_user_name']] == 'undefined') { // check if username is existing
        // no error meessage is displayed if it returns ture
        console.log('valid username');
    } else {
        error_message.push('This username is existed!'); // push error message in the error array for later validation use
    };

    // Check password
    if (password == confirm_password) { // check if the password and the confirmed password match
        // no error meessage is displayed if it returns ture
        console.log('Matched password');
    } else {
        error_message.push('Passwords Not Match') // push error message in the error array for later validation use
    };

    // Check email
    if (mailformat.test(request.body['new_email'])) { // check if the email contains all essential and valid elements
        // no error meessage is displayed if it returns ture
        console.log('valid email');
    } else {
        error_message.push('Please enter valid email!') // push error message in the error array for later validation use
    };

    // Update database with registration information
    // Reference Professor Daniel Port Lab 14
    username = request.body["new_user_name"];
    user_info[username] = {}; // initiate user information with unique username
    user_info[username].password = request.body["password"];
    user_info[username].email = request.body["new_email"];
    user_info[username].name = request.body["new_client_full_name"];
    if (error_message.length == 0) { // if the error message array is 0, no error
    // Use file system write to update database
    fs.writeFileSync(user_info_file, JSON.stringify(user_info)); // process registration by adding information in the database
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

app.get('/send_invoice', function(request, response) { // use this router to check if client is login or not
    if (typeof request.cookies['userlogin'] == 'undefined') { // undefined cookie, client is not login, redirect to login page with error message
        response.redirect('login_page.html?message=Please login your account to finish checkout'); 
    }
    else { // existed cookie, client is login
        user_email = user_info[request.cookies['userlogin']]['email']; // store user's email into a variable
// Set up mail server. Only will work on UH Network due to security restrictions
// Reference: Professor Daniel Port - Assignment 3 Code Example - Example 3: Creating an invoice to both print and email (also example of node mailer component) example
// to use node mailer to send email inside the UH network
        var transporter = nodemailer.createTransport({
            host: "mail.hawaii.edu",
            port: 25,
            secure: false, // use TLS
            tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
            }
        });

        var user_email = user_info[request.cookies['userlogin']]['email']; // store user's email into a variable
        var mailOptions = {
            from: 'qiaojing@hawaii.edu',
            to: user_email,
            subject: 'Your invoice from Tax Preparation Company',
            html: invoice_purchase.html
        };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        response.redirect('invoice_purchase.html?message=Error exists, we could not email your invoice!'); 
        } else {
            response.redirect('invoice_purchase.html?message=Everything all set! Your invoice is emailed to you!'); // send out invoice
        }
    });
}});