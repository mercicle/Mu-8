var residueMap = require('../serversideJS/ResidueToIndexMap.js');
var helpers = require('../serversideJS/helperFunctions.js');
var path = require('path');
var fileSystem = require('fs');
var util = require('util');
require('sylvester');
var sci = require('science');
var math = require('mathjs');
var d3 = require('d3');
var mongo = require('../config/mongo');
var BSON = mongo.BSON;

function finalComputationToFile(finalResultsToSendBack){

	var finalResultsJS = "var defaultIndexData = ";

	finalResultsJS += JSON.stringify(finalResultsToSendBack);
	console.log("====================finalComputationToFile=====================");
	//console.log(finalResultsJS);
	console.log("==================== END finalComputationToFile=====================");
	return finalResultsJS;
}


function makeFilesForComputationID(computationId){

    computationId  = computationId + '';

    var prinCompNames = ["AlphaHelixPC1","BetaSheetPC1","CompositionPC1","HydrophobicityPC1","OtherPropertiesPC1","PhysicoChemicalPC1"];

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/mu8', function(err, db){

      if(err) throw err;

      var collection = db.collection('AAIndices');
      collection.find({$or: [{ 'accession': {$in: prinCompNames}}]}, { "description": 0,"_id":0,"category":0,"aaIndexIndex":0}).toArray(function(err, aaindices){

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

              //now get the 3d distances I need for the viz
              var pdbCollection = db.collection('PDB_ForID_' + computationId);
              pdbCollection.find({}).toArray(function(err, positions){
                    var pdbDistancesToSendback = helpers.computeDistances(positions);
                    finalResultsToSendBack.push(residueScoresToSendBack,stdDevToSendBack,pdbDistancesToSendback);
                    
                    	//this is the file for the final results needed
                    	var finalResultFile  = finalComputationToFile(finalResultsToSendBack)
                        fileSystem.writeFile('processedFiles/'+'finalResults_'+computationId+'.js', finalResultFile, function (res,err) {
                          		
                          		if (err) throw err;
                          		console.log('processedPDBFiles/'+'finalResults_'+computationId+'.js');

                          		var compCollection = db.collection('computations');

                                console.log("now updating compCollection....");
                                compCollection.findOne({'_id':new BSON.ObjectID(computationId)},  function(err, item) {
                                   
                                      console.log('computation id: '+computationId);
                                      console.log('the new document is: '+item.computationName);
                                      var computationObject = {  userThatCreatedMe: item.userThatCreatedMe,
                                         computationName: item.computationName,
                                         isPublic: item.isPublic,
                                         description: item.description,
                                         status: "Ready"
                                      };
 
                                      compCollection.update({'_id':new BSON.ObjectID(computationId)}, computationObject, {safe:true}, function(err, res) {
                                        if (err) {
                                            console.log('Error updating computationObject after insertion: ' + err);
                                          
                                        } else {
                                            console.log('Success in updating computationObject after insertion'+res);
                                        }
                                      });

                                });

                        });

              });
          });
      });
    });


}
 
module.exports = {    
    makeFilesForComputationID : makeFilesForComputationID,
    finalComputationToFile : finalComputationToFile
}