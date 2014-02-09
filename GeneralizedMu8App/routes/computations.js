
//http://nodejs.org/api/path.html#path_path
//This module contains utilities for handling and transforming file paths. 
var path = require('path');

//http://nodejs.org/api/fs.html#fs_file_system
//File I/O is provided by simple wrappers around standard POSIX functions. 
var fileSystem = require('fs');

//http://nodejs.org/api/util.html
var utililites = require('util');

var mongo = require('../config/mongo'); //mongo

var mongoDB = mongo.db; //mongodb

var BSON = mongo.BSON;

//https://github.com/wdavidw/node-csv
//http://www.adaltas.com/projects/node-csv/
var csvParser = require('node-csv').createParser();

var csv = require('csv');
var async = require('async');


var cronJob = require('cron').CronJob;
var spawn = require('child_process').spawn;

var pdbFunc = require('../serversideJS/pdbFunctions.js');
var helpers = require('../serversideJS/helperFunctions.js');
var makeMain = require('../serversideJS/makeMainFile.js');

// current version (0.2.x) of node-csv-parser
//http://www.adaltas.com/projects/node-csv/parser.html
//var csv = require('csv');

exports.checkComputationName = function(req, res){

	console.log("inside computations.checkComputationName");

	var computationName = req.params.netname;

	mongoDB.collection('computations', function(err,collection){
		collection.findOne({'computationName':computationName}, function(error, item){

			if(error){
				console.log("Error in computations.checkComputationName");
			}

			if(item){
				res.end("unavailable");
			}else{
				res.end("ok");
			}

		})
	});
};

exports.findByComputationId = function(req,res){

	var computationID = req.params.id;
    console.log('Inside computations.findByComputationId and getting id: ' + computationID);
	mongoDB.collection('computations', function(err, collection){
		collection.findOne({"_id" : BSON.ObjectID(computationID)}, function(err, item){
			res.send(item);
            console.log('Success computations.findByComputationId');
		});
	});
};

exports.findByUser = function(req, res) {

    var user = req.params.user;
    
    mongoDB.collection('computations', function(err, collection) {
        collection.find({userThatCreatedMe: user}).toArray(function(err, nets) {
            res.send(nets);
        });
    });

}

/*  
exports.addComputation = function(req,res){

	//holds the form details
	var body = req.body;

	console.log('body: ');
    console.log(body);

    var pdbFilePath = req.files.pdbFile.path;
    var msaFilePath = req.files.msaFile.path;

    console.log('pdbFilePath'+pdbFilePath);
    console.log('msaFilePath'+msaFilePath);

    //synchronous version of rename
    fileSystem.renameSync(msaFilePath, 'uploads/msaFile', function(err){
        if(err){
            fileSystem.unlink(msaFilePath, function(){});
            console.log('Error occurred during fileSystem.rename of addComputation');
            throw error;
        }else{
            console.log('Successfully renamed the msa file');
        }
    });

    fileSystem.renameSync(pdbFilePath, 'uploads/pdbFile', function(err){
        if(err){
            fileSystem.unlink(pdbFilePath, function(){});
            console.log('Error occurred during fileSystem.rename of addComputation');
            throw error;
        }else{
            console.log('Successfully renamed the pdb file');
        }
    });

    var computationObject = {  userThatCreatedMe: body.userThatCreatedMe,
    					       computationName: body.computationName,
           				       isPublic: body.isPublic,
            			       description: body.description,
                               status: "Available"
    					    };

    console.log('computationObject: ');
    console.log(computationObject);

    mongoDB.collection('computations', function(err, collection){
        collection.insert(computationObject, function(err, insertedComputation){

                if (err) {
                    res.send(404, "Error in computations during collection.insert ");
                }else{

                    console.log('Successfully inserted computation: ' + JSON.stringify(insertedComputation));
                    console.log('Now moving on to insert msa from the csv file...');

                    csvParser.mapFile('uploads/msaFile', function(err, sequences){
                            if (err) throw err;
                            
                            var msaCollectionId = "MSA_ForID_" + insertedComputation[0]._id;
                            
                            mongoDB.collection(msaCollectionId, function(err, collection) {
                                collection.insert(sequences, {safe: true}, function(err, insertedSequences) {
                                    
                                    if (err) {
                                        res.send(404, "Error in creating a msa collection");
                                    }
                                    else {

                                        console.log('Successfully created the msa collection');
                                        
                                        csvParser.mapFile('uploads/pdbFile', function(err, positions){

                                                if (err) throw err;
                                                
                                                var pdbCollectionId = "PDB_ForID_" + insertedComputation[0]._id;

                                                for (ip in positions) {
                                                    positions[ip].x = parseFloat(positions[ip].x);
                                                    positions[ip].y = parseFloat(positions[ip].y);
                                                    positions[ip].z = parseFloat(positions[ip].z);
                                                }

                                                mongoDB.collection(pdbCollectionId, function(err, collection) {

                                                    collection.insert(positions, {safe: true}, function(err, insertedPositions) {

                                                        if (err) {
                                                            res.send(404, "Error in creating a pdb collection");
                                                        }
                                                        else {
                                                            console.log('Successfully created the pdb collection');
                                                            res.send(200);
                                                        }
                                                    });
                                                });
                                            });
                                    }
                                });
                            });
                        });
                }
        });
    });
}
*/

/*
exports.addComputation = function(req,res){

    //holds the form details
    var body = req.body;

    //console.log('body: ');
    //console.log(body);

    var pdbFilePath = req.files.pdbFile.path;
    var msaFilePath = req.files.msaFile.path;

    //console.log('pdbFilePath'+pdbFilePath);
    //console.log('msaFilePath'+msaFilePath);

    //synchronous version of rename
    fileSystem.renameSync(msaFilePath, 'uploads/msaFile', function(err){
        if(err){
            fileSystem.unlink(msaFilePath, function(){});
            console.log('Error occurred during fileSystem.rename of addComputation');
            throw error;
        }else{
            console.log('Successfully renamed the msa file');
        }
    });

    var computationObject = {  userThatCreatedMe: body.userThatCreatedMe,
                               computationName: body.computationName,
                               isPublic: body.isPublic,
                               description: body.description,
                               status: "Uploading"
                            };

    //console.log('computationObject: ');
    //console.log(computationObject);

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/mu8', function(err, db){

        if(err) throw err;

        var collection = db.collection('computations');
    //mongoDB.collection('computations', function(err, collection){
        collection.insert(computationObject, function(err, insertedComputation){

                if (err){
                    res.send(404, "Error in computations during collection.insert ");
                }else{

                    //console.log('Successfully inserted computation: ' + JSON.stringify(insertedComputation));
                    //console.log('Now moving on to insert msa from the csv file...');

                    var computationID  = insertedComputation[0]._id + '';

                    //var scriptPath = __dirname + "/../IBAS/RMDB_IBASFast.r";
                    fileSystem.renameSync(pdbFilePath, 'uploads/pdbFile_'+computationID, function(err){
                        if(err){
                            fileSystem.unlink(pdbFilePath, function(){});
                            console.log('Error occurred during fileSystem.rename of addComputation');
                            throw error;
                        }else{
                            console.log('Successfully renamed the pdb file');
                        }
                    });

                    //read the original pdb file and 
                    fileSystem.readFile('uploads/pdbFile_' + computationID, function (err, data) {

                        if (err) throw err;
                        //console.log("Read Saved PDB OK...");
 
                        var nicolasPDBFile = pdbFunc.pdbToAtomFile(data);
                        var johnPDBFile = pdbFunc.pdbToXYZFile(data);
                        var linesJS = pdbFunc.generateLinesFile(nicolasPDBFile);

                        //console.log("Done computing nicolasPDBFile - johnPDBFile - linesJS");
                        //save the file lines file after creating it
                        fileSystem.writeFile('processedPDBFiles/'+'lines_'+computationID+'.js', linesJS, function (err) {
                          if (err) throw err;
                          //console.log('processedPDBFiles/'+'lines_'+computationID+'.js');
                        });

                        //console.log('AFTER writing '+ 'processedPDBFiles/'+'lines_'+computationID+'.js');
                        //save the 3d coordinates lines file after creating it
                        fileSystem.writeFile('processedPDBFiles/'+'johnPDB_' + computationID, johnPDBFile, function (err) {
                            
                            if (err) throw err;
                            //console.log('AFTER '+ 'processedPDBFiles/'+'johnPDB_' + computationID + ' saved!');

                            csvParser.mapFile('processedPDBFiles/'+'johnPDB_' + computationID, function(err, positions){

                                    if (err) throw err;
                                    
                                    var pdbCollectionId = "PDB_ForID_" + insertedComputation[0]._id;

                                    for (ip in positions) {
                                        positions[ip].x = parseFloat(positions[ip].x);
                                        positions[ip].y = parseFloat(positions[ip].y);
                                        positions[ip].z = parseFloat(positions[ip].z);
                                    }

                                    mongoDB.collection(pdbCollectionId, function(err, pdbcollection) {

                                        pdbcollection.insert(positions, {safe: true}, function(err, insertedPositions) {

                                            if (err) {
                                                res.send(404, "Error in creating a pdb collection");
                                            }
                                            else {
                                                console.log('Successfully created the pdb collection');
                                                res.send(200);
                                            }
                                        });
                                    });
                            });
                        });

                    });

                    var msaCollectionId = "MSA_ForID_" + computationID;
                    console.log("final msa collection: " + msaCollectionId);

                    var msaCollection = db.collection(msaCollectionId);

                    var q = async.queue(msaCollection.insert.bind(msaCollection), 10);
                    
                    csv()
                    .from.path('uploads/msaFile', {columns: true}) 
                    .transform(function(data, index, cb){

                            q.push(data, function (err, res) {
                                if (err) return cb(err);
                                cb(null, res[0]);
                            });

                    })
                    .on('end', function () {
                         
                        console.log('on.end() executed');
                        q.drain = function() {

                                //res.send(200);
                                
                                computationObject.status = "Ready";
                                console.log("the updated computationObject object is:");
                                console.log(computationObject);
                                console.log("now updating...");
                                collection.update({'_id':new BSON.ObjectID(computationID)}, computationObject, {safe:true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating computationObject after insertion: ' + err);
                                        res.send({'error':'An error has occurred'});
                                    } else {
                                        console.log('Success in updating computationObject after insertion');
                                        res.send(200);
                                    }
                                });
                        };

                    })
                    .on('error', function (err) {
                        res.end(500, err.message);
                        console.log('on.error() executed');
                    });

                    res.send(200);

                }//else
        });
    });
}
**/

exports.addComputation = function(req,res){

    //holds the form details
    var body = req.body;

    //console.log('body: ');
    //console.log(body);

    var pdbFilePath = req.files.pdbFile.path;
    var msaFilePath = req.files.msaFile.path;

    //console.log('pdbFilePath'+pdbFilePath);
    //console.log('msaFilePath'+msaFilePath);

    //synchronous version of rename
    fileSystem.renameSync(msaFilePath, 'uploads/msaFile', function(err){
        if(err){
            fileSystem.unlink(msaFilePath, function(){});
            console.log('Error occurred during fileSystem.rename of addComputation');
            throw error;
        }else{
            console.log('Successfully renamed the msa file');
        }
    });

    var computationObject = {  userThatCreatedMe: body.userThatCreatedMe,
                               computationName: body.computationName,
                               isPublic: body.isPublic,
                               description: body.description,
                               status: "Uploading"
                            };

    //console.log('computationObject: ');
    //console.log(computationObject);

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/mu8', function(err, db){

        if(err) throw err;

        var collection = db.collection('computations');
    //mongoDB.collection('computations', function(err, collection){
        collection.insert(computationObject, function(err, insertedComputation){

                if (err){
                    res.send(404, "Error in computations during collection.insert ");
                }else{

                    //console.log('Successfully inserted computation: ' + JSON.stringify(insertedComputation));
                    //console.log('Now moving on to insert msa from the csv file...');

                    var computationID  = insertedComputation[0]._id + '';

                    //var scriptPath = __dirname + "/../IBAS/RMDB_IBASFast.r";
                    fileSystem.renameSync(pdbFilePath, 'uploads/pdbFile_'+computationID, function(err){
                        if(err){
                            fileSystem.unlink(pdbFilePath, function(){});
                            console.log('Error occurred during fileSystem.rename of addComputation');
                            throw error;
                        }else{
                            console.log('Successfully renamed the pdb file');
                        }
                    });

                    //read the original pdb file and 
                    fileSystem.readFile('uploads/pdbFile_' + computationID, function (err, data) {

                        if (err) throw err;
                        //console.log("Read Saved PDB OK...");
 
                        var nicolasPDBFile = pdbFunc.pdbToAtomFile(data);
                        var johnPDBFile = pdbFunc.pdbToXYZFile(data);
                        
                        //var linesJS = pdbFunc.generateLinesFile(nicolasPDBFile);

                        var javascriptFiles = pdbFunc.generateLinesFile(nicolasPDBFile);
                        var colorsAndVerticesFile = javascriptFiles[0];
                        var initBuffersFile = javascriptFiles[1];

                        //console.log("Done computing nicolasPDBFile - johnPDBFile - linesJS");
                        //save the file lines file after creating it
                        fileSystem.writeFile('processedPDBFiles/'+'colorsAndVerticesFile_'+computationID+'.js', colorsAndVerticesFile, function (err) {
                          if (err) throw err;
                          //console.log('processedPDBFiles/'+'lines_'+computationID+'.js');
                        });

                        fileSystem.writeFile('processedPDBFiles/'+'initBuffersFile_'+computationID+'.js', initBuffersFile, function (err) {
                          if (err) throw err;
                          //console.log('processedPDBFiles/'+'lines_'+computationID+'.js');
                        });

                        //console.log('AFTER writing '+ 'processedPDBFiles/'+'lines_'+computationID+'.js');
                        //save the 3d coordinates lines file after creating it
                        fileSystem.writeFile('processedPDBFiles/'+'johnPDB_' + computationID, johnPDBFile, function (err) {
                            
                            if (err) throw err;
                            //console.log('AFTER '+ 'processedPDBFiles/'+'johnPDB_' + computationID + ' saved!');

                            csvParser.mapFile('processedPDBFiles/'+'johnPDB_' + computationID, function(err, positions){

                                    if (err) throw err;
                                    
                                    var pdbCollectionId = "PDB_ForID_" + insertedComputation[0]._id;

                                    for (ip in positions) {
                                        positions[ip].x = parseFloat(positions[ip].x);
                                        positions[ip].y = parseFloat(positions[ip].y);
                                        positions[ip].z = parseFloat(positions[ip].z);
                                    }

                                    mongoDB.collection(pdbCollectionId, function(err, pdbcollection) {

                                        pdbcollection.insert(positions, {safe: true}, function(err, insertedPositions) {

                                            if (err) {
                                                res.send(404, "Error in creating a pdb collection");
                                            }
                                            else {
                                                console.log('Successfully created the pdb collection');
                                                res.send(200);
                                            }
                                        });
                                    });
                            });
                        });

                    });

                    var msaCollectionId = "MSA_ForID_" + computationID;
                    console.log("final msa collection: " + msaCollectionId);

                    var msaCollection = db.collection(msaCollectionId);

                    var q = async.queue(msaCollection.insert.bind(msaCollection), 10);
                    
                    csv()
                    .from.path('uploads/msaFile', {columns: true}) 
                    .transform(function(data, index, cb){

                            q.push(data, function (err, res) {
                                if (err) return cb(err);
                                cb(null, res[0]);
                            });

                    })
                    .on('end', function () {
                         
                        console.log('on.end() executed');
                        q.drain = function() {

                                //res.send(200);
                                
                                //compute the files needed here
                                makeMain.makeFilesForComputationID(computationID);
                                res.send(200);


                        };

                    })
                    .on('error', function (err) {
                        res.end(500, err.message);
                        console.log('on.error() executed');
                    });

                    res.send(200);

                }//else
        });
    });
}
exports.deleteComputation = function(req, res) {

    var id = req.params.id;
    
    //drop the edge collection
    var msaResultCollectionId = "MSA_ForID_" + id;
    mongoDB.collection(msaResultCollectionId, function(err, collection) {
        collection.drop();
    });

    //now drop the computation metadata
    mongoDB.collection('computations', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' deleted');
                res.send(req.body);
            }
        });
    });
}
