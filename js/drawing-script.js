	
var ctx, color = "#000";
var colorPickerActive = 0;


var x = 1;
var paintingPosX = 384;
var paintingPosY = 74;



// var mq1 = window.matchMedia ( "(max-width:500px)");

$(document).ready(function () {

	// setup a new canvas for drawing wait for device init
    setTimeout(function(){
	   newCanvas();
    }, 1000);



//control for smiley icon -- this determines users mood.
	$(function() {
		   $('#smiley-icon').bind("tap", tapHandler);
		function tapHandler (event) 
		  {
		  	if (userHappy == 1) {		  	
		  	$("#canvas").css("background-image",  "url(img/smiley/drawing-sad.png)");
		   	$("#smiley-icon").attr("src",  "img/icons/sad_icon.png");
		   	userHappy = 0;
		   	sadEmotionEntered ();
		  
		  	} else {
		  		$("#canvas").css("background-image",  "url(img/smiley/drawing-happy.png)");
		  		$("#smiley-icon").attr("src",  "img/icons/happy_icon.png");
		  		userHappy = 1;
		  		sadEmotionEntered ();
		  	}

		  }});
	
	// reset palette selection (css) and select the clicked color for canvas strokeStyle

    
	// resets canvas
	$("#undo-icon").click(function() {

		newCanvas();
		if (userHappy == 0) {
		  	$("#canvas").css("background-image",  "url(img/smiley/drawing-sad.png)");
		}
	});


		$(function() {

  $('#pencil-icon').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	$("#coloredSlider").toggle();
		  	if (colorPickerActive ==0) colorPickerActive = 1;
		  	else if (colorPickerActive ==1) colorPickerActive = 0;
		  	refreshSwatch();


		  };
	});


});

// function to setup a new canvas for drawing
function newCanvas(){
	//define and resize canvas
    // $("#content").height($('#content').css('height', '20%'));
   
   //function ref
   resetCanvasPos ();
    
   console.log("User Happy?  " + userHappy);


   if (userHappy == 0) {
	  	$("#canvas").css("background-image",  "url(img/smiley/drawing-sad.png)");
   }

    // setup canvas
	ctx=document.getElementById("canvas").getContext("2d");
	ctx.strokeStyle = color;
	ctx.lineWidth = 5;	
	
	// setup to trigger drawing on mouse or touch
	$("#canvas").drawTouch();

}

// prototype to	start drawing on touch using canvas moveTo and lineTo
$.fn.drawTouch = function() {
	var start = function(e) {
        e = e.originalEvent;
		ctx.beginPath();
				ctx.strokeStyle = color;

				// add position offset from 0,0 change below
		x = e.changedTouches[0].pageX-paintingPosX;
		y = e.changedTouches[0].pageY-paintingPosY;

		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
        e = e.originalEvent;
        		// add position offset from 0,0 change below
		x = e.changedTouches[0].pageX-paintingPosX;
		y = e.changedTouches[0].pageY-paintingPosY;


		ctx.lineTo(x,y);
		ctx.stroke();
	};
	$(this).on("touchstart", start);
	$(this).on("touchmove", move);	
}; 
    
// prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo

// prototype to	start drawing on mouse using canvas moveTo and lineTo

function getTheColor(colorVal) {
    myGreen = parseInt(((colorVal * 2) * 180) / 100);

  // 360
  theColor = "hsl("+myGreen+",100%,40%)";
  console.log(myGreen);
  return (theColor);
}

function refreshSwatch() {
  var coloredSlider = $("#coloredSlider").slider("value"),
 		   myColor = "#000000";
 	console.log(Boolean(colorPickerActive))

  // $("#coloredSlider .ui-slider-range").css("background-color", myColor);

 
 

	if (colorPickerActive == 1) {
		   myColor = getTheColor(coloredSlider);
  $("#pencil-icon").css({"background-color": myColor, "border": "1px solid black"});
  $("#box").css("background-color", myColor);
	} 
	else {

		  $("#pencil-icon").css({"background-color": "transparent", "border": "none"});
	}
	 $("#coloredSlider .ui-state-default, .ui-widget-content .ui-state-default").css("background-color", myColor);


  color = myColor;

}

$(function() {
  $("#coloredSlider").slider({
    orientation: "vertical",
    range: "min",
    max: 100,
    value: 100,
    slide: refreshSwatch,
    change: refreshSwatch,
    create: refreshSwatch,
  });
});


function resetCanvasPos () {

	 var canvas = '<canvas id="canvas" width="'+($('#content').width())+'" height="'+($('#content').height())+'"></canvas>';
	$("#content").html(canvas);
	console.log ("canvas reset!");
}



