
function brushmove(index) {

    console.log('brush move index'+index);
    var e = brushArray[index].extent();

    //get the color vector i need to update the bars blue/grey
    var bar_colors = [];
    for (var bar_index = 0; bar_index < histDataArray[index].length; bar_index++) {
        if (histDataArray[index][bar_index].x >= e[0] && (histDataArray[index][bar_index].x + histDataArray[index][bar_index].dx) <= e[1]) {
            bar_colors.push(colorOrder[index]);

        } else {
            bar_colors.push("#ccc"); //background grey
        }
    }

    //select the correct histogram and update the rect colors
    var hist = d3.select(namesOfDivIds[index]);

    hist.selectAll("#histrect").data(bar_colors).attr("fill", function(d, i) {
        return d;
    }).call(brushArray[index]);

    //for each residue 
    for (var i = 0; i < allIndexData[index].length; i++) {

        //if the score is between the brush
        if (allIndexData[index][i] >= e[0] && allIndexData[index][i] <= e[1]) {

            //specify the correct height, y-value, and color based on the value of the score positive or negative)
            var push_this_color = colorOrder[index];
            var push_this_height, push_this_y;

            if (allIndexData[index][i] > 0) {

                //set the global is brushed array to 1 to indicate this index has been brushed
                globalIsBrushedArray[i][0][posNegIndices[i][0].indexOf(index)] = 1;

                //iterate through all values and update their height and Y value
                var cumulativeY = positive_y_axis;
                var cumulativeYZoom = zoom_positive_y_axis;

                for (var posIdx = 0; posIdx < posNegIndices[i][0].length; posIdx++) {

                    var thisIndex = posNegIndices[i][0][posIdx]; //e.g. posNegIndices[0][0] = [1,4,5]
                    var thisHeight = seqPositiveYScale(allIndexData[thisIndex][i]);
                    thisHeight *= globalIsBrushedArray[i][0][posIdx]; //multiply by 0 is not brushed
                    var thisHeightZoom = zoomPositiveYScale(allIndexData[thisIndex][i]);
                    thisHeightZoom *= globalIsBrushedArray[i][0][posIdx]; //multiply by 0 is not brushed
                    globalPatterns[thisIndex][i].pushed_height = Math.round(thisHeight);
                    globalPatternsZoom[thisIndex][i].pushed_height = Math.round(thisHeightZoom);

                    cumulativeY = cumulativeY - Math.round(thisHeight);
                    cumulativeYZoom = cumulativeYZoom - Math.round(thisHeightZoom);

                    globalPatterns[thisIndex][i].pushed_y = Math.round(cumulativeY);
                    globalPatternsZoom[thisIndex][i].pushed_y = Math.round(cumulativeYZoom);
                }

                //else if allIndexData[index][i] is negative
            } else {
                //set the global is brushed array to 1 to indicate this index has been brushed
                globalIsBrushedArray[i][1][posNegIndices[i][1].indexOf(index)] = 1;

                //iterate through all values and update their height and Y value
                var cumulativeY = positive_y_axis + seq_rect_height;
                var cumulativeYZoom = zoom_positive_y_axis + zoom_seq_rect_height;
                for (var posIdx = 0; posIdx < posNegIndices[i][1].length; posIdx++) {

                    var thisIndex = posNegIndices[i][1][posIdx]; // e.g. posNegIndices[0][1] = [0,2,3]
                    var thisHeight = seqNegativeYScale(allIndexData[thisIndex][i]);
                    thisHeight *= globalIsBrushedArray[i][1][posIdx]; //multiply by 0 if not brushed
                    var thisHeightZoom = zoomNegativeYScale(allIndexData[thisIndex][i]);
                    thisHeightZoom *= globalIsBrushedArray[i][1][posIdx]; //multiply by 0 if not brushed
                    globalPatterns[thisIndex][i].pushed_height = Math.round(thisHeight);
                    globalPatternsZoom[thisIndex][i].pushed_height = Math.round(thisHeightZoom);

                    globalPatterns[thisIndex][i].pushed_y = Math.round(cumulativeY);
                    globalPatternsZoom[thisIndex][i].pushed_y = Math.round(cumulativeYZoom);
                    //for the negatives you need the update after the pushed_y 
                    cumulativeY = cumulativeY + Math.round(thisHeight);
                    cumulativeYZoom = cumulativeYZoom + Math.round(thisHeightZoom);
                }
            }
            //if the score is not between the brush
        } else {

            //update all values based on allIndexData[index][i] not brushed
            if (allIndexData[index][i] > 0) {
                //set is brushed indicator to 0
                globalIsBrushedArray[i][0][posNegIndices[i][0].indexOf(index)] = 0;

                //iterate through all values and update their height and Y value
                var cumulativeY = positive_y_axis;
                var cumulativeYZoom = zoom_positive_y_axis;
                for (var posIdx = 0; posIdx < posNegIndices[i][0].length; posIdx++) {

                    var thisIndex = posNegIndices[i][0][posIdx];

                    var thisHeight = seqPositiveYScale(allIndexData[thisIndex][i]);
                    thisHeight *= globalIsBrushedArray[i][0][posIdx]; //multiply by 0 is not brushed
                    var thisHeightZoom = zoomPositiveYScale(allIndexData[thisIndex][i]);
                    thisHeightZoom *= globalIsBrushedArray[i][0][posIdx]; //multiply by 0 is not brushed
                    globalPatterns[thisIndex][i].pushed_height = Math.round(thisHeight);
                    globalPatternsZoom[thisIndex][i].pushed_height = Math.round(thisHeightZoom);

                    cumulativeY = cumulativeY - Math.round(thisHeight);
                    cumulativeYZoom = cumulativeYZoom - Math.round(thisHeightZoom);

                    globalPatterns[thisIndex][i].pushed_y = Math.round(cumulativeY);
                    globalPatternsZoom[thisIndex][i].pushed_y = Math.round(cumulativeYZoom);

                }
            } else {
                //set is brushed indicator to 0
                globalIsBrushedArray[i][1][posNegIndices[i][1].indexOf(index)] = 0;

                var cumulativeY = positive_y_axis + seq_rect_height;
                var cumulativeYZoom = zoom_positive_y_axis + zoom_seq_rect_height;

                for (var posIdx = 0; posIdx < posNegIndices[i][1].length; posIdx++) {

                    var thisIndex = posNegIndices[i][1][posIdx];

                    var thisHeight = seqNegativeYScale(allIndexData[thisIndex][i]);
                    thisHeight *= globalIsBrushedArray[i][1][posIdx]; //multiply by 0 is not brushed
                    var thisHeightZoom = zoomNegativeYScale(allIndexData[thisIndex][i]);
                    thisHeightZoom *= globalIsBrushedArray[i][1][posIdx]; //multiply by 0 is not brushed
                    globalPatterns[thisIndex][i].pushed_height = Math.round(thisHeight);
                    globalPatternsZoom[thisIndex][i].pushed_height = Math.round(thisHeightZoom);

                    globalPatterns[thisIndex][i].pushed_y = Math.round(cumulativeY);
                    globalPatternsZoom[thisIndex][i].pushed_y = Math.round(cumulativeYZoom);

                    //for the negatives you need the update after the pushed_y 
                    cumulativeY = cumulativeY + Math.round(thisHeight);
                    cumulativeYZoom = cumulativeYZoom + Math.round(thisHeightZoom);
                }
            }
        }
    }

    //for each characteristic, transition each rect
    for (var p = 0; p < allIndices.length; p++) {
        seqContextSVG.selectAll("rect" + namesOfDivIds[p] + "scoreNonZoom")
                     .data(globalPatterns[p])
                     .transition()
                     .duration(globalTransitionTime)
                     .attr("x", function(d, i) {
                         return i * seq_rect_width;
                     })
                     .attr("y", function(d) {
                         return d.pushed_y;
                     })
                     .attr("width", seq_rect_width)
                     .attr("height", function(d) {
                         return d.pushed_height;
                     })
                     .attr("class", "seqContextScoreRects")
                     .attr("opacity", 1)
                     .style("fill", function(d) {
                         return d.pushed_color;
                     });
    }

    // update the chart brush
    seqContextSVG.select("#seqContextBrush")
                 .call(brushSeqContext);
}