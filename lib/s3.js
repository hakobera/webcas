var knox = require('knox');

var ENV = process.env;

var bucket = 'proto-webcast';

var client = knox.createClient({
    key: ENV['AWS_ACCESS_KEY_ID']
  , secret: ENV['AWS_ACCESS_SECRET_KEY']
  , bucket: bucket
});

module.exports = client;