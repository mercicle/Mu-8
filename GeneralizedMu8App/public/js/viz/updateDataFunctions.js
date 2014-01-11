
//update data functions

function updateData(){

		//AlphaHelixPC1
		//BetaSheetPC1
		//CompositionPC1
		//HydrophobicityPC1
		//OtherPropertiesPC1
		//PhysicoChemicalPC1

		//set the default sequence
		defaultIndexData[0][0].forEach(function(x){return refSeq.push(x[0])});
 
 		defaultIndexData[1][indexOfNewAccession] = newIndexData[1][0];
 		defaultIndexData[2][indexOfNewAccession] = newIndexData[2][0];

 		stdAlpha=[]; stdBeta=[]; stdComp=[];stdHydro=[];stdPhy=[];stdOth=[];
		alphaValues =[]; betaValues=[]; compValues=[];hydroValues=[];physicoValues=[];otherValues=[];
	    cumMinNegX =[];cumMaxPosX=[];
	    namesOfIndices[indexOfNewAccession] = accessionOfNewIndex;

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

}

function updateHistograms(){

    /////////////////////////////////////////////////////////////////
    // Global Y max and global min/max x extents for histograms   ///
    /////////////////////////////////////////////////////////////////
   histDataArray = [];x_extent_array=[];
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
        //brush.extent([min_x_extent, max_x_extent]);
    
        // add brush to brush array
        //brushArray.push(brush);
    
        //append the svg 
        /*
        var svg = d3.select(namesOfDivIds[i])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    	*/

        var svg = d3.select(namesOfDivIds[i])
                    .select("svg")

        //histogram title
        d3.select(namesOfDivIds[i] + " svg")
            .select("#title")
            .text(namesOfIndices[i])
            .attr("x", margin.left).attr("y", margin.top / 2)
            .attr("stroke", colorOrder[i])
            .attr("stroke-width", "0.5px")
            .attr("font-size", "13px")
            .attr("font-family", "Helvetica");
    
        //create groups to hold the bars
        var bar = svg.selectAll(".bar")
                     .data(data)
                     .attr("transform", function(d) {
                         return "translate(" + x(d.x) + "," + y(d.y) + ")";
                     })
                     .call(brush);
    
        //for each bar, append a rectangle
        bar.selectAll("#histrect")
           .attr("x", 0)
           .attr("width", x(data[0].x + data[0].dx) - x(data[0].x) - 1)
           .attr("id", "histrect") //added this for the brushing (blue/grey)
           .attr("fill", "#ccc")
           .attr("height", function(d) {
               return height - y(d.y);
           });
    
        svg.select(".brush")
           .call(brushArray[i]);
    
    /*
        //context for the brush
        var context = svg.append("g");
    
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
    */
        //append x-axis 
        svg.select("x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);
    
        //append the y-axis 
        svg.select("y axis")
           .style("font-size", 10)
           .style("font-family", "Helvetica")
           .call(yAxis);

    }
}