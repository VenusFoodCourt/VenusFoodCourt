/*
This file takes data from /foodPost POST endpoint and uploads to s3. Upon uploading, s3 will return a link to be stored in our database.
*/

var AWS = require('aws-sdk');


const bucketName = 'venusfoodcourt';
const bucketRegion = 'us-west-1';

let AWS_ACCESS_KEY_ID = '';
let AWS_SECRET_ACCESS_KEY = '';
// if environment is production, use process.env environment variables
if (process.env.NODE_ENV === 'production') {
  AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  var envBucketFolder = 'public';
} else { // else use local machine keys
  console.log('node env: ', process.env.NODE_ENV);
  const AWS_KEY = require('../config/AWS.js');
  AWS_ACCESS_KEY_ID = AWS_KEY.AWS_ACCESS_KEY_ID;
  AWS_SECRET_ACCESS_KEY = AWS_KEY.AWS_SECRET_ACCESS_KEY;

  var envBucketFolder = 'dev';
}


AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});



var s3 = new AWS.S3({
  params: {Bucket: bucketName}
});

var saveImage = function(fileObj, fileName, contentType) {

  var fileKey = envBucketFolder + '/' + fileName;
  s3.upload({
    Key: fileKey,
    Body: fileObj,
    ContentType: contentType
  }, function(err, data) {
    if (err) {
      return console.log('There was an errior uploading your image: ', err.message);
    }
    console.log('Successfully uploaded image!');
  });
};

module.exports.saveImage = saveImage;
