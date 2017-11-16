var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// define port
let port = process.env.PORT || 3000;
app.listen(port);

// middleware

app.use(express.static(path.join(__dirname, '../client/src'))); // add static directory to serve files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
