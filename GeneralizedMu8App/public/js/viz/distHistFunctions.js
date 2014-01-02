
    function histDistBrushMove() {
    
        reColorHistDistBrush();
        //update the chords
        var histAndArcData = getHistAndArcData(eNow[0], eNow[1]);
    
        genChords(histAndArcData[1]); //[1] because only need the chords
        //update the brushed bars (I moved this to after the getHistAndArcData because I need the min/max for the color legend )
        //reColorHistDistBrush();
    }
    
    function reColorHistDistBrush() {
        var e = brushDistHist.extent();
    
        brushDistHistExtent = e;
    
        //get the color vector for all bars
        var bar_colors = [];
        for (var bar_index = 0; bar_index < distHistData.length; bar_index++) {
            if (distHistData[bar_index].x >= e[0] && (distHistData[bar_index].x + distHistData[bar_index].dx) <= e[1]) {
                bar_colors.push(pushDarkGrey);
    
            } else {
                bar_colors.push("#ccc");
            }
        }
    
        //change the color of extent rectangles to blue
        var hist = d3.select("svg.distHistClass");
    
        hist.selectAll("#histrect")
            .data(bar_colors)
            .attr("fill", function(d, i) {
                return d;
            });
    
        //////////////////////////////////
        /////// Update the Legend ////////
        //////////////////////////////////
        chordColorScale = d3.scale
                            .linear()
                            .domain([e[0], e[1]])
                            .range([marginDistHist.left, 100 + marginDistHist.left]);
    
        numTicksForChordColorScale = Math.round((e[1] - e[0]) / angBucketLength);
    
        widthOfChordColorRect = widthOfScale / numTicksForChordColorScale;
    
        chordColorAxis = d3.svg.axis().scale(chordColorScale)
        //.ticks(numTicksForChordColorScale);
        .ticks(3);
    
        //chordColorAxis.tickSize(2,0);
        //change the x-axis
        hist.select(".chordColorAxis").call(chordColorAxis);
    
        hist.selectAll(".chordColorRects").remove();
    
        vector4Rects = [];
        for (var i = 0; i < numTicksForChordColorScale; i++) {
            vector4Rects.push(i);
        }
    
        var range = maxChordDist - minChordDist;
    
        var colorStep = (maxChordDist - minChordDist) / numTicksForChordColorScale;
    
        theHistSVG.selectAll("rect.chordColorRects")
                  .data(vector4Rects)
                  .enter()
                  .append("rect")
                  .attr("fill", function(d, i) {
                      return chordColor(1 - (((minChordDist + (i * colorStep)) - minChordDist) / range));
                  })
                  .attr("class", "chordColorRects")
                  .attr("x", function(d, i) {
                      return marginDistHist.left + i * widthOfChordColorRect;
                  })
                  .attr("y", function(d, i) {
                      return marginDistHist.top / 2 - 15;
                  })
                  .attr("width", widthOfChordColorRect)
                  .attr("height", 10);
    }