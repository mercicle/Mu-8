
var path = require('path');
var fs = require('fs');
var util = require('util');

var mongo = require('../config/mongo');

var mongoDB = mongo.db;
var BSON = mongo.BSON;

exports.getAllIndexNames = function(req, res) {

    console.log("==== INSIDE GET getAllIndexNames ===");
    var geneList  = req.query.geneList;
 
      mongoDB.collection('aaIndices', function(err, collection) {
      collection.find({}).toArray(function(err, aaindices){
          res.send(aaindices);
      });
    });

}
 
exports.getIndexValues = function(req, res) {
 
    var geneSetName = req.params.aaName;
    console.log(aaName);
 
      mongoDB.collection('aaIndices', function(err, collection) {
      collection.findOne({"name":aaName},{"_id":0, "name":0}, function(error, aaindex){
            res.send(aaindex);
      });
    });

}

