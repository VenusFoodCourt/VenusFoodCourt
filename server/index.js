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

  db.findAllbyTableName('FoodPost', function(err, data){
    if(err) {
      res.send(err);
    }
    res.statusCode = 200;
    res.send(data);
  });

  //  response expects an array of foodPost objects from the database
});


app.get('/comments/:foodPostId', function(req, res) {
  // endpoint to retrieve comments for individual food post page
  var foodPostId = req.params.foodPostId;

  db.findAllCommentsByFoodPostId(foodPostId, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
});

app.get('/voteCount/:foodPostId', function(req, res) {
  var foodPostId = req.params.foodPostId;

  db.totalVoteCountByFoodPostId(foodPostId, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
});

app.get('/voteStatus/:foodPostId/:username', function(req, res) {
  var foodPostId = req.params.foodPostId;
  var username = req.params.username;

  db.votesStatusOfUser(username, foodPostId, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.statusCode = 200;
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
  var form = new formidable.IncomingForm();
  var fields = {};
  form.encoding = 'utf-8';

  form
    .on('field', function(field, value) {
      fields[field] = value;
    })
    .on('end', function() {
      db.insertInTo('Comments', {
        userName: fields.username,
        foodPostId: fields.foodPostId,
        text: fields.text
      });
    });

  form.parse(req);

});

app.post('/vote', function(req, res) {
  // endpoint for a user to upvote a food post
  var form = new formidable.IncomingForm();
  var fields = {};
  form.encoding = 'utf-8';

  form
    .on('field', function(field, value) {
      fields[field] = value;
    })
    .on('end', function() {
      db.insertInTo('Votes', {
        userName: fields.username,
        foodPostId: fields.foodPostId,
        voteValue: fields.voteValue
      });
    });

  form.parse(req);
});
