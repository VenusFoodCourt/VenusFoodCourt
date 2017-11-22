/*
This file takes data from /foodPost POST endpoint and uploads to s3. Upon uploading, s3 will return a link to be stored in our database.
*/

var AWS = require('aws-sdk');

const AWS_KEY = require('../config/AWS.js');

const bucketName = 'venusfoodcourt';
const bucketRegion = 'us-west-1';


AWS.config.update({
  accessKeyId: AWS_KEY.ACCESS_KEY_ID,
  secretAccessKey: AWS_KEY.SECRET_ACCESS_KEY
});

var s3 = new AWS.S3({
  // apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});

var saveImage = function(fileObj, fileName, contentType) {

  var fileKey = 'dev' + '/' + fileName;
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
