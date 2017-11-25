var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');

var s3Helper = require('../helpers/s3-helper.js');

var db = require('../database/helper.js');


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

  db.findAllbyTableName('FoodPost', function(err, data){
    if(err) {
      res.send(err);
    }
    res.send(data);
  });

  //  response expects an array of foodPost objects from the database
});

app.get('/foodPost', function(req, res) {
  // endpoint to get single foodPost from db to display on the front page
  res.statusCode = 200;

});

app.get('/comments/:foodPostId', function(req, res) {
  // endpoint to retrieve comments for individual food post page
  res.statusCode = 200;
  var foodPostId = req.params.foodPostId;
  console.log('foodPostId', foodPostId);
  db.findAllCommentsByFoodPostId(foodPostId, function(err, data) {
    if (err) {
      res.send('Error in retrieving comments');
    } else {
      res.send(data);
    }
  });  
});


app.post('/foodPost', function(req, res) {
  // endpoint to post an individual food post
  console.log('inside /foodPost');
  var form = new formidable.IncomingForm();
  var files = {};
  var fields = {};
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname, '../temp/uploads');
  form.keepExtensions = true;

  form
    .on('field', function(field, value) {
      fields[field] = value;
    })
    .on('file', function(field, file) {
      files[field] = file;
    })
    .on('end', function() {
      console.log('~> upload done');
      console.log('files: ', files);
      var newFileName = path.basename(files.imageFile.path);
      var contentType = files.imageFile.type;
      fs.readFile(files.imageFile.path, function(err, imgFileData) {
        s3Helper.saveImage(imgFileData, newFileName, contentType)
        .then((fileUrl) => {
          return db.insertInTo('FoodPost', {
            userName: fields.username,
            title: fields.title,
            description: fields.description,
            url: fileUrl
          });
        })
        .then(() => {
          res.send('file uploaded');
        })
        .catch((err) => {
          res.send(err);
        });
      });


    });

  form.parse(req);


});

app.post('/comment', function(req, res) {
  // endpoint for a user to post an individual comment when user is on an individual food post
});

app.post('/vote', function(req, res) {
  // endpoint for a user to upvote a food post
});

// ill pass foodPostID to comments
//
// vote count: /voteCount
//
// ill pass foodPostID to voteCount
//
// vote status: /voteStatus
//
// ill pass foodPostID and userName to /voteStatus
//
// post sending in foodPost object
//
// post to comments with {username, foodPostID, text}
//
// post to votes with {username, foodPostID, voteValue}
//
// get to foodPosts returning all food posts
//
// get to comments returning all comments based on passed in foodPostID
//
// get to voteCount returning sum of votecounts from database function based on passed in foodPostID
//
// get to voteStatus based on userName and foodPostID
