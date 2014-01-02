
function brushSeqContext(p) {

    eBefore = eNow;
    eNow = seqContextBrush.extent();

    eNow[0] = Math.floor(eNow[0]);
    eNow[1] = Math.floor(eNow[1]);

    colorHeatForThisContextRegion(eNow);
    
    var eDistBrushExtent = brushDistHist.extent();
    eDistBrushExtent[0] = Math.floor(eDistBrushExtent[0]);
    eDistBrushExtent[1] = Math.floor(eDistBrushExtent[1]);

    zoomLength = eNow[1] - eNow[0];

    // If our user brushes over more than maxBrushValue residues, make it go back down to maxBrushValue residues
    if (zoomLength > maxBrushValue) {
        eNow[1] = eNow[0] + maxBrushValue;
        seqContextBrush.extent([eNow[0], eNow[1]]);
        seqContextBrush(d3.select(this));
        zoomLength = maxBrushValue; //also reset zoom length
        colorHeatForThisContextRegion(eNow);
    }
    
    if (gl) {
	    gl.useProgram(shaderProgram);    
	    gl.uniform1i(shaderVariables.mMinValue, eNow[0]);
	    gl.uniform1i(shaderVariables.mMaxValue, eNow[1]);
	}
 
    // If the Distance Histogram isn't brushed, only draw the Distance Histogram without drawing arcs 
    // If the Distance Histogram IS brushed, draw the Distance Histogram and Draw the Arcs
    if (eDistBrushExtent[0] == eDistBrushExtent[1]) {
        // DistHistBrushExtent is same, only redraw the hist
        var histAndArcData = getHistAndArcData(eNow[0], eNow[1]);
        drawDistHistogram(histAndArcData[0]);
    } else if (eDistBrushExtent[0] != eDistBrushExtent[1]) {
        // DistHist has something brushed, redraw everything
        var histAndArcData = getHistAndArcData(eNow[0], eNow[1]);
        drawDistHistogram(histAndArcData[0]);
        genChords(histAndArcData[1]);
    }

    var isScrolling = 0;

    if (d3.event == null) {

    } else {
        isScrolling = 1;
    }

    setZoomParms(eNow[1] - eNow[0]);

    var textScale = d3.scale
                      .linear()
                      .domain([248, 1])
                      .range([2, 16]);

    var textBufferScale = d3.scale
                            .linear()
                            .domain([248, 1])
                            .range([0, 10]);

    var textDxScale = d3.scale
                        .linear()
                        .domain([248, 1])
                        .range([10, 35]);

    //get the slice of dTIM corrosponding to the extent
    var sliceOfdTIM = refSeq.slice(eNow[0], eNow[1]);
    var sliceOfscTIM = refSeq.slice(eNow[0], eNow[1]);

    /////////////////////////////////////////////////
    //      Clear Sequence and then re-render      //
    /////////////////////////////////////////////////
    var selection = seqZoomSVG.selectAll("rect.seqZoomSeqRects").data([]);

    selection.exit().remove();

    //put the sequence slice on the seqZoomSVG
    var selection = seqZoomSVG.selectAll("rect.seqZoomSeqRects").data(sliceOfdTIM);

    selection.enter().append("rect");

    selection.attr("class", "seqZoomSeqRects").attr("fill", function(d, i) {
                 if (d == sliceOfscTIM[i]) {
                     return "#F7F7F7";
                 } else {
                     return "red";
                 }
             })
             .attr("stroke", "black")
             .attr("stroke-width", 0.5)
             .attr("x", function(d, i) {
                 return i * zoom_seq_rect_width;
             })
             .attr("y", function(d, i) {
                 return zoom_positive_y_axis;
             })
             .attr("width", zoom_seq_rect_width)
             .attr("height", zoom_seq_rect_height)
             .on("mouseover", function(d, i) {
                 return mouseover(d, i, sliceOfscTIM[i], "rect");
             })
             .on("mouseout", function(d, i) {
                 return mouseout(d, i, sliceOfscTIM[i], "rect");
             });

    //put the sequence text on the seqZoomSVG
    var selection = seqZoomSVG.selectAll("text").data([]);

    selection.exit().remove();

    var selection = seqZoomSVG.selectAll("text").data(sliceOfdTIM);

    selection.enter().append("text");

    selection.attr("x", function(d, i) {
                 return (i * zoom_seq_rect_width) + zoom_seq_rect_width / 2 - textScale(Math.round(Math.abs(eNow[1] - eNow[0]))) / 2;
             })
             .attr("y", function() {
                 return zoom_positive_y_axis + zoom_seq_rect_height / 2;
             })
             .attr("dy", ".35em")
             .attr("fill", function(d, i) {
                 if (d == sliceOfscTIM[i]) {
                     return "black";
                 } else {
                     return "white";
                 }
             })
             .attr("font-size", textScale(Math.round(Math.abs(eNow[1] - eNow[0]))) + "px")
             .attr("font-family", "Helvetica")
             .on("mouseover", function(d, i) {
                 return mouseover(d, i, sliceOfscTIM[i], "text");
             })
             .on("mouseout", function(d, i) {
                 return mouseout(d, i, sliceOfscTIM[i], "text");
             })
             .text(String);

    var alignBuffer = 2; //add buffer so the aligned view rects are not directly side-by-side
    if (prevZoomLayout != zoomLayout) { //this means they are the same length to I just need to transition
        //update prevZoomLayout
        prevZoomLayout = zoomLayout;

        //for each characteristic, update the 
        for (var p = 0; p < allIndices.length; p++) {

            var transitionTime = 0;
            if (isScrolling) {
                transitionTime = 0;
            } else {
                transitionTime = globalTransitionTime * 2;
            }

            var setThisId = namesOfDivIds[p].substring(1) + "score";

            var selection = seqZoomSVG.selectAll("rect" + namesOfDivIds[p] + "score")
                                      .data(globalPatternsZoom[p]
                                      .slice(eNow[0], eNow[1]));

            if (zoomLayout == "Stacked") {
                selection.transition()
                         .duration(3000) // 3 seconds
                         .attr("class", "seqZoomScoreRects").attr("id", setThisId).attr("x", function(d, i) {
                             return i * zoom_seq_rect_width;
                         })
                         .attr("y", function(d) {
                             return d.pushed_y;
                         })
                         .attr("width", zoom_seq_rect_width)
                         .attr("height", function(d) {
                             return d.pushed_height;
                         })
                         .attr("opacity", 1)
                         .style("fill", function(d) {
                            return d.pushed_color;
                         });
            }
            if (zoomLayout == "Aligned") {

                selection.transition()
                         .duration(3000) // 3 seconds
                         .attr("class", "seqZoomScoreRects")
                         .attr("id", setThisId)
                         .attr("x", function(d, i) {
                             return i * (zoom_seq_rect_width) + p * (zoom_seq_rect_width / namesOfDivIds.length);
                         })
                         .attr("y", function(d) {
                             return resetY(d.pushed_y, d.pushed_height * 2.5);
                         })
                         .attr("width", (zoom_seq_rect_width / namesOfDivIds.length) - alignBuffer)
                         .attr("height", function(d) {
                             return d.pushed_height * 2.5;
                         })
                         .attr("opacity", 1)
                         .style("fill", function(d) {
                             return d.pushed_color;
                         });

            }
        }

    } else {
        if (zoomLayout == "Aligned") {

            /////////////////////////////////////////////////
            // Clear Each Set of Scores then re-render     //
            /////////////////////////////////////////////////
            //for each characteristic, update the 
            for (var p = 0; p < allIndices.length; p++) {

                var transitionTime = 0;
                if (isScrolling) {
                    transitionTime = 0;
                } else {
                    transitionTime = globalTransitionTime * 2;
                }

                var setThisId = namesOfDivIds[p].substring(1) + "score";

                var selection = seqZoomSVG.selectAll("rect" + namesOfDivIds[p] + "score").data([]);

                selection.exit().remove();

                var selection = seqZoomSVG.selectAll("rect" + namesOfDivIds[p] + "score")
                                          .data(globalPatternsZoom[p]
                                          .slice(eNow[0], eNow[1]));

                selection.enter().append("rect");

                selection.attr("class", "seqZoomScoreRects")
                         .attr("id", setThisId).attr("x", function(d, i) {
                             return i * (zoom_seq_rect_width) + p * (zoom_seq_rect_width / namesOfDivIds.length);
                         })
                         .attr("y", function(d) {
                             return resetY(d.pushed_y, d.pushed_height * 2.5);
                         })
                         .attr("width", (zoom_seq_rect_width / namesOfDivIds.length) - alignBuffer)
                         .attr("height", function(d) {
                             return d.pushed_height * 2.5;
                         })
                         .attr("opacity", 1)
                         .style("fill", function(d) {
                             return d.pushed_color;
                         })
                         .on("mouseover", function(d, i) {
                             mouseoverBar(this, eNow[0] + i);
                         })
                         .on("mouseout", function(d, i) {
                             mouseoutBar(this, eNow[0] + 1);
                         });

            }


        } else {

            /////////////////////////////////////////////////
            // Clear Each Set of Scores then re-render     //
            /////////////////////////////////////////////////

            var namesOfIdArray = [];
            //for each characteristic, update the 
            for (var p = 0; p < allIndices.length; p++) {

                var transitionTime = 0;
                if (isScrolling) {
                    transitionTime = 0;
                } else {
                    transitionTime = globalTransitionTime * 2;
                }

                var setThisId = namesOfDivIds[p].substring(1) + "score";

                var selection = seqZoomSVG.selectAll("rect" + namesOfDivIds[p] + "score").data([]);


                selection.attr("class", "seqZoomScoreRects")
                         .attr("id", setThisId)
                         .attr("x", function(d, i) {
                             return i * zoom_seq_rect_width;
                         })
                         .attr("y", function(d) {
                             return d.pushed_y;
                         })
                         .attr("width", zoom_seq_rect_width)
                         .attr("height", function(d) {
                             return d.pushed_height;
                         })
                         .attr("opacity", 1)
                         .style("fill", function(d) {
                             return d.pushed_color;
                         })
                         .on("mouseover", function(d, i) {
                             mouseoverBar(this, eNow[0] + i);
                         })
                         .on("mouseout", function(d, i) {
                             mouseoutBar(this, eNow[0] + 1);
                         });

                selection.exit().remove();

                var selection = seqZoomSVG.selectAll("rect" + namesOfDivIds[p] + "score")
                                          .data(globalPatternsZoom[p]
                                          .slice(eNow[0], eNow[1]));

                selection.enter().append("rect");

                selection.attr("class", "seqZoomScoreRects")
                         .attr("id", setThisId)
                         .attr("x", function(d, i) {
                             return i * zoom_seq_rect_width;
                         })
                         .attr("y", function(d) {
                             return d.pushed_y;
                         })
                         .attr("width", zoom_seq_rect_width)
                         .attr("height", function(d) {
                             return d.pushed_height;
                         })
                         .attr("opacity", 1)
                         .style("fill", function(d) {
                             return d.pushed_color;
                         })
                         .on("mouseover", function(d, i) {
                             mouseoverBar(this, eNow[0] + i);
                         })
                         .on("mouseout", function(d, i) {
                             mouseoutBar(this, eNow[0] + 1);
                         });
            }

        }
    }

    //update the x-axis (svgForZoomXAxis) for seqZoomSVG
    var svgForZoomXAxis = d3.select("svg.x_axis_for_zoom");

    var xZoomToAppendAxis = d3.scale
                              .linear()
                              .domain([eNow[0] + 1, eNow[1] + 1]) //changed from [eNow[0],eNow[1]]
                              .range([xZoomAxisPadding, zoom_seq_svg_width - xZoomAxisPadding]);

    var xAxisForZoom = d3.svg
                         .axis()
                         .scale(xZoomToAppendAxis)
                         .orient("bottom")
                         .ticks(zoomLength);

    //change the x-axis
    svgForZoomXAxis.select(".zoomXAxis").call(xAxisForZoom);
}