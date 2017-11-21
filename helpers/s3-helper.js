/*
This file takes data from /foodPost POST endpoint and uploads to s3. Upon uploading, s3 will return a link to be stored in our database.
*/

var AWS = require('aws-sdk');

const albumBucketName = 'venusfoodcourt';
const bucketRegion = 'us-west-1';
const IdentityPoolId = 'us-east-1:ab20b55d-9f73-4839-a722-5697d7348f5a';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

var saveImage = function(fileObj) {

  var fileKey = 'dev' + '//' + fileObj.name;
  s3.upload({
    Key: fileKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return console.log('There was an errior uploading your photo: ', err.message);
    }
    console.log('Successfully uploaded photo!');
  });
};
