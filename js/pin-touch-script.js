//Created by Regan Petrie

$(document).ready (function() {


var speed = 500;

var pinIn_Opacity = 0.3;

var pinIn_width = $('.pin-holder-in').css("width");
var pinIn_height = $('.pin-holder-in').css("height");

var pinOut_width = $('.pin-holder-out').css("width");
var pinOut_height = $('.pin-holder-out').css("height");



$(function() {

  $('.pin-wrapper > p').bind("tap", tapHandler);

		function tapHandler (event) 
		  {		$(this).siblings('div').fadeTo(100,1);

				$(this).siblings('div').children('.pin-holder-in').css('opacity', pinIn_Opacity);
						  	console.log("it worked");
		  		$(this).siblings('div').children('.pin-holder-in').animate({width: pinOut_width, height: pinOut_height},speed, function () {
			  			$('.pin-holder-in').css({'opacity': '0', 'width': pinIn_width, 'height': pinIn_height}); 
			  			$('.pin-holder-out').fadeTo(100,0);
		  	});

		};
	});

});



function  touched() {


}