
var path = require('path');
var fs = require('fs');
var util = require('util');

var mongo = require('../config/mongo');

var mongoDB = mongo.db;
var BSON = mongo.BSON;

exports.getAllIndices = function(req, res) {

    console.log("==== INSIDE GET getAllIndexNames ===");

    mongoDB.collection('AAIndices', function(err, collection) {
        collection.find({},{ "indices":0}).toArray(function(err, aaindices) {
            res.send(aaindices);
        });
    });


}
 
exports.getIndexValues = function(req, res) {
 
    var aaName = req.params.aaIndexName;
    console.log(aaName);
 
      mongoDB.collection('AAIndices', function(err, collection) {
      collection.findOne({"accession":aaName},{"_id":0, "name":0}, function(error, aaindex){
            res.send(aaindex);
      });
    });

}

