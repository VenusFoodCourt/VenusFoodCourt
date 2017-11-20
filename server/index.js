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

app.get('/foodPosts', function(req, res) {
  // endpoint to get foodposts from db to display on the front page
  res.statusCode = 200;

  let body = res.body;

  // models.Foodpost(res.body)

  //  response expects an array of foodPost objects from the database
});

app.get('/comments', function(req, res) {
  // endpoint to retrieve comments for individual food post page
  res.statusCode = 200;
});


app.post('/foodPost', function(req, res) {
  // endpoint to post an individual food post
});

app.post('/comment', function(req, res) {
  // endpoint for a user to post an individual comment when user is on an individual food post
});

app.post('/vote', function(req, res) {
  // endpoint for a user to upvote a food post
});
