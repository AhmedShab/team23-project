//Coded By Regan Petrie

var hashtagCount = 0;
var tag_btnActive= 0;

$(document).ready (function() {




//when cloud icon is clicked




//closes hashtag cloud
$(function () {
		 $('.close').bind("tap", tapHandler);
		function tapHandler (event) 
		  {	
	  			if (hashtagCount >=2) {
			  	$('.black-fader').fadeTo(500,0).delay(500).css("display","none");
		   		}

		   		if (hashtagCount < 2) {
		   			$('.black-fader-error').text("Please add atleast two hastags");
		   			$('.black-fader-error').fadeTo(1000,1).delay(1500).fadeTo(2000,0);

		   		}
		   }
		});

//when hastag is tapped, it is added to body of page/section.
$(function () {
		 $('.hashtag-box > h2').bind("tap", tapHandler);
		function tapHandler (event) 
		  {

		  		if (hashtagCount >= 4) {
		   			$('.black-fader-error').text("Limit Reached");
		   			$('.black-fader-error').fadeTo(1000,1).delay(1500).fadeTo(2000,0);
					console.log("5 P")
				}   

			  	if (hashtagCount <4) {
			  	hashtagCount +=1;
			  	$(this).css( 'color', "#E7853C");
			  	$('#choosen-cloud-text').append( "<p>" + "#" + ($(this).text()) + "</p>" );
			  	console.log(hashtagCount);
				}

				
		   }

});


$(function () {
		 $('#input-tag-cloud').bind("tap", tapHandler);
		function tapHandler (event) 
		  {
		  	$('.black-fader').css("display","fixed").fadeTo(500,.97);
		  	$('#input-tag-cloud').css ({"width": "20%", "left": "5%", "top": "0%", "opacity": "0.1" 	});
		  	console.log("worked");
		   }
});




$(function () {
		 $('#showtag-btn').bind("tap", tapHandler);
		function tapHandler (event) 

		  {
		  	if (tag_btnActive == 1) {
		  	$('#showtag-btn').attr('src', 'img/icons/addtag_01.gif')
		  	$('#custom-tag-section').hide();
		  	console.log("#" + ($("#addtag-textarea").val()));
		 	$('.hashtag-box').append( "<h2 style='color: #E7853C'>" + ($("#addtag-textarea").val()) + "</h2>" );
		 			  	console.log ($(this).text());

		 	//this appends custom text to body within create page
		  	$('#choosen-cloud-text').append( "<p>" + "#" + ($("#addtag-textarea").val()) + "</p>" );
		  	$("#addtag-textarea").val("");


		 	//This sets hastag to being selected

		  	tag_btnActive = 0;
		  	}
		  	else if (tag_btnActive ==0) {
		  	$('#custom-tag-section').show();
		  	tag_btnActive = 1;
		  	}
		   }
		});




});


