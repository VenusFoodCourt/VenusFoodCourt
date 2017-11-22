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

//var db = new Sequelize('judgeFoody', 'root', '');
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

var foodPostIdAssignerByUserId = function (userId) {
  return FoodPost.findOne({
    where: {
      userId: userId
    }
  })
  .then(function(wholeRow) {
    console.log('foodpost id is ', wholeRow.id);
    return wholeRow.id;
  })
  .catch(function(err) {
    console.log('following error has occured while retrieving foodPostId', err)
  })
} 

 var insertInTo = function (tableName, obj) {
  if (tableName === Users) {
    db.sync()
      .then(function () {
        Users.create({
          userName: obj.userName
        })
      })
      .catch(function(err){
        console.log('following error has occured while entering data in users table', err);
      });
  } else if (tableName === FoodPost) {
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
    } else if (tableName === Comments) {
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
    } else if (tableName === Votes) {
      db.sync()
        .then(function(){
          return userIdAssignerByGivenUsername(obj.userName)
            .then(function(userId){
              tableName.create({
                voteValue: obj.voteValue,
                userId: userId, 
                foodPostId: obj.foodPostId
              })
            })
        })
        .catch(function(err) {
          console.log('following error has occred while inserting into votes table', err);
        })
    }
 }


var findAllbyTableName = function(tableName, callback) {
  if (tableName === Users) {
    tableName.findAll()
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
  } else if (tableName === FoodPost) {
    tableName.findAll()
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
  } else if (tableName === Comments) {
    tableName.findAll()
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
      resultArr.push(result[i].text);
    }
    console.log(resultArr);
   })
  .catch(function(err) {
    console.log('following err has occured', err);
  });
}

// var findUserNameByUserId = function(userId) {
//   Users.findOne({
//     where: {
//       id: userId
//     }
//   })
//   .then(function(result) {
//     return result.userName;
//   })
//   .catch(function(err){
//     console.log('following error has occured while retrieving user name', err);
//   })
// };


// //findUserNameByUserId(2);
// var findAllVotesByUserName = function (userId, callback) {
//   var resultArr = [];
//   db.sync()
//     .then(function (){
//       return findUserNameByUserId(userId)
//       .then(function(userName){
//         Votes.findAll({
//           where: {
//             userId: userId
//           }
//         })
//       })
//       .then(function(result) {
//         console.log('result issssssssssssssssssssssssssssssssssssss', result);
//       })
//     })
//     .catch(function(err){
//       console.log('following erros has occured while retrieving votes table information', err);
//     });
// };    

// insertInTo(Votes, {

// });
// // insertInTo(Users, {userName: 'Johnny Chen'});
// insertInTo(Users, {userName: 'Muhammad Rashid'});

//insertInTo(FoodPost, {userName: 'Johnny', title: 'new test', description: 'something something', url: 'https;//Johnnyg.com'});

//insertInTo(Comments, {userName: 'Brendon Verch', foodPostId: 2, text: 'test new thing'});

// findAllCommentsByFoodPostId(3, function(err, data){
//   if (err) {
//     console.log('following error has occured', err);
//   } else {
//     console.log('here is the data', data);
//   }
// })

// findAllbyTableName(Comments, function(err, data){
//   if (err) {
//     console.log('this is err', err);
//   } else {
//     console.log('data is ', data);
//   }
// });

//get rid of foodPostId grabber function as foodpostId will be provided






