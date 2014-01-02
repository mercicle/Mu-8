
function layoutZoom() {

    prevZoomLayout = zoomLayout;
    zoomLayout = document.getElementById('selectLayout').value;
    
    if (zoomLayout == "Stacked")
    {
        zoomAxisNegativeYScale.domain([0,globalCumMinNegX]);
        zoomAxisPositiveYScale.domain([globalCumMaxPosX,0]);
        svgForZoomYAxis.select(".y_axis_positive_zoom")
                       .transition()
                       .duration(3000)
                       .call(yPositiveAxisZoom);

        svgForZoomYAxis.select(".y_axis_negative_zoom")
                       .transition()
                       .duration(3000)
                       .call(yNegativeAxisZoom);
    }
    else
    {
        zoomAxisNegativeYScale.domain([0,globalCumMinNegX/2.5]);
        zoomAxisPositiveYScale.domain([globalCumMaxPosX/2.5,0]);
        svgForZoomYAxis.select(".y_axis_positive_zoom")
                       .transition()
                       .duration(3000)
                       .call(yPositiveAxisZoom);

        svgForZoomYAxis.select(".y_axis_negative_zoom")
                       .transition()
                       .duration(3000)
                       .call(yNegativeAxisZoom);
    }


    seqContextBrush.extent([seqContextBrush.extent()[0], seqContextBrush.extent()[0] + zoomLength]);
    seqContextSVG.select("#seqContextBrush").call(seqContextBrush);
    brushSeqContext(0);

}