var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');

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
app.use(session({ secret: 'topsecret'}));
app.use(cookieParser('topsecret'));
app.use(passport.initialize());
app.use(passport.session());

// define passport strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('WWWWWWWWWWWWWWWWWWWWWWW');
    db.Users.findOne({username: username}, function(err, user) {
      console.log('WWWWWWWWWWWWWWWWWWWWWWWWWW');
      if (err) {
        console.log('WWWWWWWWWWWWWWWWWWWWWWWW ERRRRRR');
        return done(err); }
      if (!user) {
        console.log('USER NOT FOUND');
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!user.password === password) {
        console.log('PASSWORD NOT FOUND');
        return done(null, false, { message: 'Incorrect password' });
      }
      console.log('USER VALIDATED');
      return done(null, user);
    });
  }
));

app.get('/foodPosts', function(req, res) {
  // endpoint to get foodposts from db to display on the front page
  console.log('req.session: ', req.session);
  console.log('unsigned req.cookies: ', req.cookies);
  console.log('signed req.signedCookies: ', req.signedCookies);
  db.findAllbyTableName('FoodPost', function(err, data){
    if(err) {
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
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
      res.send(data + '');
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
          }, (err, msg) => {
            if (err) {
              throw err;
            } else {
              fs.unlink(files.imageFile.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:"+err);
                } else {
                    console.log('successfully deleted local image');
                }
              });
              res.send('file uploaded');
              console.log(msg);
            }
          });
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
      }, () => {
        res.sendStatus(201);
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
      }, () => {
        res.sendStatus(201);
      });
    });

  form.parse(req);
});

app.post('/signup', function(req, res) {
  console.log('inside /signup');
  var form = new formidable.IncomingForm();
  var fields = {};
  form.encoding = 'utf-8';


  form
    .on('field', function(field, value) {
      fields[field] = value;
      console.log(fields);
    })
    .on('end', function() {
      // check if username exists
      // if user name exists, respond with a message stating it exists
      console.log('/signup .on end');
      db.isValidUser(fields.username)
      .then((result) => {
        console.log('isValidUser result:', result);
        if (result === true) {
          res.send('User already exists');
        } else {
          db.insertInTo('Users', {
            userName: fields.username,
            password: fields.password
          }, function(err, msg){
            if (err) {
              throw err;
            } else {
              res.send(msg);
            }
          });
        }
      });
    });

  form.parse(req);
});

app.post('/login', function(req, res, next) {
  console.log('inside /login');
  var form = new formidable.IncomingForm();
  var fields = {};
  form.encoding = 'utf-8';


  form
    .on('field', function(field, value) {
      fields[field] = value;
      console.log(fields);
    })
    .on('end', function() {
      // check if username exists
      // if user name exists, respond with a message stating it exists

    db.isValidUser(fields.username)
      .then((userValid)=>{
        if (userValid) {
          db.isValidPassword(fields.username, fields.password)
            .then((passwordValid)=>{
              if (passwordValid) {
                res.statusCode = 200;
                res.send('validated');
              } else {
                res.statusCode = 401;
                res.send('invalid password');
              }
            })
        } else {
          res.statusCode = 401;
          res.send('invalid user');
        }
      })
    });

  form.parse(req);

  // passport.authenticate('local', {
  //   successRedirect: '/successLogin',
  //   failureRedirect: '/'
  // });

});
