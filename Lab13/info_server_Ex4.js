var products = require('./product_data.json');

app.get("/product_data.js", function (request, response, next) {
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});


function process_quantity_form (POST, response) {
let model = products[0]['model'];
let model_price = products[0]['price'];
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path
    + 'with query' + JSON.stringify(request.query));
    next ();
});

app.get('/test', function (request, response, next) {
    response.send('I got a request for /test');
});

process_quantity_form(request.body, response); {
    user_data = {'username':'itm352', 'password':'grader'};
    post_data = request.body;
    if(post_data['user_name']) {
        if(user_data['username'] == (post_data['user_name'])) {
            response.redirect('invoice_purchase.html?quantity_textbox='+the_qty);
            return;
        } else {
            response.redirect('./login_page.html?user_name='+user_name);
        }
}
};

app.use(express.static('./public'));

app.listen(8080, function () {console.log(`listening on port 8080`
)
}
); // note the use of an anonymous function here

function isNonNegInt(q,returnErrors=false) {
if(q =='') q=0;
var errors = []; // assume no errors at first
if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
return returnErrors ? errors : (errors.length == 0);
};
}