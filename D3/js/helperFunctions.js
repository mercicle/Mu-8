/*
Copyright (c) 2013, Johnathan Mercer, Balaji Pandian, Nicolas Bonneel, Alexander Lex, Hanspeter Pfister

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of Harvard University nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


function mouseoverBar(e, aaNumber)
{
	
	var readableScoreText = "";
	
	for (var i = 0; i < 6; i++)
	{
		// compare the id of the selected element and compare it to the standard names
		if (e.id.substring(0, e.id.length-5) == namesOfDivIds[i].substring(1))
		{
			// result rounded to 3 decimal places
			readableScoreText = namesOfIndices[i] + ": " + Math.round(allIndices[i][aaNumber].myvar * 1000) / 1000 ;
		}
	}
	
	var container = d3.select("#zoomChartWrapper");
	var pos = $(container[0][0]).position(); //position of the zoomChartWrapper on the screen
    var mouse = d3.mouse(container[0][0]); //position relative to the zoomChartWrapper

    var infoBox = container.selectAll("div.uservisinfobox")
         .data([mouse]);

    var cushion = [10, 10]; 
    
    this._xoff = pos.left + e.x.animVal.value + zoom_seq_rect_width + 100;
    this._yoff = pos.top + e.y.animVal.value + 35;

    // adjust to make infobox closer to mouse on aligned layout
    if (zoomLayout == "Aligned")
    {
    	this._xoff += (zoom_seq_rect_width * 1);
    }
    	

    infoBox.enter()
        .append("div")
        .attr("class", "uservisinfobox")
        .attr("style", "top : " + this._yoff + "px; " + "left : " + this._xoff + "px; opacity : 0;")
        .html("<p>" + readableScoreText + "</p>");

    infoBox
        .html("<p>" + readableScoreText + "</p>")
        .transition().duration(500)
        .attr("style", "top : " + this._yoff + "px; " + "left : " + this._xoff + "px; opacity : 1;");
}

function mouseoutBar(e, aaNumber)
{
	var theInfoBox = d3.selectAll(".uservisinfobox").data([]);
    
    theInfoBox
         .exit()
         .transition().duration(300)
         .remove();

}

function mouseover (d, i,scTIM, textOrRect)
{
    //I only want to show the info box for residues that are different
    if (d==scTIM)
     return;

    var container = d3.select("#zoomChartWrapper");
    var pos = $(container[0][0]).position(); //position of the zoomChartWrapper on the screen
    var mouse = d3.mouse(container[0][0]); //position relative to the zoomChartWrapper

    var infoBox = container.selectAll("div.uservisinfobox")
         .data([mouse]);

    var cushion = [10, 10];

    // record the offset as part of the 'this' context, which in this 
    // case stands for the rect or text that initiated the mouseover event
    //if you want a lower right offset 
    //this._xoff = cushion[0]  + mouse[0] + pos.left;
    //this._yoff = cushion[1]  + mouse[1] + pos.top;

    var numSteps  =  Math.floor((mouse[0] - 20 ) / zoom_seq_rect_width);
    this._xoff = pos.left + 20 + numSteps*zoom_seq_rect_width ;

    this._yoff = zoom_seq_rect_height + zoom_positive_y_axis + pos.top;

    //the mouse will enter the rect first so transition slow in
    // and when it enters the text do it fast so they won't notice
    var thisDuration = 0;
    if (textOrRect == "text"){
        thisDuration = 500;
    }else{
        thisDuration = 1000;
    }

    infoBox.enter()
        .append("div")
        .attr("class", "uservisinfobox")
        .attr("style", "top : " + this._yoff + "px; " + "left : " + this._xoff + "px; opacity : 0;")
        .html("<p>scTIM: " + scTIM + "</p>");

    infoBox
        .html("<p>scTIM: " + scTIM + "</p>")
        .transition().duration(thisDuration)
        .attr("style", "top : " + this._yoff + "px; " + "left : " + this._xoff + "px; opacity : 1;");
}

function mouseout (d, i,scTIM,textOrRect)
{
    var thisDuration = 0;
    if (textOrRect == "text"){
        thisDuration = 0;
    }else{
        thisDuration = 500;
    }

    var theInfoBox = d3.selectAll(".uservisinfobox").data([]);
    
    theInfoBox
         .exit()
         .transition().duration(thisDuration)
         .remove();
            
}

//resize path function needed for the handles of the outlier histograms at the top
 function resize_path(d){
 
      var e = +(d == "e"),
        x = e ? -1 : 1,
        y = height / 3;

      var b = e ? 0 : 1;

      return "M" + (.5 * x) + "," + (y)
        + "A5,5 0 0 " + b + " " + (6.5 * x) + "," + (y + 6)
        + "V" + (2 * y - 6)
        + "A5,5 0 0 " + b + " " + (.5 * x) + "," + (2 * y)
        + "Z"
        + "M" + (2.5 * x) + "," + (y + 8)
        + "V" + (2 * y - 8)
        + "M" + (4.5 * x) + "," + (y + 8)
        + "V" + (2 * y - 8);
 
}

//the resize function you need for the handles for the distance histogram
 function resizePathDistHist(d){
 
      var e = +(d == "e"),
        x = e ? -1 : 1,
        y = heightDistHist / 3; 
   
      var b = e ? 0 : 1;

      return "M" + (.5 * x) + "," + (y)
        + "A5,5 0 0 " + b + " " + (6.5 * x) + "," + (y + 6)
        + "V" + (2 * y - 6)
        + "A5,5 0 0 " + b + " " + (.5 * x) + "," + (2 * y)
        + "Z"
        + "M" + (2.5 * x) + "," + (y + 8)
        + "V" + (2 * y - 8)
        + "M" + (4.5 * x) + "," + (y + 8)
        + "V" + (2 * y - 8);
 
}

var chordColor = d3.scale.linear().domain([0,1]).range([d3.rgb("lightgrey"), d3.rgb('darkgrey').darker(2)]);

//generates one chord
function genChord (aStart, aEnd, bStart, bEnd, distance, dMin, dMax, maxRange, arcNumber)
{
	// some quick formatting stuff. This makes sure that the following invariants are in place.
	// 1. b* > a*
	// 2. *End > *Start
	// where * is a wildcard
	if (aEnd > bStart)
	{
		var tempBStart = bStart;
		var tempBEnd = bEnd;
		
		bStart = aStart;
		bEnd = aEnd;
		
		aStart = tempBStart;
		aEnd = tempBEnd;
	}
	
	if (aEnd < aStart)
	{
		var temp = aStart;
		aStart = aEnd;
		aEnd = aStart;
	}
	
	if (bEnd < bStart)
	{
		var temp = bStart;
		bStart = bEnd;
		bEnd = bStart;
	}
	
	// Calculate colors
	var range = dMax - dMin;
	
	// Sat is [0,1]
	var sat = 1 - ((distance - dMin) / range);
		
	// calulate the radii for upper bound and lower bound of ellipse
	var higherRadius = (bEnd - aStart)/2;
	var lowerRadius = (bStart - aEnd)/2;
	
	// Calculate translation value
	var lowerTranslateX = (aEnd + bStart)/2;
	var upperTranslateX = (bEnd + aStart)/2;
	
	// Scale each arc to the maximum arc.
	var yScale = 2 * (arcContextHeight/(maxRange * 1.05));

	//var color = d3.scale.linear().domain([0,1]).range([d3.rgb("lightgrey"), d3.rgb('darkgrey').darker(2)]);

	if (Math.abs(aStart - aEnd) <= 1.0)
		return;
	if (Math.abs(bStart- bEnd) <= 1.0)
		return;
		
	// create a 'layer' for the masks
	var mask = seqArcContextSVG.append("defs")
	  .append("mask")
		.attr("id", "lowerClipLine" + arcNumber.toString())
		
	// add upper ellipse as transparent mask
	  mask.append("ellipse")
	  	.attr("cx", upperTranslateX)
		.attr("cy", arcContextHeight)
		.attr("rx", higherRadius)
		.attr("ry", higherRadius * yScale)
		.attr("fill", "white");
		
	// add lower ellipse as opaque mask
	  mask.append("ellipse")
		.attr("cx", lowerTranslateX)
		.attr("cy", arcContextHeight)
		.attr("rx", lowerRadius)
		.attr("ry", lowerRadius * yScale)
		.attr("fill", "black");
		
	// Finally, draw actual chord
	var upperEllipse = seqArcContextSVG.append("ellipse")
		.attr("mask", "url(#lowerClipLine" + arcNumber.toString()+")")
		.attr("cx", upperTranslateX)
		.attr("cy", arcContextHeight)
		.attr("rx", higherRadius)
		.attr("ry", higherRadius * yScale)
		.attr("fill", chordColor(sat));
	
}

// This function takes in an array or arrays that has arguements arranged in the following order:
// [[aStart, aEnd, bStart, bEnd, distance, distanceMin, distanceMax],[...],...]
//and renders the chords onto the svg seqArcContextSVG
function genChords(arr)
{
	//Clear all of the old SVG elements
	seqArcContextSVG.selectAll("defs").remove();
	seqArcContextSVG.selectAll("ellipse").remove();

	// Sort the arcs so that the furthest is on the bottom (in terms of Z-score)
	arr.sort(function(a,b) {return (a[4] - b[4]);});
	
	// First, calculate the largest difference in terms of amino acid numbers to find the maximum scale amount.
	var range = [];
	for (var bigArcCounter = 0; bigArcCounter < arr.length; bigArcCounter++)
	{
		// Grab max and min amio acid for each 'large' arc ( e.x. arc 20-25 to 100-110 would have max 110 and min 20)
		var maxDistance = (Math.max(arr[bigArcCounter][0], arr[bigArcCounter][1], arr[bigArcCounter][2], arr[bigArcCounter][3]));
		var minDistance = (Math.min(arr[bigArcCounter][0], arr[bigArcCounter][1], arr[bigArcCounter][2], arr[bigArcCounter][3]));
		
		range.push(maxDistance - minDistance);
	}
	
	// grab largest differece in amino acids from the array of arcs passed in
	var largestRange = Math.max.apply(null, range);
	
	// Draw each arc in array
	for (var bigArcCounter = 0; bigArcCounter < arr.length; bigArcCounter++)
	{	
		genChord (arr[bigArcCounter][0], arr[bigArcCounter][1], arr[bigArcCounter][2], arr[bigArcCounter][3], arr[bigArcCounter][4], arr[bigArcCounter][5], arr[bigArcCounter][6], largestRange, bigArcCounter);
	}
}

var allMinMaxArray = []; 
var allMinMaxDistArray = []; 
var finalDistArrayForChords = [];

//I need these global to update the color legend 
var maxChordDist = 0,
    minChordDist = 0;

// returns the array needed for the genChords:
// [[aStart, aEnd, bStart, bEnd, distance, distanceMin, distanceMax],[...],...]
// and the array returnHistValues needed for the distance histogram
function getHistAndArcData(lb, ub) {

    var returnHistValues = [];

    allMinMaxArray = [];
    allMinMaxDistArray = [];
    finalDistArrayForChords = [];

    //////////////////////////////////////////////////////////////////////////////
    /////  For each residue brushed, get the residues that are within ////////////
    /////  [brushDistHistExtent[0], brushDistHistExtent[1]] of it     ////////////
    //////////////////////////////////////////////////////////////////////////////
    if (Math.abs(ub-lb) < 1) { //changed from if (lb == ub) {
        //would really like a goto here to skip to the part where we wipe the dist histogram
    } else {
        var selectionIndex = (ub - lb);
        var selectionWidth = (ub - lb);

        for (var row = 0; row < matrixRows.length; row++) {

            //select this row (residue position) if it is within the sequence context brush extent
            if (row >= lb && row < ub) {

                ///////////////////////////////////////////////////////////////////////////////////////////
                /// Get all positions (and distances in Ang) for residues within brushDistHistExtent///////
                ///////////////////////////////////////////////////////////////////////////////////////////
                var thisDistArray = []; //holds the distances for this position that are within (brushDistHistExtent)
                var thisLinkArray = []; //holds the connections for this position that are within (brushDistHistExtent)
                for (var col = 0; col < matrixRows.length; col++) {

                    //only assess columns(i.e. positions) that are below the selection
                    // or columns (i.e. positions that are above the selection
                    if (col < lb || col >= ub) { 

                        //these are the values for the distance histogram
                        returnHistValues.push(matrixRows[row][col][0]);

                        //brushDistHistExtent[0] and brushDistHistExtent[1] is global extent of dist histogram brush
                        //if the brushDistHistExtent[0] <= dist <= brushDistHistExtent[1]
                        //and the residue is not a neighber (defined as 10 residues apart)
                        if ((matrixRows[row][col][0] >= brushDistHistExtent[0]) 
                             && (matrixRows[row][col][0] <= brushDistHistExtent[1]) 
                             && (Math.abs(col - row) > 10) //don't take the neighbors
                        ) {
                            thisLinkArray.push(col);
                            thisDistArray.push(matrixRows[row][col][0]);
                        }
                    }
                };

                //only continue if we found residues that meet the distance criteria
                if (thisDistArray.length == 0)
                    continue;

                //////////////////////////////////////////////////////////////////////////////
                /// Reduce thisLinkArray to an array of sections: thisLinkArraySections	//////
                //////////////////////////////////////////////////////////////////////////////
                var section = 0;
                var thisSection = [];
                var thisLinkArraySections = [];

                var thisDistSection = [];
                var thisDistArraySections = [];

                for (var i = 0; i < thisLinkArray.length; i++) {

                    if (thisSection.length == 0) {
                        thisSection.push(thisLinkArray[i]);
                        thisDistSection.push(thisDistArray[i]);
                        if (thisLinkArray.length == 1) {
                            thisLinkArraySections.push(thisSection);
                            thisDistArraySections.push(thisDistSection);
                        }
                    } else {

                        if (thisLinkArray[i] == (thisLinkArray[i - 1] + 1)) {
                            thisSection.push(thisLinkArray[i]);
                            thisDistSection.push(thisDistArray[i]);

                            if (i == thisLinkArray.length - 1) {
                                thisLinkArraySections.push(thisSection);
                                thisDistArraySections.push(thisDistSection);
                            }

                        } else {
                            thisLinkArraySections.push(thisSection);
                            thisDistArraySections.push(thisDistSection);
                            section += 1;
                            thisSection = [];
                            thisSection.push(thisLinkArray[i]);

                            thisDistSection = [];
                            thisDistSection.push(thisDistArray[i]);

                            if (i == thisLinkArray.length - 1) {
                                thisLinkArraySections.push(thisSection);
                                thisDistArraySections.push(thisDistSection);
                            }
                        }
                    }
                };

                ///////////////////////////////////////////////////////////////////////////////////////////
                /// Reduce thisLinkArraySections to an array of min/max's: thisMinMaxArray	////////////////  
                /// I will use thisMinMaxArray to test overlaps of arcs in consecutive residues ///////////
                //////////////////////////////////////////////////////////////////////////////////////////
                var thisMinMaxArray = [];
                //this is for the actual distances in angstrom
                var thisMinMaxDistArray = [];
                for (var i = 0; i < thisLinkArraySections.length; i++) {
                    var thisSectionMinMax = [d3.min(thisLinkArraySections[i]), d3.max(thisLinkArraySections[i])];
                    
                    //if the chord is a single residue then set the upper bound to upper bound + 1
                    //otherwise the start and end position will be the same 
                    if (thisSectionMinMax[0]==thisSectionMinMax[1]){
                        thisSectionMinMax[1]=thisSectionMinMax[0]+1;
                    }

                    thisMinMaxArray.push(thisSectionMinMax);
                    var thisDistSectionMinMax = [d3.min(thisDistArraySections[i]), d3.max(thisDistArraySections[i])];
                    thisMinMaxDistArray.push(thisDistSectionMinMax);
                };

                allMinMaxArray.push(thisMinMaxArray);  // just the min/max of each section                        
                allMinMaxDistArray.push(thisMinMaxDistArray); //the actual Ang distances
                selectionindex = selectionIndex - 1;
            }
        };
    }

    //////////////////////////////////////////////////////////////////////////////
    /////  Iterate through the allMinMaxArray and consolidate the       //////////
    /////  chords for consecutive residues                             ///////////
    //////////////////////////////////////////////////////////////////////////////

    //now consolidate and make the final array of connections
    var finalConnections = [];
    //for each position
    for (var i = 0; i < allMinMaxArray.length; i++) {

        //for each min/max in the array of values
        for (var j = 0; j < allMinMaxArray[i].length; j++) {

            // [aStart, aEnd, bStart, bEnd, minDistAng, maxDistAng
            var thisFinalConnection = [i + lb,
                i + lb + 1, //add one to the upper bound so the start and end position are not the same
                allMinMaxArray[i][j][0],
                allMinMaxArray[i][j][1],
                allMinMaxDistArray[i][j][0],
                allMinMaxDistArray[i][j][1]
            ];

            //for all positions after this position
            for (var k = i + 1; k < allMinMaxArray.length; k++) {

                //for all the min/max in the array of values (for this positiion that is after the position in the)
                var foundOverlap = false;

                for (var l = 0; l < allMinMaxArray[k].length; l++) {
                    //   ------        possible overlap 1
                    //      ------     prior section
                    //         ------- possible overlap 2
                    //        ---       possible overlap 3
                    if ((((thisFinalConnection[2] >= allMinMaxArray[k][l][0]) && (thisFinalConnection[2] <= allMinMaxArray[k][l][1])) ||
                        ((thisFinalConnection[3] >= allMinMaxArray[k][l][0]) && (thisFinalConnection[3] <= allMinMaxArray[k][l][1])) ||
                        ((thisFinalConnection[2] <= allMinMaxArray[k][l][0]) && (thisFinalConnection[3] >= allMinMaxArray[k][l][1])) ||
                        ((thisFinalConnection[2] >= allMinMaxArray[k][l][0]) && (thisFinalConnection[3] <= allMinMaxArray[k][l][1])))) {

                        foundOverlap = true;

                        //update this connection
                        thisFinalConnection[1] = lb + k; //aEnd
                        thisFinalConnection[2] = Math.min(thisFinalConnection[2], allMinMaxArray[k][l][0]); //bStart
                        thisFinalConnection[3] = Math.max(thisFinalConnection[3], allMinMaxArray[k][l][1]); //bEnd

                        thisFinalConnection[4] = Math.min(thisFinalConnection[4], allMinMaxDistArray[k][l][0]); //minDistAng
                        thisFinalConnection[5] = Math.max(thisFinalConnection[5], allMinMaxDistArray[k][l][1]); //minDistAng

                        //remove those two elements
                        allMinMaxArray[k].splice(l, 1);
                        allMinMaxDistArray[k].splice(l, 1);

                    } else {

                        if (l == allMinMaxArray[k].length - 1) {
                            foundOverlap = false;
                        }
                    }

                    if (foundOverlap)
                        break;
                };

                if (foundOverlap == false)
                    break;

            };

            //iterate through finalConnections and only add new connection if not covered 
            //by any of the final connections; we need this because a chain of interections could ultimately overlap a chord 
            //that was not included because it's position at the time

            var connectionCovered = false;
            for (var f = 0; f < finalConnections.length; f++) {
                if ((thisFinalConnection[0] >= finalConnections[f][0]) &&
                    (thisFinalConnection[1] <= finalConnections[f][1]) &&
                    (thisFinalConnection[2] >= finalConnections[f][2]) &&
                    (thisFinalConnection[3] <= finalConnections[f][3])) {
                    connectionCovered = true;
                    break;
                }
            };

            if (connectionCovered == false) {
                finalConnections.push(thisFinalConnection);
            }

            //finalConnections.push(thisFinalConnection);
            allMinMaxArray[i].splice(j, 1); //remove this element from the array
            allMinMaxDistArray[i].splice(j, 1); ///remove this element from the Dist array
            j = j - 1;
        }; //end for loop of j min/max element of position i
    }; //end for loop of i (position)

    //////////////////////////////////////////////////////////////////////////////
    /////  Create the final arrays needed for the genChords                /////////
    /////  						                                        //////////
    //////////////////////////////////////////////////////////////////////////////

    var x = d3.scale.linear()
        .domain([0, 248])
        .range([0, seq_svg_width]);

    finalDistArrayForChords = [];
    for (var i = 0; i < finalConnections.length; i++) {
        var thisMean = d3.mean([finalConnections[i][4], finalConnections[i][5]]);
        var thisFinalAverage = [x(finalConnections[i][0]),
            x(finalConnections[i][1]),
            x(finalConnections[i][2]),
            x(finalConnections[i][3]),
            thisMean, 0, 0
        ];
        finalDistArrayForChords.push(thisFinalAverage);
    };

    //optimized max from an array of arrays found here:
    //http://stackoverflow.com/questions/11149843/get-largest-value-in-multi-dimensional-array-javascript-or-coffeescript
    maxChordDist = finalDistArrayForChords.reduce(function (max, arr) {
        return max >= arr[4] ? max : arr[4];
    }, -Infinity);
    minChordDist = finalDistArrayForChords.reduce(function (min, arr) {
        return min <= arr[4] ? min : arr[4];
    }, +Infinity);

    for (var i = 0; i < finalDistArrayForChords.length; i++) {
        finalDistArrayForChords[i][5] = minChordDist;
        finalDistArrayForChords[i][6] = maxChordDist;
    };

    return [returnHistValues, finalDistArrayForChords];

}

/////////////////////////////////////////////////////////////
//////////     Update the Histogram       ///////////////////
/////////////////////////////////////////////////////////////

function drawDistHistogram (returnHistValues)
{

	numBinsDistHist = 20; 
	 
	xDistHist = d3.scale.linear()
	    .domain(xExtentDistHist) 
	    .range([0, widthDistHist]);

	xAxisDistHist = d3.svg.axis()
	    .scale(xDistHist)
	    .orient("bottom")
	    .ticks(10);
	 
	distHistData = d3.layout.histogram()
	         .frequency(false)
	         .bins(xDistHist.ticks(numBinsDistHist))
	         (returnHistValues.map(function(d) { return d; }));
     
	yDistHist = d3.scale.linear()
	    .domain([0, d3.max(distHistData, function(d) { return d.y; })]) 
	    .range([heightDistHist, 0]);

	//display y-axis as %
	formatPercent = d3.format(".0%");
	yAxisDistHist = d3.svg.axis()
	          .scale(yDistHist)
	          .orient("left")
	          .tickFormat(formatPercent)
	          .ticks(5);

	// specify the brush function
	brushDistHist = d3.svg.brush()
	    .x(xDistHist)
	    .on("brush", histDistBrushMove);

	//append the svg and set its width and height
	distHistSVG = d3.select("svg.distHistClass");

	distHistSVGOffset = distHistSVG.select("g") //the container group that has the translation for axes

	distHistSVGOffset.selectAll("g.distHistBar")
	    .data([]).exit().remove();

	barDistHist = distHistSVGOffset.selectAll("distHistBar")
	    .data(distHistData)
	    .enter()
	    .append("g")
	    .attr("class", "distHistBar") 
	    .attr("transform", function(d) { return "translate(" + xDistHist(d.x) + "," + yDistHist(d.y) + ")"; })
	    .call(brushDistHist);

	//for each bar, append a rectangle
	barDistHist.append("rect")
	    .attr("x", 0) 
	    .attr("width", xDistHist(distHistData[0].x + distHistData[0].dx)  - xDistHist(distHistData[0].x)-1)
	    .attr("id", "histrect" )
	    .attr("fill", "#ccc")
	    .attr("height", function(d) { return heightDistHist - yDistHist(d.y); });


	distHistSVGOffset.select("g.brushContainer")
					.data([]).exit().remove();


	var contextDistHist = distHistSVGOffset.append("g").attr("class","brushContainer");

	contextDistHist.append("g")
	    .attr("class", "x brush")
	    .call(brushDistHist)
	  		.selectAll("rect")
	    		.attr("height", heightDistHist);

	contextDistHist.selectAll("rect").attr("height", heightDistHist);
	contextDistHist.selectAll(".resize").append("path").attr("d", resizePathDistHist);

    brushDistHist.extent(brushDistHistExtent);
    distHistSVG.select(".brush").call(brushDistHist);

    //wipe the brush if they don't have a region seelcted on the sequenceContext
    if (eNow[0] == eNow[1]){
		    brushDistHist.extent([0,0]);
		    distHistSVG.select(".brush").call(brushDistHist);
		    reColorHistDistBrush();
    }else{
		    brushDistHist.extent(brushDistHistExtent);
		    distHistSVG.select(".brush").call(brushDistHist);
		    reColorHistDistBrush();
	}

}