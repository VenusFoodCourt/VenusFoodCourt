var Sequelize = require('sequelize');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS judgeFoody", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

var db = new Sequelize('judgeFoody', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

var Users = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: Sequelize.STRING,
    unique: true
  }
});

var FoodPost = db.define('foodPost', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    unique: true
  },
  description : {
    type: Sequelize.TEXT
  },
  url: {
    type: Sequelize.STRING
  }
});

FoodPost.belongsTo(Users);

var Comments = db.define('comments', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: Sequelize.STRING(800),
    unique: true
  }
});
Comments.belongsTo(Users);
Comments.belongsTo(FoodPost);

var Votes = db.define('votes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  voteValue: {
    type: Sequelize.INTEGER
  }
});

Votes.belongsTo(Users);
Votes.belongsTo(FoodPost);

db.sync();
//*******************************************************************************************//
//----------- following function is just a private/helper function for this file ------------//
//------------ Don't worry about it as you won't be using it anywhere -----------------------//

var userIdAssignerByGivenUsername = function (username) {
  return Users.findOne({
    where: {
      userName: username
    }
  })
  .then(function(result) {
    console.log(' id is ', result.id);
    return result.id;
  })
  .catch(function(err) {
    console.log('following error has occured', err);
  })
};

//********************************************************************************************//

var insertInTo = function (tableName, obj) {
if (tableName === 'Users') {
  db.sync()
    .then(function () {
      Users.create({
        userName: obj.userName
      })
    })
    .catch(function(err){
      console.log('following error has occured while entering data in users table', err);
    });
} else if (tableName === 'FoodPost') {
    db.sync()
    .then(function(){
      return userIdAssignerByGivenUsername(obj.userName)
        .then(function(userId){
          if (userId) {
            FoodPost.create({
            title: obj.title,
            description: obj.description,
            url: obj.url,
            userId: userId
          })
        }
      })
    })
    .catch(function (err){
      console.log('following error has occured while entering data in foodPost table', err);
    });
  } else if (tableName === 'Comments') {
    db.sync()
      .then(function(){
        return userIdAssignerByGivenUsername(obj.userName)
          .then(function(userId){
            if (userId) {
              Comments.create({
                text: obj.text,
                foodPostId: obj.foodPostId,
                userId: userId
              })
            }
          })
      })
    .catch(function(err) {
      console.log('following eroor has occred while entering data in comments table', err);
    })
  } else if (tableName === 'Votes') {
    db.sync()
      .then(function(){
        return userIdAssignerByGivenUsername(obj.userName)
          .then(function(userId) {
          Votes.findOne({
            where: {
              userId: userId,
              foodPostId: obj.foodPostId
            }
          })
          .then(function(result){
            if(result) {
              Votes.update(
                {voteValue: obj.voteValue},
                {where: {
                  userId: userId,
                  foodPostId: obj.foodPostId
                }}
              )
            } else {
              Votes.create({
                voteValue: obj.voteValue,
                userId: userId,
                foodPostId: obj.foodPostId
              })
            }
          })
          })
      })
      .catch(function(err) {
        console.log('following error has occred while inserting into votes table', err);
      })
  }
}

var findAllbyTableName = function(tableName, callback) {
  if (tableName === 'Users') {
    Users.findAll()
    .then(function(result){
      var resultArr = [];
      for (var i = 0; i < result.length; i++) {
        resultArr.push({
          id: result[i].id,
          userName: result[i].userName,
          createdAt: result[i].createdAt,
          updatedAt: result[i].updatedAt
        });
      }
      callback(null, resultArr);
    })
    .catch(function(err) {
      callback(err, null);
    })
  } else if (tableName === 'FoodPost') {
    FoodPost.findAll()
      .then(function(result){
        var resultArr = [];
        for (var i = 0; i < result.length; i++) {
          resultArr.push({
            id: result[i].id,
            title: result[i].title,
            description: result[i].description,
            url: result[i]. url,
            userId: result[i].userId,
            createdAt: result[i].createdAt,
            updatedAt: result[i].updatedAt
          });
        }
        callback(null, resultArr);
      })
      .catch(function(err){
        callback(err, null);
      });
  } else if (tableName === 'Comments') {
    Comments.findAll()
      .then(function(result) {
      var resultArr = [];
      for (var i = 0; i < result.length; i++) {
        resultArr.push({
          id: result[i].id,
          text: result[i].text,
          userId: result[i].userId,
          foodPostId: result[i].foodPostId,
          createdAt: result[i].createdAt,
          updatedAt: result[i].updatedAt
        })
      }
      callback(null, resultArr);
      })
      .catch(function(err) {
        callback(err, null);
      })
  } else if (tableName === 'Votes') {
    var resultArr = [];
    Votes.findAll()
      .then(function (result) {
        for (var i = 0; i < result.length; i++) {
          resultArr.push({
            id: result[i].id,
            voteValue: result[i].voteValue,
            createdAt: result[i].createdAt,
            updatedAt: result[i].updatedAt
          });
        }
        callback(null, resultArr);
      })
      .catch(function(err) {
        callback(err, null);
      });
  }
}

var findAllCommentsByFoodPostId = function (foodPostId, callback) {
  var resultArr = [];
  Comments.findAll({
    where: {
      foodPostId: foodPostId
    }
  })
  .then(function(result) {
    for (var i = 0; i < result.length; i++) {
      resultArr.push({
        id: result[i].id,
        text: result[i].text,
        userId: result[i].userId,
        foodPostId: result[i].foodPostId,
        createdAt: result[i].createdAt,
        updatedAt: result[i].updatedAt
      });
    }
    callback(null, resultArr);
   })
  .catch(function(err) {
    callback(err, null);
  });
}

var votesStatusOfUser = function (userName, foodPostId, callback) {
  var resultArr = [];
  userIdAssignerByGivenUsername(userName)
    .then(function(userId){
      Votes.findAll({
        where: {
          userId: userId,
          foodPostId: foodPostId
        }
      })
      .then(function(result){
        for (var i  = 0; i < result.length; i++) {
          resultArr.push({
            id: result[i].id,
            userName: userName,
            voteValue: result[i].voteValue,
            createdAt: result[i].createdAt,
            updatedAt: result[i].updatedAt
          })
        }
        callback(null, resultArr);
      })
    })
    .catch(function(err){
      callback(err, null);
    })
};


var totalVoteCountByFoodPostId = function(foodPostId, callback) {
  var totalVotes = 0;
  Votes.findAll({
    where: {
      foodPostId: foodPostId
    }
  })
  .then(function(result) {
    for (var i = 0; i < result.length; i++) {
      totalVotes += result[i].voteValue;
    }
    callback(null, totalVotes);
  })
  .catch(function(err) {
    callback(err, null);
  });
};


module.exports.insertInTo = insertInTo;
module.exports.findAllbyTableName = findAllbyTableName;
module.exports.findAllCommentsByFoodPostId = findAllCommentsByFoodPostId;
module.exports.votesStatusOfUser= votesStatusOfUser;
module.exports.totalVoteCountByFoodPostId = totalVoteCountByFoodPostId;

//insertInto --> takes two parameters (1)tableName (2) object containing key-value pair of userName
//findAllbyTableName --> takes two parameters (1)table name (2)callback function with error and data as its parameters
//findAllCommentsByFoodPostId --> takes two parameters (1)specific foodPostId (2) callback function with error and data as its parameters
//votesStatusOfUser --> takes two parameters (1) specific userName (2) callback function with error and data as its parameters
//totalVoteCountByFoodPostId --> takes two parameters (1) specific foodPostId (2) callback function with error and data as its parameters

//****************** example of inserting data into 'Users' table *****************************//
//
// while inserting data into 'Users' table, user has to provide {userName: '....'}
// insertInTo('Users', {userName: 'Muhammad Rashid'});
// insertInTo('Users', {userName: 'Brendon Verch'});
// insertInTo('Users', {userName: 'Johnny Chen'});
//--------------------------------------------------------------------------------------------//

//****************** example of inserting data into 'FoodPost' table *************************************************//
//
//while inserting data into 'FoodPost' table, user has to provide {userName:'...', title:'...', description:'...', url:'...'}
// insertInTo('FoodPost', {userName: 'Brendon Verch', title: 'test', description:'first test', url: 'www.google.com'});
// insertInTo('FoodPost', {userName: 'Johnny Chen', title: 'test2', description:'second test', url: 'www.yahoo.com'});
// insertInTo('FoodPost', {userName: 'Muhammad Rashid', title: 'test3', description:'third test', url: 'www.facebook.com'});
//-------------------------------------------------------------------------------------------------------------------------//

//******************** example of inserting data into 'Comments' table **********************************************//
//
//while inserting data into 'Comments' table, user has to provide {userName: '....', foodPostId:'...', text:'...'}
// insertInTo('Comments', {userName: 'Johnny Chen', foodPostId: 3, text: 'this food looks good'});
// insertInTo('Comments', {userName: 'Muhammad Rashid', foodPostId: 1, text: 'awesome food'});
// insertInTo('Comments', {userName: 'Brendon Verch', foodPostId: 2, text: 'delicious food'});
//-------------------------------------------------------------------------------------------------------------------//

//************************** example of inserting data into 'Votes' table ***************************//
//
//while inserting data into 'Votes' table, user has to provide {userName: '....', voteValue:'...', foodPostId:'...'}
// insertInTo('Votes', {userName:'Johnny Chen', voteValue: -1, foodPostId: 2});
// insertInTo('Votes', {userName:'Muhammad Rashid', voteValue: 0, foodPostId: 3});
// insertInTo('Votes', {userName:'Brendon Verch', voteValue: -1, foodPostId: 1});
//---------------------------------------------------------------------------------------------------//

//********************* example of grabing all the data from specific table *************************//
// findAllbyTableName('Votes', function(err, data) {
//   if (err) {
//     console.log('err is', err);
//   } else {
//     console.log('data is ', data);
//   }
// })
//___________________________________________________________________________________________________//

//********************** example of grabing all the comments by specific FoodPostId ********************************//
// findAllCommentsByFoodPostId(3, function(err, data) {
//   if (err) {
//     console.log('this erros has occured', err);
//   } else {
//     console.log('this is data', data);
//   }
// })
//__________________________________________________________________________________________________________________//

//********************* example of grabing all the data from 'votes' table by specific user name *********************//
// votesStatusOfUser('Muhammad Rashid', function(err, data) {
//   if (err) {
//     console.log('following err has occured', err);
//   } else {
//     console.log('here is the data', data);
//   }
// })
//--------------------------------------------------------------------------------------------------------------------//

//********************** example of grabing total votes by specific FoodPostId ********************************//
// totalVoteCountByFoodPostId(1, function(err, data) {
//   if (err) {
//     console.log('this erros has occured', err);
//   } else {
//     console.log('this is data', data);
//   }
// })
//__________________________________________________________________________________________________________________//
