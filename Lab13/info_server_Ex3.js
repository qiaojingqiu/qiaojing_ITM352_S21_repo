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

app.post('/display_purchase.html', function (request, response, next) {
    post_data = request.body;
    response.send(JSON.stringify(post_data));
});

app.use(express.static('./public'));

app.listen(8080, function () {console.log(`listening on port 8080`
)
}
); // note the use of an anonymous function here