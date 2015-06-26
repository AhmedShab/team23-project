/**
 *	Animated Graph Tutorial for Smashing Magazine
 *	July 2011
 *   
 * 	Author:	Derek Mack
 *			derekmack.com
 *			@derek_mack
 *
 *	Example 3 - Animated Bar Chart via jQuery
 */

function drawGraph(){

	createGraph('#data-table', '.chart');
	
	// Here be graphs
	function createGraph(data, container) {
		// declaring vars
		var bars = [];
		var figureContainer = $('<div id="figure"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;		
		var chartYMax;
		var columnGroups;
		var barTimer;
		var graphTimer;
		
		// Create table data 
		var tableData = {
			// Get numbers from cells
			chartData: function() {
				var chartData = emo;
				// data.find('tbody td').each(function() {
				// 	chartData.push($(this).text());
				// });
				return chartData;
			},
			// Get heading from caption? -took this out
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			// Get legend
			chartLegend: function() {
				var chartLegend = [];
				data.find('tbody th').each(function() {
					chartLegend.push($(this).text());
				});
				return chartLegend;
			},
			//Highest value for y
			chartYMax: function() {
				var chartData = this.chartData();
				// Round off the value
				var chartYMax = Math.ceil(Math.max.apply(Math, chartData) / 10) * 10;
				return chartYMax;
			},
			// Get y data from cells
			yLegend: function() {
				var chartYMax = this.chartYMax();
				var yLegend = [];
				// Number of divisions on y
				var yAxisMarkings = 6;						
				// Add required number of y-axis markings in order from 0 - max
				for (var i = 0; i < yAxisMarkings; i++) {
					yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)) / 1000);
				}
				return yLegend;
			},
			// Get x data from header
			xLegend: function() {
				var xLegend = date;
				//data.find('thead th').each(function() {
				//	xLegend.push($(this).text());
				//});
				return xLegend;
			},
			// Sort data into groups based on number of columns
			columnGroups: function() {
				var columnGroups = [];
				// Get number of columns from first row of table
				var columns = data.find('tbody tr:eq(0) td').length;
				for (var i = 0; i < columns; i++) {
					columnGroups[i] = [];
					data.find('tbody tr').each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}
				
		// chartData = [happy, 5, 3, 6, 2, sad, 0, 2, 0, 6]
		console.log (chartData);		
		chartYMax = tableData.chartYMax();
		columnGroups = tableData.columnGroups();
		
		// make graph
		
		// Looping through column groups
		$.each(columnGroups, function(i) {
			// Create bar group container
			var barGroup = $('<div class="bar-group"></div>');
			// put bars inside each column
			for (var j = 0, k = columnGroups[i].length; j < k; j++) {
				// Create bar object to store properties (label, height etc.) and add it to array
				// Set the height later in displayGraph() to allow for left-to-right sequential display
				var barObj = {};
				barObj.label = this[j];
				//barObj.
				//****This is were the height is created. barObj.label = Number-Height
				barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
				// barObj.bar = $('<div class="bar fig' + j + '"><span>' + barObj.label + '</span></div>')

				//Change this to hashtags from memory
				barObj.bar = $('<div class="bar fig' + j + '"><span>' + "#hashtag" + '</span></div>')
					.appendTo(barGroup);
				bars.push(barObj);
			}
			// Add bar groups to graph
			barGroup.appendTo(barContainer);			
		});
		
		// Add heading to graph
		var chartHeading = tableData.chartHeading();
		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(figureContainer);
		
		// Add legend to graph
		var chartLegend	= tableData.chartLegend();
		var legendList	= $('<ul class="legend"></ul>');
		$.each(chartLegend, function(i) {			
			var listItem = $('<li><span class="icon fig' + i + '"></span>' + this + '</li>')
				.appendTo(legendList);
		});
		legendList.appendTo(figureContainer);
		
		// Add x-axis to graph
		var xLegend	= tableData.xLegend();		
		var xAxisList	= $('<ul class="x-axis"></ul>');
		$.each(xLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(xAxisList);
		});
		xAxisList.appendTo(graphContainer);
		
		// Add y-axis to graph	
		var yLegend	= tableData.yLegend();
		var yAxisList	= $('<ul class="y-axis"></ul>');
		$.each(yLegend, function(i) {
		//This is the graph yaxis legend		
			var listItem = $('<li><span>' + this*1000 + '</span></li>')
				.appendTo(yAxisList);
		});
		yAxisList.appendTo(graphContainer);		
		
		// Add bars to graph
		barContainer.appendTo(graphContainer);		
		
		// Add graph to graph container		
		graphContainer.appendTo(figureContainer);
		
		// Add graph container to main container
		figureContainer.appendTo(container);
		
		// Set individual height of bars
		function displayGraph(bars, i) {		
			// Changed the way we loop because of issues with $.each not resetting properly
			if (i < bars.length) {
				// Animate height using jQuery animate() function
				$(bars[i].bar).animate({
					height: bars[i].height
				}, 800);
				// Wait the specified time then run the displayGraph() function again for the next bar
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 100);
			}
		}
		
		// Reset graph settings and prepare for display
		function resetGraph() {
			// Stop all animations and set bar height to 0
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css('height', 0);
			});
			
			// Clear timers
			clearTimeout(barTimer);
			clearTimeout(graphTimer);
			
			// Restart timer		
			graphTimer = setTimeout(function() {		
				displayGraph(bars, 0);
			}, 200);
		}

		
		// Helper functions
		
		// Call resetGraph() when button is clicked to start graph over


		// Finally, display graph via reset function

$(function() {

  $('.graph-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	createGraph();
		}});
			  	

	resetGraph();

	}	
};
