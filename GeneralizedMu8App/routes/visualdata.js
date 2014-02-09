
var path = require('path');
var fs = require('fs');
var util = require('util');
require('sylvester');
var sci = require('science');
var math = require('mathjs');
var d3 = require('d3');

var mongo = require('../config/mongo');

var mongoDB = mongo.db;
var BSON = mongo.BSON;

var residueMap = require('../serversideJS/ResidueToIndexMap.js');

var helpers = require('../serversideJS/helperFunctions.js');

var mime = require('mime');

exports.getColorsAndVerticesFileForVisualization = function(req, res) {

    var computationID = req.params.computationId;

    var filePath = 'processedPDBFiles/'+'colorsAndVerticesFile_'+computationID+'.js';
    //console.log("Returning " + filePath);

    fs.readFile(filePath, function(err, data) {

      if (err) {
        res.writeHead(500);
        res.end("");
        return;
      }

      res.contentType = mime.lookup(filePath);
      res.writeHead(200);
      res.end(data); 

    });

}

exports.getInitBuffersFileForVisualization = function(req, res) {

    var computationID = req.params.computationId;

    var filePath = 'processedPDBFiles/'+'initBuffersFile_'+computationID+'.js';
    //console.log("Returning " + filePath);

    fs.readFile(filePath, function(err, data) {

      if (err) {
        res.writeHead(500);
        res.end("");
        return;
      }

      res.contentType = mime.lookup(filePath);
      res.writeHead(200);
      res.end(data); 

    });

}

exports.getAllResultsFileForVisualization = function(req, res) {

    var computationID = req.params.computationId;
 
    var filePath = 'processedFiles/'+'finalResults_'+computationID+'.js';
    //console.log("Returning " + filePath);

    fs.readFile(filePath, function(err, data) {

      if (err) {
        res.writeHead(500);
        res.end("");
        return;
      }

      res.contentType = mime.lookup(filePath);
      res.writeHead(200);
      res.end(data); 

    });

}


exports.getDataForVisualization = function(req, res) {
    
    var computationId = req.params.computationId;
    
    //console.log('inside getDataForVisualization:');
    //console.log('computationId: ' + computationId);
    var prinCompNames = ["AlphaHelixPC1","BetaSheetPC1","CompositionPC1","HydrophobicityPC1","OtherPropertiesPC1","PhysicoChemicalPC1"];

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/mu8', function(err, db){

      if(err) throw err;

      var collection = db.collection('AAIndices');
      collection.find({$or: [{ 'accession': {$in: prinCompNames}}]}, { "description": 0,"_id":0,"category":0,"aaIndexIndex":0}).toArray(function(err, aaindices){

          var collection = db.collection('MSA_ForID_' + computationId);
          collection.find({}).toArray(function(err, sequences){

              var referenceSequence  = sequences[0].sequence.split("");

              //console.log('referenceSequence');
              //console.log(referenceSequence);

              var residueScoresToSendBack = [];
              var stdDevToSendBack = [];
              for (var aai = 0; aai < aaindices.length; aai++){

                    var aaindex = aaindices[aai].indices;
                    var thisAccession  = aaindices[aai].accession;
                    //console.log('aaindex: ' + aaindices[aai].accession);

                    var numCol = sequences[0].sequence.length;
                    var scoredMSA = [];
                    for (var i = 0; i < sequences.length; i++){
                        var thisSequence = sequences[i].sequence;
                        thisSequence = thisSequence.split(""); //split the sequence
                        var scoredSequence = residueMap.ScoreSequence(thisSequence,aaindex);
                        scoredMSA.push(scoredSequence);
                    }

                    var rawScore = scoredMSA[0];
                    var stdScores = [];
                    var stdDevs = [];
                    
                    for (var i = 0; i < numCol; i++){

                        var thisCol = helpers.getColumnJ(i,scoredMSA);
                        var ave = d3.mean(thisCol);
                        var sd = Math.sqrt(sci.stats.variance(thisCol));

                        var stdRez = (rawScore[i] - ave)/sd;
                        stdScores.push([referenceSequence[i],stdRez]);
                        stdDevs.push([referenceSequence[i],sd]);

                    }

                    residueScoresToSendBack.push( stdScores );
                    stdDevToSendBack.push( stdDevs );

              }

              var finalResultsToSendBack = [];

              //now get the 3d distances I need for the viz
              var pdbCollection = db.collection('PDB_ForID_' + computationId);
              pdbCollection.find({}).toArray(function(err, positions){
                    var pdbDistancesToSendback = helpers.computeDistances(positions);
                    finalResultsToSendBack.push(residueScoresToSendBack,stdDevToSendBack,pdbDistancesToSendback);
                    res.send(finalResultsToSendBack);
              });
          });
      });
    });
}


exports.getNewIndexForVisualization = function(req, res) {
    
    var computationId = req.params.computationId;
    var accession = req.params.accession;

    //console.log('inside getNewIndexForVisualization:');
    //console.log('computationId: ' + computationId);

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/mu8', function(err, db){

      if(err) throw err;

      var collection = db.collection('AAIndices');
      collection.find({$or: [{ 'accession':  accession}]}, { "description": 0,"_id":0,"category":0,"aaIndexIndex":0}).toArray(function(err, aaindices){

          var collection = db.collection('MSA_ForID_' + computationId);
          collection.find({}).toArray(function(err, sequences){

              var referenceSequence  = sequences[0].sequence.split("");

              var residueScoresToSendBack = [];
              var stdDevToSendBack = [];
              for (var aai = 0; aai < aaindices.length; aai++){

                    var aaindex = aaindices[aai].indices;
                    var thisAccession  = aaindices[aai].accession;
                    //console.log('aaindex: ' + aaindices[aai].accession);

                    var numCol = sequences[0].sequence.length;
                    var scoredMSA = [];
                    for (var i = 0; i < sequences.length; i++){
                        var thisSequence = sequences[i].sequence;
                        thisSequence = thisSequence.split(""); //split the sequence
                        var scoredSequence = residueMap.ScoreSequence(thisSequence,aaindex);
                        scoredMSA.push(scoredSequence);
                    }

                    var rawScore = scoredMSA[0];
                    var stdScores = [];
                    var stdDevs = [];
                    
                    for (var i = 0; i < numCol; i++){

                        var thisCol = helpers.getColumnJ(i,scoredMSA);
                        var ave = d3.mean(thisCol);
                        var sd = Math.sqrt(sci.stats.variance(thisCol));

                        var stdRez = (rawScore[i] - ave)/sd;
                        stdScores.push([referenceSequence[i],stdRez]);
                        stdDevs.push([referenceSequence[i],sd]);

                    }

                    residueScoresToSendBack.push( stdScores );
                    stdDevToSendBack.push( stdDevs );

              }

             var finalResultsToSendBack = [];

              finalResultsToSendBack.push(residueScoresToSendBack,stdDevToSendBack);
              res.send(finalResultsToSendBack);
          });
      });
    });

}
  

  