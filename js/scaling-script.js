//Created by Regan Petrie
$(document).ready (function() {

$(function() {
  $('#home-image-box-01').bind("tap", tapHandler);
		function tapHandler (event) 
		  {
		  	$("#home-image-box-02").fadeTo(500,0).hide();
		  	$("#home-image-box-01").animate ({width: "100%", }, 500);
		  	console.log ("tes");
		};
	});

	$(function() {
  $('#home-image-box-03').bind("tap", tapHandler);
		function tapHandler (event) 
		  {
		  	$("#home-image-box-04").fadeTo(500,0).hide();
		  	$("#home-image-box-03").animate ({width: "66%", }, 500);

		};
	});


});