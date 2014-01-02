
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

// current version (0.2.x) of node-csv-parser
//http://www.adaltas.com/projects/node-csv/parser.html
//var csv = require('csv');

exports.checkNetworkName = function(req, res){

	console.log("inside networks.checkNetworkName");

	var networkName = req.params.netname;

	mongoDB.collection('networks', function(err,collection){
		collection.findOne({'networkName':networkName}, function(error, item){

			if(error){
				console.log("Error in networks.checkNetworkName");
			}

			if(item){
				res.end("unavailable");
			}else{
				res.end("ok");
			}

		})
	});
};

exports.findByNetworkId = function(req,res){

		var networkID = req.params.id;
        console.log('Inside networks.findByNetworkId and getting id: ' + networkID);
		mongoDB.collection('networks', function(err, collection){
			collection.findOne({"_id" : BSON.ObjectID(networkID)}, function(err, item){
				res.send(item);
                console.log('Success networks.findByNetworkId and getting id: ' + item);
			});
		});
};

exports.findByUser = function(req, res) {

    var user = req.params.user;
    
    mongoDB.collection('networks', function(err, collection) {
        //this is where I add in the condition that InWeb3 is also selected
        //$or: [{userThatCreatedMe: user},{ networkname: 'InWeb3' }]}
        //collection.find({userThatCreatedMe: user}).toArray(function(err, nets) { 
        collection.find({$or: [{userThatCreatedMe: user},{ networkName: "InWeb3" }]}).toArray(function(err, nets) {
            res.send(nets);
        });
    });
};

exports.addNetwork = function(req,res){

	//holds the form details
	var body = req.body;

	console.log('Request.files: ');
    console.log(req.files);

    //synchronous version of rename
    fileSystem.renameSync(req.files.edgeCSV.path, 'uploads/edgeFile', function(err){
    	if(err){
    		fileSystem.unlink(req.files.edgeCSV.path, function(){});
    		console.log('Error occurred during fileSystem.rename of networks.addNetwork');
    		throw error;
    	}else{
    		console.log('Successfully renamed the edge file at the start of networks.addNetwork');
    	}
    });

    var networkObject = {  userThatCreatedMe: body.userThatCreatedMe,
    					   networkName: body.networkName,
           				   isPublic: body.isPublic,
            			   description: body.description 
    					};
    mongoDB.collection('networks', function(err, collection){
    	collection.insert(networkObject, function(err, insertedNetwork){

    		    if (err) {
                	res.send(404, "Error in networks.addNetwork during collection.insert(networkObject,");
            	}else{

            		console.log('Successfully inserted network: ' + JSON.stringify(insertedNetwork));
            		console.log('Now moving on to insert edges from the csv file...');

                    csvParser.mapFile('uploads/edgeFile', function(err, edges){
                            if (err) throw err;
                            
                            var edgeCollectionId = "NetworkEdges_ForID_" + insertedNetwork[0]._id;
                            
                            for (e in edges) {
                                edges[e].score = parseFloat(edges[e].score);
                                //console.log("Parsing Float for: "+ e);
                            }
                            
                            mongoDB.collection(edgeCollectionId, function(err, collection) {
                                collection.insert(edges, {safe: true}, function(err, insertedEdges) {
                                    if (err) {
                                        res.send(404, "Error in creating a edge collection");
                                    }
                                    else {
                                        console.log('Successfully created the edge collection');
                                        res.send(200);
                                    }
                                });
                            });
                        });
            	}
    	});
    });

}

exports.deleteNetwork = function(req, res) {

    var id = req.params.id;
    
    //drop the edge collection
    var edgeCollectionId = "NetworkEdges_ForID_" + id;
    mongoDB.collection(edgeCollectionId, function(err, collection) {
        collection.drop();
    });
    
    //now drop the network metadata
    mongoDB.collection('networks', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' deleted');
                res.send(req.body);
            }
        });
    });
}

exports.updateNetwork = function(req, res) {

    var id = req.params.id;
    var network = req.body;
    
    console.log('Updating network: ' + id);
    console.log(JSON.stringify(network));

    delete network._id;
    delete network.edgeCSV;

    mongoDB.collection('networks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, network, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating network: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success in updating network with result ' + result);
                res.send(network);
            }
        });
    });
}







