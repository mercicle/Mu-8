
function getColumnJ(col,scoredMSA){
  var getCol = [];
  for (var i = 0; i < scoredMSA.length; i++){
      getCol.push(scoredMSA[i][col]);
  }
  return getCol;
}

function dist(a,b){
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2));
}

function computeDistances(data){

	var seqLength4DM = data.length;

	var matrixRows = [];

	//data { "x" : 100.492599, "y" : 39.516201, "z" : 68.107803}

	for (var i = 0; i < seqLength4DM; i++) {

	    var thisRow = [];
	    for (var j = 0; j < seqLength4DM; j++) {
 				thisRow.push( [dist(data[i],data[j]),i] );
	    }

	    matrixRows.push(thisRow);
	}

	var histValueObjects = [];
	for (var row = 0; row < matrixRows.length; row++) {
	    for (var col = 0; col < matrixRows.length; col++) {
	        if (row < col) { //upper diagonal
	            histValueObjects.push({
	                dist: matrixRows[row][col][0],
	                thisRow: matrixRows[row][col][1]
	            });
	        }
	    }
	}
	return [matrixRows,histValueObjects];
}

 
module.exports = {    
    getColumnJ: getColumnJ,
    computeDistances : computeDistances
}
 
