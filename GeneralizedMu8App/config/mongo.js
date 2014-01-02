
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('mu8', server, {safe: true});

var MongoClient = require('mongodb').MongoClient

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'mu8' database");
    }
});

module.exports = {    
    db: db,
    BSON: BSON,
    mongoClient: MongoClient
}


/*
var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
  var db1 = mongoClient.db("mydb");
  console.log(db1);
  mongoClient.close();
});
*/