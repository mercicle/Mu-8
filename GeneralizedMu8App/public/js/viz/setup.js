
function prepareData(){

		//AlphaHelixPC1
		//BetaSheetPC1
		//CompositionPC1
		//HydrophobicityPC1
		//OtherPropertiesPC1
		//PhysicoChemicalPC1

		//set the default sequence
		defaultIndexData[0][0].forEach(function(x){return refSeq.push(x[0])});
 
	    stdAlpha = defaultIndexData[1][0].map(function(d){return d[1]});
	    stdBeta = defaultIndexData[1][1].map(function(d){return d[1]});
	    stdComp = defaultIndexData[1][2].map(function(d){return d[1]});
	    stdHydro = defaultIndexData[1][3].map(function(d){return d[1]});
	    stdPhy = defaultIndexData[1][4].map(function(d){return d[1]});
	    stdOth = defaultIndexData[1][5].map(function(d){return d[1]});
	    
	    for (var i = 0; i < seqLength; i++) {
	    
	    if (defaultIndexData[0][0][i][1] > 3 || defaultIndexData[0][0][i][1] < -3) {
	        if (defaultIndexData[0][0][i][1] > 3) {
	            a = 3;
	        } else {
	            a = -3;
	        }
	    } else {
	        a = defaultIndexData[0][0][i][1];
	    }
	    
	    if (defaultIndexData[0][1][i][1] > 3 || defaultIndexData[0][1][i][1]< -3) {
	        if (defaultIndexData[0][1][i][1]> 3) {
	            b = 3;
	        } else {
	            b = -3;
	        }
	    } else {
	        b = defaultIndexData[0][1][i][1];
	    }
	    
	    if (defaultIndexData[0][2][i][1] > 3 || defaultIndexData[0][2][i][1] < -3) {
	        if (defaultIndexData[0][2][i] > 3) {
	            c = 3;
	        } else {
	            c = -3;
	        }
	    } else {
	        c = defaultIndexData[0][2][i][1];
	    }
	    if (defaultIndexData[0][3][i][1] > 3 || defaultIndexData[0][3][i][1] < -3) {
	        if (defaultIndexData[0][3][i][1] > 3) {
	            h = 3;
	        } else {
	            h = -3;
	        }
	    } else {
	        h = defaultIndexData[0][3][i][1];
	    }
	    if (defaultIndexData[0][4][i][1] > 3 || defaultIndexData[0][4][i][1] < -3) {
	        if (defaultIndexData[0][4][i][1] > 3) {
	            p = 3;
	        } else {
	            p = -3;
	        }
	    } else {
	        p = defaultIndexData[0][4][i][1];
	    }
	    if (defaultIndexData[0][5][i][1] > 3 || defaultIndexData[0][5][i][1] < -3) {
	        if (defaultIndexData[0][5][i][1]  > 3) {
	            o = 3;
	        } else {
	            o = -3;
	        }
	    } else {
	        o = defaultIndexData[0][5][i][1] ;
	    }
	    
	    cumMinNegX.push(a * (a < 0) + b * (b < 0) + c * (c < 0) + h * (h < 0) + p * (p < 0) + o * (o < 0));
	    cumMaxPosX.push(a * (a > 0) + b * (b > 0) + c * (c > 0) + h * (h > 0) + p * (p > 0) + o * (o > 0));
	    
	    alphaValues.push({
	        myvar: a
	    });
	    betaValues.push({
	        myvar: b
	    });
	    compValues.push({
	        myvar: c
	    });
	    hydroValues.push({
	        myvar: h
	    });
	    physicoValues.push({
	        myvar: p
	    });
	    otherValues.push({
	        myvar: o
	    });
	}

	allStdDeviations = [stdAlpha,stdBeta,stdComp,stdHydro,stdPhy,stdOth];

	globalCumMinNegX = d3.min(cumMinNegX);
	globalCumMaxPosX = d3.max(cumMaxPosX);

	// Variables for iteration (Each one is an array corresponding to a specific index)
	allIndices = [alphaValues, betaValues, compValues, hydroValues, physicoValues, otherValues];

	//replace this with a allIndexData[index]
	alphaData = alphaValues.map(function(d) {
	    return d.myvar;
	});
	betaData = betaValues.map(function(d) {
	    return d.myvar;
	});
	compData = compValues.map(function(d) {
	    return d.myvar;
	});
	hydroData = hydroValues.map(function(d) {
	    return d.myvar;
	});
	physicoData = physicoValues.map(function(d) {
	    return d.myvar;
	});
	otherData = otherValues.map(function(d) {
	    return d.myvar;
	});

	allIndexData = [alphaData, betaData, compData, hydroData, physicoData, otherData];

	posNegIndices = [];
	globalIsBrushedArray = [];

	//create array of arrays that hold the pos/neg indices at each residue
	for (var i = 0; i < seqLength; i++) {
	    var posArray = [];
	    var negArray = [];
	    for (var d = 0; d < allIndexData.length; d++) {
	        if (allIndexData[d][i] > 0) {
	            posArray.push(d);
	        } else {
	           negArray.push(d);
	        }
	    }

	    //create empty 'is brushed' arrays for each set of pos/neg scores
	    var gipb = [];
	    for (var p = 0; p < posArray.length; p++) {
	        gipb.push(0);
	    }
	    var ginb = [];
	    for (var p = 0; p < negArray.length; p++) {
	        ginb.push(0);
	    }

	    globalIsBrushedArray.push([gipb, ginb]);
	    posNegIndices.push([posArray, negArray]);

	}
	 
	//for the distance histogram
	rawHistValues = defaultIndexData[2][1].map(function(d) {
	    return d.dist;
	});

//defaultIndexData[2][0] is used for dist hist and chords
//refSeq
//rawHistValues
//globalIsBrushedArray
//posNegIndices
//allIndexData
//allStdDeviations
//allIndices
}

function setupVisualization(){

    /////////////////////////////////////////////////////////////////
    // Global Y max and global min/max x extents for histograms   ///
    /////////////////////////////////////////////////////////////////
;
    for (var i = 0; i < allIndices.length; i++) {
    
        var x_extent = d3.extent(allIndices[i].map(function(d){
            return d.myvar;
        }));

        // i use the ceiling and floor functions to get integer min/max for the x pixel space
        x_extent[0] = Math.floor(x_extent[0]);
        x_extent[1] = Math.ceil(x_extent[1]);
    
        x_extent_array.push(x_extent);
    
        if (x_extent_array[i][1] > max_x_extent) {
            max_x_extent = x_extent_array[i][1];
        }
        if (x_extent_array[i][0] < min_x_extent) {
            min_x_extent = x_extent_array[i][0];
        }
    
        // # of bins for histogram (sqrt(n))
        var num_bins = Math.round(Math.sqrt(seqLength));
    
        // this is the transformation function for input space to pixel space
        var x = d3.scale
                  .linear()
                  .domain(x_extent)
                  .range([0, width]);
    
        var data = d3.layout
                     .histogram()
                     .frequency(false)
                     .bins(x.ticks(num_bins))(allIndices[i].map(function(d) {
                         return d.myvar;
                     }));
    
        histDataArray.push(data);
    
        var localYMax = d3.max(data, function(d) {
            return d.y;
        });
    
        //update the globalYMax
        if (localYMax > globalYMax) {
            globalYMax = localYMax;
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////       Insert the Histograms   //////////////////////////////// 
    //////////////////////////////////////////////////////////////////////////////////////////////
 
    for (var i = 0; i < allIndices.length; i++) {
    
        // # of bins for histogram
        var num_bins = Math.round(Math.sqrt(seqLength));
    
        // this is the transformation function for input space to pixel space
        var x = d3.scale
                  .linear()
                  .domain([min_x_extent, max_x_extent])
                  .range([0, width]);

        // Create x axis.
        var xAxis = d3.svg
                      .axis()
                      .scale(x)
                      .orient("bottom")
                      .ticks(5);

        var data = d3.layout
                     .histogram()
                     .frequency(false)
                     .bins(x.ticks(num_bins))(allIndices[i].map(function(d) {
                         return d.myvar;
                     }));

        var y = d3.scale
                  .linear()
                  .domain([0, globalYMax])
                  .range([height, 0]);
    
        //display y-axis as %
        var formatPercent = d3.format(".0%");

        var yAxis = d3.svg
                      .axis()
                      .scale(y)
                      .orient("left")
                      .tickFormat(formatPercent)
                      .ticks(5);
    
        // specify the brush function 
        brush = d3.svg
                      .brush()
                      .x(x)
                      .on("brush", brushFunctionArray[i]);
    
        //Initialize the brush 
        brush.extent([min_x_extent, max_x_extent]);
    
        // add brush to brush array
        brushArray.push(brush);
    
        //append the svg 
        var svg = d3.select(namesOfDivIds[i])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id","histSVG"+i)
                    .append("g")
                    .attr("id","svgTransformGroup")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        //histogram title
        d3.select(namesOfDivIds[i] + " svg")
            .append("text").text(namesOfIndices[i])
            .attr("id", "title")
            .attr("x", margin.left).attr("y", margin.top / 2)
            .attr("stroke", colorOrder[i])
            .attr("stroke-width", "0.5px")
            .attr("font-size", "13px")
            .attr("text-decoration","underline")
            .attr("font-family", "Helvetica");
    
        //create groups to hold the bars
        /*
        var bar = svg.selectAll(".bar")
                     .data(data)
                     .enter()
                     .append("g")
                     .attr("class", ".bar")
                     .attr("transform", function(d) {
                         return "translate(" + x(d.x) + "," + y(d.y) + ")";
                     })
                     .call(brush);
        */
          var bar = svg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                      .attr("x", function(d) { return x(d.x)}) 
                      .attr("y", function(d) { return y(d.y)}) 
                      .attr("width", x(data[0].x + data[0].dx)  - x(data[0].x)-1)
                      .attr("height", function(d) { return height - y(d.y); })
                      .attr("class", "histrect" )  
                      .attr("fill", "#ccc") 

        //for each bar, append a rectangle
        /*
        bar.append("rect")
           .attr("x", 0)
           .attr("width", x(data[0].x + data[0].dx) - x(data[0].x) - 1)
           .attr("id", "histrect") //added this for the brushing (blue/grey)
           .attr("fill", "#ccc")
           .attr("height", function(d) {
               return height - y(d.y);
           });
      */
        svg.select(".brush")
           .call(brush);
    
        //context for the brush
        var context = svg.append("g").attr("id","contextGroup");
    
        //append the group with brush
        context.append("g")
               .attr("class", "x brush")
               .call(brush)
               .selectAll("rect")
               .attr("height", height);
    
        //for the brush handle bars
        context.selectAll("rect")
               .attr("height", height);

        context.selectAll(".resize")
               .append("path")
               .attr("d", resize_path);
    
        //append x-axis 
        svg.append("g")
           .attr("class", "x axis xAxis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);
    
        //append the y-axis 
        svg.append("g")
           .attr("class", "y axis yAxis")
           .style("font-size", 10)
           .style("font-family", "Helvetica")
           .call(yAxis);
    }
    
    setupDoubleClick();

    ////////////////////////////////////////////////
    //       Parameters for the seqContextSVG     //
    ////////////////////////////////////////////////

    seq_svg_height = positive_y_axis + negative_y_axis + seq_rect_height;
    seq_svg_width = layoutWidth ;
    seq_rect_width = layoutWidth / refSeq.length;
    
    ////////////////////////////////////////////////
    //      Parameters for the seqZoomSVG         //
    ////////////////////////////////////////////////

    zoom_positive_y_axis = positive_y_axis * zoomScaleFactor;
    zoom_negative_y_axis = negative_y_axis * zoomScaleFactor;
    
    zoom_seq_svg_width = seq_svg_width - 590;
    zoom_seq_rect_width = Math.round(zoom_seq_svg_width / zoomLength);
    zoom_seq_rect_height = seq_rect_height * zoomScaleFactor;
    zoom_seq_svg_height = zoom_positive_y_axis + zoom_negative_y_axis + zoom_seq_rect_height;
    
    seqArcContextSVG = d3.select("#mainArcChart")
                             .append("svg")
                             .attr("class", "seqArcContextSVG")
                             .attr("style", "border-bottom:1px solid black;")
                             .attr("width", seq_svg_width)
                             .attr("height", arcContextHeight);
    
    //add the sequence (context) svg
    seqContextSVG = d3.select("#mainChart")
                          .append("svg")
                          .attr("class", "seqContextSVG")
                          .attr("width", seq_svg_width)
                          .attr("height", seq_svg_height);
    
    //////////////////////////////////////////////////////////
    ///// thsi is where the x-axis context went originally
    ///////////////////////////////////////////////////////////
    
    //this puts the rectangles on the svg
    seqContextSVG.selectAll("rect")
                 .data(refSeq)
                 .enter()
                 .append("rect")
                 .attr("fill", function(d, i) {return "#F7F7F7";})
                 .attr("stroke", "black")
                 .attr("stroke-width", 0.5)
                 .attr("x", function(d, i) {
                     return i * seq_rect_width;
                 })
                 .attr("y", function(d, i) {
                     return positive_y_axis;
                 })
                 .attr("width", seq_rect_width)
                 .attr("height", seq_rect_height);
    
    //this puts the actual text on the bars
    seqContextSVG.selectAll("text")
                 .data(refSeq)
                 .enter()
                 .append("text")
                 .attr("x", function(d, i) {
                     return (i * seq_rect_width) + seq_rect_width / 2 - 1;
                 })
                 .attr("y", function() {
                     return positive_y_axis + seq_rect_height / 2;
                 })
                 .attr("dx", ".35em")
                 .attr("dy", ".35em")
                 .attr("fill", function(d, i) {return "black";})
                 .attr("font-size", "2px")
                 .attr("font-family", "Helvetica")
                 .text(String);
    
    //////////////////////////////////////////////////
    // Initialize the Brush for the Context Sequence//
    //////////////////////////////////////////////////
    // Create the x scale function for the sequence brush
    x = d3.scale
            .linear()
            .domain([0, refSeq.length])
            .range([0, seq_svg_width]);
    
    seqContextBrush = d3.svg
                          .brush()
                          .x(x)
                          .on("brush", brushSeqContext);
    
    //Initialize the brush to cover the first 15 residues 
    seqContextBrush.extent([0, zoomLength]);
    seqContextSVG.select(".brush")
                 .call(seqContextBrush);
    
    //append a group to hold the brush
    context = seqContextSVG.append("g");
    
    //append the brush
    context.append("g")
           .attr("class", "x brush")
           .attr("id", "seqContextBrush")
           .call(seqContextBrush)
           .selectAll("rect")
           .attr("height", seq_svg_height);
    
    seqStdHeatSVG  = d3.select("#mainChart")
                           .append("svg") 
                           .attr("class", "stdHeatMap")
                           .attr("width",seq_svg_width)
                           .attr("height",allIndices.length*(seq_rect_width+3));
    
    for (var index = 0; index < allIndices.length; index++){
        stdExtents.push(d3.extent(allStdDeviations[index]));
        stdMaps.push(d3.scale
                       .linear()
                       .domain(stdExtents[index])
                       .range([0,1])
                       .clamp(true)
                    );
    }

    for (var index = 0; index < allIndices.length; index++){

        //specify the name of the div based on the namesOfDivIds[index]
        var nameOfDiv = namesOfDivIds[index].substring(1) + "heat";
        //append the non-visible placeholders on the svg

        seqStdHeatSVG.selectAll("rect#" + nameOfDiv)
                     .data(allStdDeviations[index].map(function(d) { return d; }))
                     .enter()
                     .append("rect")
                     .attr("class","stdHeatRects")
                     .attr("id", nameOfDiv)
                     .attr("fill", function(d,i){return d3.hsl(0, 0, 1 - stdMaps[index](d)).toString();}) 
                     .attr("x",function(d,i){return i*seq_rect_width;})
                     .attr("y",function(d,i){return index*seq_rect_width + (index*2)})
                     .attr("width",seq_rect_width)
                     .attr("height",seq_rect_width);

    }

    //now put hidden rectangles on the svg (for the scores), for each of the 6 indices, so I can transition them later
    for (var index = 0; index < allIndices.length; index++) {
    
        //specify the name of the div based on the namesOfDivIds[index]
        var nameOfDiv = namesOfDivIds[index].substring(1) + "scoreNonZoom";
        //append the non-visible placeholders on the svg
        seqContextSVG.selectAll("rect#" + nameOfDiv)
                     .data(refSeq)
                     .enter()
                     .append("rect")
                     .attr("class", "seqContextScoreRects")
                     .attr("id", nameOfDiv)
                     .attr("opacity", 0) // note these are not visible at first
                     .attr("x", function(d, i) {
                         return i * seq_rect_width;
                     })
                     .attr("y", function(d, i) {
                         return positive_y_axis;
                     })
                     .attr("width", seq_rect_width)
                     .attr("height", 0);
    }
    
    //add an x-axis (separate svg right below it)
    svgForSequenceXAxis = d3.select("#mainChart")
                                .append("svg")
                                .attr("class", "x_axis_for_seq")
                                .attr("width", seq_svg_width)
                                .attr("height", 20);
    
    // axis for the sequence
    xToAppendAxis = d3.scale
                        .linear()
                        .domain([1, refSeq.length]) //changed from 0 to 1
                        .range([xAxisPadding, seq_svg_width - xAxisPadding]);
  
    // Create x axis for the seq svg
    xAxisForSequence = d3.svg
                           .axis()
                           .scale(xToAppendAxis)
                           .orient("bottom")
                           .ticks(25);
    
    //append x-axis to the sequence  
    svgForSequenceXAxis.append("g")
                       .attr("class", "x axis")
                       .attr("transform", "translate(0," + 0 + ")")
                       .call(xAxisForSequence);
 
    xExtentDistHist = d3.extent(rawHistValues.map(function(d) {
        return d;
    }));
    
    xExtentDistHist[0] = Math.floor(xExtentDistHist[0]);
    xExtentDistHist[1] = Math.ceil(xExtentDistHist[1]);
    
    numBinsDistHist = 20;
    
    xDistHist = d3.scale
                      .linear()
                      .domain(xExtentDistHist)
                      .range([0, widthDistHist]);
    
    xAxisDistHist = d3.svg
                          .axis()
                          .scale(xDistHist)
                          .orient("bottom")
                          .ticks(10);
    
    distHistData = d3.layout
                         .histogram()
                         .frequency(false)
                         .bins(xDistHist.ticks(numBinsDistHist))(rawHistValues.map(function(d) {
                             return d;
                         }));
    
    yDistHist = d3.scale
                      .linear()
                      .domain([0, d3.max(distHistData, function(d) {
                          return d.y;
                      })])
                      .range([heightDistHist, 0]);
    
    //display y-axis as %
    formatPercent = d3.format(".0%");
    yAxisDistHist = d3.svg
                          .axis()
                          .scale(yDistHist)
                          .orient("left")
                          .tickFormat(formatPercent)
                          .ticks(5);
    
    //will initialize this later
    brushDistHistExtent = [0, 0];
    
    // specify the brush function
    brushDistHist = d3.svg
                         .brush()
                         .x(xDistHist)
                         .on("brush", histDistBrushMove);
    
    //append the svg and set its width and height
    distHistSVG = d3.select("#distanceHistogram")
                        .append("svg").attr("class", "distHistClass")
                        .attr("width", widthDistHist + marginDistHist.left + marginDistHist.right)
                        .attr("height", heightDistHist + marginDistHist.top + marginDistHist.bottom)
                        .append("g")
                        .attr("transform", "translate(" + marginDistHist.left + "," + marginDistHist.top + ")")
                        .attr("goffsetID", "thegOffset");
    
    //create by groups (g's) to hold the bars
    barDistHist = distHistSVG.selectAll("distHistBar")
                                 .data(distHistData)
                                 .enter()
                                 .append("g")
                                 .attr("class", "distHistBar")
                                 .attr("transform", function(d) {
                                     return "translate(" + xDistHist(d.x) + "," + yDistHist(d.y) + ")";
                                 })
                                 .call(brushDistHist);
    
    //for each bar, append a rectangle
    barDistHist.append("rect")
               .attr("x", 0)
               .attr("width", xDistHist(distHistData[0].x + distHistData[0].dx) - xDistHist(distHistData[0].x) - 1)
               .attr("id", "histrect")
               .attr("fill", "#ccc")
               .attr("height", function(d) {
                   return heightDistHist - yDistHist(d.y);
                });
    
    distHistSVG.select(".brush").call(brush);
    
    contextDistHist = distHistSVG.append("g")
                                     .attr("class", "brushContainer");
    
    contextDistHist.append("g")
                   .attr("class", "x brush")
                   .call(brushDistHist)
                   .selectAll("rect")
                   .attr("height", heightDistHist);
    
    contextDistHist.selectAll("rect")
                   .attr("height", heightDistHist);
    
    contextDistHist.selectAll(".resize")
                   .append("path")
                   .attr("d", resizePathDistHist);
    
    distHistSVG.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + heightDistHist + ")")
               .call(xAxisDistHist);
    
    distHistSVG.select(".axis")
               .append("text")
               .text("Distance (Unit: Angstrom)")
               .attr("x", (widthDistHist / 2) - marginDistHist.left - marginDistHist.right).attr("y", marginDistHist.bottom / 1.5)
               .style("font-size", 12)
               .style("font-family", "Helvetica");
    
    distHistSVG.append("g")
               .attr("class", "y axis")
               .style("font-size", 12)
               .call(yAxisDistHist)
               .style("font-family", "Helvetica");;
    
 
    numTicksForChordColorScale = Math.round((initHistDistBrush[1] - initHistDistBrush[0]) / angBucketLength);
    
    widthOfChordColorRect = widthOfScale / numTicksForChordColorScale;

    chordColorScale = d3.scale
                        .linear()
                        .domain([3.3, 9])
                        .range([marginDistHist.left, widthOfScale + marginDistHist.left]);
    
    chordColorAxis = d3.svg
                       .axis()
                       .scale(chordColorScale)
                       .ticks(numTicksForChordColorScale);
    
    //chordColorAxis.tickSize(2,0);
    theHistSVG = d3.select("svg.distHistClass");
    theHistSVG.append("g")
                .attr("class", "chordColorAxis")
    			.attr("transform", "translate(0, " + (marginDistHist.top / 2) + ")").call(chordColorAxis);
    
    for (var i = 0; i < numTicksForChordColorScale; i++) {
        vector4Rects.push(i);
    }
    
    theHistSVG.selectAll("rect.chordColorRects")
              .data(vector4Rects)
              .enter()
              .append("rect")
              .attr("fill", "#ccc")
              .attr("class", "chordColorRects")
              .attr("x", function(d, i) {
                  return marginDistHist.left + i * widthOfChordColorRect;
              })
              .attr("y", function(d, i) {
                  return marginDistHist.top / 2 - 15;
              })
              .attr("width", widthOfChordColorRect)
              .attr("height", 10);
    
    //this is called when the brush of the distance histogram is moved
   
    //////////////////////////////////
    //// scales for seqContextSVG ////
    //////////////////////////////////
    seqPositiveYScale = d3.scale
                              .linear()
                              .domain([0, globalCumMaxPosX])
                              .range([0, positive_y_axis]);
    
    seqNegativeYScale = d3.scale
                              .linear()
                              .domain([globalCumMinNegX, 0])
                              .range([negative_y_axis, 0]);
    
    ///////////////////////////////
    //// scales for seqZoomSVG ////
    ///////////////////////////////
    zoomPositiveYScale = d3.scale
                               .linear()
                               .domain([0, globalCumMaxPosX]) //use the global max 
                               .range([0, zoom_positive_y_axis]);
    
    zoomNegativeYScale = d3.scale
                               .linear()
                               .domain([globalCumMinNegX, 0]) //use the global min 
                               .range([zoom_negative_y_axis, 0]);
    

    // Seperate functions required for proper for-loop closures in previous index

    //init all pattern arrays
    for (var p = 0; p < allIndices.length; p++) {
        for (var i = 0; i < seqLength; i++) {
            globalPatterns[p].push({
                pushed_height: 0,
                pushed_y: positive_y_axis,
                pushed_color: colorOrder[p]
            });
            globalPatternsZoom[p].push({
                pushed_height: 0,
                pushed_y: zoom_positive_y_axis,
                pushed_color: colorOrder[p]
            });
        }
    }
    
    ////////////////////////////////////////////////
    //    SVG for the Zoomed Sequence Y-Axis     ///
    ////////////////////////////////////////////////
    svgForZoomYAxis = d3.select("#zoomedChartYAxis")
                            .append("svg")
                            .attr("class", "y_axis_for_zoom")
                            .attr("width", 20)
                            .attr("height", zoom_seq_svg_height);
    
    /////////////////////////////////////////
    ////scales for Extra svgForZoomYAxis ////
    /////////////////////////////////////////
    zoomAxisPositiveYScale = d3.scale
                                   .linear()
                                   .domain([globalCumMaxPosX, 0]) //use the global max 
                                   .range([0, zoom_positive_y_axis]);
    
    zoomAxisNegativeYScale = d3.scale
                                   .linear()
                                   .domain([0, globalCumMinNegX]) //use the global min 
                                   .range([zoom_negative_y_axis + zoom_seq_rect_height, zoom_seq_svg_height]);
    
    //////////////////////////////////////
    ////Axes for the extra Y-axis SVG ////
    //////////////////////////////////////
    yPositiveAxisZoom = d3.svg
                            .axis()
                            .scale(zoomAxisPositiveYScale)
                            .orient("left")
                            .ticks(4);

    yNegativeAxisZoom = d3.svg
                            .axis()
                            .scale(zoomAxisNegativeYScale)
                            .orient("left")
                            .ticks(4);
    
    //append the positive y-axis to the zoom
    svgForZoomYAxis.append("g")
                   .attr("class", "y_axis_positive_zoom")
                   .style("font-size", 10)
                   .style("font-family", "Helvetica")
                   .attr("transform", "translate(" + 20 + ",0)")
                   .call(yPositiveAxisZoom);
    
    //append the positive y-axis to the zoom
    svgForZoomYAxis.append("g")
                   .attr("class", "y_axis_negative_zoom")
                   .style("font-size", 10)
                   .style("font-family", "Helvetica")
                   .attr("transform", "translate(" + 20 + ",0)")
                   .call(yNegativeAxisZoom);
    
    /////////////////////////////////////
    //    SVG for the Zoomed SVG      ///
    /////////////////////////////////////
    seqZoomSVG = d3.select("#zoomedChart")
    					.append("svg")
    					.attr("class", "seqZoomSVG")
    					.attr("width", zoom_seq_svg_width)
    					.attr("height", zoom_seq_svg_height);
    
    initrefSeqSlice = refSeq.slice(0, zoomLength);

    //this puts the rectangles on the svg
    seqZoomSVG.selectAll("rect")
              .data(initrefSeqSlice)
              .enter()
              .append("rect")
              .attr("class", "seqZoomSeqRects")
              .attr("fill", function(d, i) {return "#F7F7F7";})
              .attr("x", function(d, i) {
                  return i * zoom_seq_rect_width;
              })
              .attr("y", function(d, i) {
                  return zoom_positive_y_axis;
              })
              .attr("width", zoom_seq_rect_width)
              .attr("height", zoom_seq_rect_height);
    
    //this puts the actual text on the bars
    seqZoomSVG.selectAll("text")
              .data(initrefSeqSlice)
              .enter()
              .append("text") // 10 is for the offset for the length of the letter
              .attr("x", function(d, i) {
                  return (i * zoom_seq_rect_width) + zoom_seq_rect_width / 2 - 10;
              })
              .attr("y", function() {
                  return zoom_positive_y_axis + zoom_seq_rect_height / 2;
              })
              .attr("dx", ".35em")
              .attr("dy", ".35em")
              .attr("font-size", "16px")
              .attr("font-family", "Helvetica")
              .attr("fill", function(d, i) {return "black";})
              .attr("stroke", "black")
              .attr("stroke-width", 0.5)
              .text(String);
    
    //iterate through each set of data and setup 6 sets of hidden rects for the future values to be binded to
    for (var index = 0; index < allIndices.length; index++) {
    
        var nameOfDiv = namesOfDivIds[index].substring(1) + "score";
    
        seqZoomSVG.selectAll("rect#" + nameOfDiv)
                  .data(refSeq.slice(0, zoomLength)) //only need fixedZoomBrushLength
                  .enter()
                  .append("rect")
                  .attr("class", "seqZoomScoreRects")
                  .attr("id", nameOfDiv)
                  .attr("opacity", 0) //hidden
                  .attr("x", function(d, i) {
                      return i * zoom_seq_rect_width;
                  })
                  .attr("y", function(d, i) {
                      return zoom_positive_y_axis;
                  })
                  .attr("width", zoom_seq_rect_width)
                  .attr("height", 0);
    
    
    } 
    
    //this is just a padding to push the x-axis over slightly to be aligned with the zoom sequence
    svgPaddingForZoomXAxis = d3.select("body")
                                   .append("svg")
                                   .attr("width", 20)
                                   .attr("height", 20);
    //add an x-axis (separate svg right below it)
    svgForZoomXAxis = d3.select("#zoomedChart")
                            .append("svg")
                            .attr("class", "x_axis_for_zoom")
                            .attr("width", zoom_seq_svg_width)
                            .attr("height", 20);
    
    xZoomToAppendAxis = d3.scale
                              .linear()
                              .domain([1, 16]) //changed form [0,15]
                              .range([xZoomAxisPadding, zoom_seq_svg_width - xZoomAxisPadding]);
    
    // Create x axis for the zoom svg
    xAxisForZoom = d3.svg.axis()
                          .scale(xZoomToAppendAxis)
                          .orient("bottom")
                          .ticks(15);
    
    //append x-axis to the svgForZoomXAxis svg  
    svgForZoomXAxis.append("g")
                   .attr("class", "x zoomXAxis")
                   .attr("transform", "translate(0," + 0 + ")")
                   .call(xAxisForZoom);
  
        // First init the brushDistHist
    // initialize the distance histogram to (2,8) Angstrom
    defaultDistHist = d3.select("#distanceHistogram");
    brushDistHist.extent([3.3, 9]);
    defaultDistHist.select(".brush").call(brushDistHist);
    histDistBrushMove();
    // Then initialize all the histograms
    //since they all have extents = (-3,3) can just call brushmove on them
    for (var i = 0; i < allIndices.length; i++) {
        brushmove(i);
    }

    /*
    var tour = new Tour();

    // Add your steps. Not too many, you don't really want to get your users sleepy
    tour.addSteps([
      {
        element: "#histogramWrapperTour", // string (jQuery selector) - html element next to which the step popover should be shown
        title: "Exchanging AA Indices", // string - title of the popover
        content: "The 1st principal component is used  ge for other amino acid indices. " // string - content of the popover
      },
      {
        element: "#mainArcChart",
        title: "3D Distance Chords",
        content: "This chords illustrate how far away amino acid indices are from one another"
      }
    ]);

    // Initialize the tour
    tour.init();

    // Start the tour
    tour.start();
    */

    tl.pg.init();


}