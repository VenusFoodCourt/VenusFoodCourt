// insertinto
// findallbytablename
var {insertInTo, findAllbyTableName} = require('./helper.js');




// create a users
var createSampleUsers = () => {
  insertInTo('Users', {userName: 'Muhammad', password: 'password'});
  insertInTo('Users', {userName: 'Brendon', password: 'password'});
  insertInTo('Users', {userName: 'Johnny', password: 'password'});
}



// create a sample post made by a username

var createSamplePost = () => {
  insertInTo('FoodPost', {
    userName: 'Johnny',
    title: 'Yummy Food',
    description: 'Delicious food that I got today',
    url: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upload_3f4bfa3f2b0805152414dd1a118fad4d.png'
  });
}

createSampleUsers();
createSamplePost();

// dbHelper.insertInto(Comments, {
//   userName: 'Johnny',
//   text: 'Looks delicious',
//
// });
// create a comment made by user name  on the post
