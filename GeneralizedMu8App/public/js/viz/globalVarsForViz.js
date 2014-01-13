
var defaultIndexData = [];
var newIndexData = [];
var accessionOfNewIndex = null;
var indexOfNewAccession = null;
var authorYearOfNewIndex = "";

var refSeq = [];
// Gather Data and store into array variables.
var alphaValues = [];
var betaValues = [];
var compValues = [];
var hydroValues = [];
var physicoValues = [];
var otherValues = [];

var alphaData = [],
	betaData = [],
	compData = [],  
	hydroData = [], 
	physicoData = [], 
	otherData = [];

var seqLength = 248;
var globalTransitionTime = 300;
var layoutWidth = 1170;
// standardized distances between dTIM and fmaily mean
// at the same time, calculate the cumulative max x extent and the cumulative negative max x extent
var cumMinNegX = [];
var cumMaxPosX = [];

var allStdDeviations = [];
var stdAlpha=[], stdBeta=[], stdComp=[],stdHydro=[],stdPhy=[],stdOth=[];

var a, b, c, h, p, o;

var globalCumMinNegX = null;
var globalCumMaxPosX = null;

var allIndices = [];
var allIndexData = [];

var posNegIndices = [];
var globalIsBrushedArray = [];

//[matrixRows,histValueObjects] of defaultIndexData[1]
var matrixRows = [];
var histValueObjects = [];

var rawHistValues = [];

var namesOfDivIds = ["#first", "#second", "#third", "#fourth", "#fifth", "#sixth"];
//var namesOfDivIds = ["#alpha", "#beta", "#comp", "#hydro", "#physico", "#other"];
var namesOfIndices = ["Alpha Helix", "Beta Sheet", "Composition", "Hydrophobicity", "Physico-Chemical", "Other"];

var histDataArray = []; //will hold the array of data values for histogram buckets needed for brush coloring of histograms
//color brewer 7 group qualitative minus the yellow
var colorOrder = ["#1F78B4", "#F781BF", "#4DAF4A", "#984EA3", "#FF7F00", "#A65628"]; //replaced #E41A1C" for #1F78B4
var hueOrder =  [204, 328, 118, 292, 30, 22];
var saturationOrder = [0.71, 0.88, 0.41, 0.35, 1.00, 0.61];
// Brush function array holds the brush functions function brushX () {brushmove(X);} for X=0,..,5

var brushFunctionArray = [brush0, brush1, brush2, brush3, brush4, brush5];
// Brush Array Contains each of the brushes in order 
var brushArray = [];

// define the width and height of each histogram
var margin = {top: 20,right: 30,bottom: 20,left: 30}, 
	width = 200 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

// x_extent array outside loop for brushing code.
var x_extent_array = [];

// set global y by iterating through the datasets
var globalYMax = 0,
    min_x_extent = 0,
    max_x_extent = 0;

var brush;
////////////////////////////////////////////////
//       Parameters for the seqContextSVG     //
////////////////////////////////////////////////
var positive_y_axis = 50,
    negative_y_axis = 50;
var seq_rect_width = 5;
var seq_rect_height = 10;
var seq_svg_height = null;
var seq_svg_width = null;

////////////////////////////////////////////////
//      Parameters for the seqZoomSVG         //
////////////////////////////////////////////////
var zoomLength = 15;
var zoomLayout = "Stacked";
var prevZoomLayout = "Stacked";

var zoomScaleFactor = 2.5; //this is the scale the size of the height of the zoom svg
var zoom_positive_y_axis = null,
    zoom_negative_y_axis = null;

var zoom_seq_svg_width = null;
var zoom_seq_rect_width = null;
var zoom_seq_rect_height = null;
var zoom_seq_svg_height = null;

var arcContextHeight = 100;

var x,seqContextBrush,context;
var stdMaps=[], stdExtents=[], seqStdHeatSVG;

var svgForSequenceXAxis;

var globalAlphaPatterns = [];
var globalBetaPatterns = [];
var globalCompPatterns = [];
var globalHydroPatterns = [];
var globalPhysicoPatterns = [];
var globalOtherPatterns = [];
var globalPatterns = [globalAlphaPatterns, globalBetaPatterns, globalCompPatterns, globalHydroPatterns, globalPhysicoPatterns, globalOtherPatterns];

var globalZoomAlphaPatterns = [];
var globalZoomBetaPatterns = [];
var globalZoomCompPatterns = [];
var globalZoomHydroPatterns = [];
var globalZoomPhysicoPatterns = [];
var globalZoomOtherPatterns = [];

var globalPatternsZoom = [globalZoomAlphaPatterns, globalZoomBetaPatterns, globalZoomCompPatterns, globalZoomHydroPatterns, globalZoomPhysicoPatterns, globalZoomOtherPatterns];

var eBefore = [1, 1];
var eNow = [0, 0];
var maxBrushValue = 15;

var initHistDistBrush = [3.3, 9];
var angBucketLength = 2;
var numTicksForChordColorScale = null;

var widthOfScale = 100;
var widthOfChordColorRect = null;
var chordColorScale = null;

var chordColorAxis = null;

var vector4Rects = [];

var pushDarkGrey = d3.rgb('darkgrey').darker(1);


var xAxisPadding = 2.5;

// axis for the sequence
var xToAppendAxis = null;

// Create x axis for the seq svg
var xAxisForSequence = null;

/////////////////////////////////////
//// Add the Distance Histogram ////
////////////////////////////////////
var marginDistHist = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 30
},
    widthDistHist = 300 - marginDistHist.left - marginDistHist.right,
    heightDistHist = 300 - marginDistHist.top - marginDistHist.bottom;

var xExtentDistHist;
var numBinsDistHist = 20;
var xDistHist = null;
var xAxisDistHist = null;

var distHistData = null;
var yDistHist = null;

//display y-axis as %
var formatPercent = d3.format(".0%");
var yAxisDistHist = null;

//will initialize this later
var brushDistHistExtent = [0, 0];

// specify the brush function
var brushDistHist = null;

//append the svg and set its width and height
var distHistSVG = null;

//create by groups (g's) to hold the bars
var barDistHist = null;

var contextDistHist = null;

var theHistSVG = null;

var seqArcContextSVG = null;
//add the sequence (context) svg
var seqContextSVG = null;

var seqPositiveYScale = null;
var seqNegativeYScale = null;
var zoomPositiveYScale = null;
var zoomNegativeYScale = null;

var svgForZoomYAxis = null;
var zoomAxisPositiveYScale =null;
var zoomAxisNegativeYScale = null;
var yPositiveAxisZoom = null;
var yNegativeAxisZoom = null;

var seqZoomSVG = null;
var initrefSeqSlice = null;

//this is just a padding to push the x-axis over slightly to be aligned with the zoom sequence
var svgPaddingForZoomXAxis = null;
//add an x-axis (separate svg right below it)
var svgForZoomXAxis = null;

var xZoomAxisPadding = 10; //this is used so the values are not cutoff by the side of the svg
var xZoomToAppendAxis = null;

// Create x axis for the zoom svg
var xAxisForZoom = null;
var defaultDistHist = null;


