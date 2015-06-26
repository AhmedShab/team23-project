var cloudFirstTime = 1;
var userHappy = 1;
var cloudIconMid = 1;
var name;
var tag_name = " ";
$(document).ready (function() {

// $(".white-fader").fadeTo(1500, 0);

create_pageNumber(1);



	// $(function () {
	// 	 $('#img-01').bind("tap", tapHandler);
	// 	function tapHandler (event) 
	// 	  {
	// 	  	$('#home-info-01').fadeTo(3000,0.9);
	// 	  	$('#img-01').fadeTo(3000,0.7);
	// 	  	console.log("worked");
	// 	   }
	// });

// ** MINI NAV SCRIPTING ** //

// ** MINI NAV SCRIPTING ** //

$(function() {

  $('.mic-icon').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	$(".input-nav-slider").animate ({left: "445px", }, 500);
		   	$(".input-selector-right").css("background-image",  "url(img/icons/mic_icon.png)");

		};
	});


$(function() {

  $('.camera-icon').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		 	$('#uploaded-img-01').css('display', 'inline-block');
		  	$('#player').css('display', 'none');
		 	$('#iS-camera').css('display', 'block');
		  	$('#iS-video').css('display', 'none');
		  	$(".input-nav-slider").animate ({left: "90px", }, 500);
		  	$(".input-selector-right").css("background-image",  "url(img/icons/camera_icon.png)");


		};
	});


$(function() {

  $('.video-icon').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	$('#player').css('display', 'inline-block');
		  	$('#uploaded-img-01').css('display', 'none');
		 	$('#iS-camera').css('display', 'none');
		  	$('#iS-video').css('display', 'block');
		  	$(".input-nav-slider").animate ({left: "280px", }, 500);
		  	$(".input-selector-right").css("background-image",  "url(img/icons/video_icon.png)");  


		};
	});




//Press space to call function <-- good for testing code/jquery cmds
$('body').keyup(function(e){
  if(e.keyCode == 32){

	 	

   }
});

//Navigation Button

			$(function() {
		   $('.create-process-back').bind("tap", tapHandler);
		function tapHandler (event) 
		{
			createPageManager -=1;
			createPageChange(createPageManager);

		}});



});


function createPageChange (page) {
//this does the fading between pages - this is also what gets called to change the pages
$(".white-fader").fadeTo(1000, 1, function () {
create_pageNumber (page);
$(".white-fader").fadeTo(1000, 0);
	});
}




function create_pageNumber (pageNum) {
//this handles all the css and positioning changes
createPageManager = pageNum;
$('.content-wrapper').find('*').removeAttr("style");






if (createPageManager <= 4) {
$('.createpage-nav').removeAttr("style");
$('.process-heart').removeAttr("style");
$('.create-section-02').css("display", 'none');
$('#create-box-01').css("display", 'none');
$('#drawing-box').css("display", 'none');
$('.tag-cloud-wrapper').css("display", 'none');
$('.title-section').css("display", 'none');
$('.create-process-back').css("display", 'inline-block');

}


if (createPageManager >= 2 && createPageManager <=4) {
	$('.create-process-back').css("display", 'inline-block');
}

if (createPageManager >= 1 && createPageManager <= 3) {

		// $('.create-section-01').css({
		// 'border': '1px solid #d2cbc2',
		// 'background-color': 'white',
		// 'width': "690px",
		// 'height': '810px',
		// 'margin': '25px',
		// });
}

//Lets Get Started Page.
if (createPageManager === 1) {
			$('#title1').focus();
		// $('#title1').focus();	
		$('.process-heart').attr('src', 'img/icons/heart_icon_01.png');

		$('.create-process-back').css("display", 'none');


	$('.title-section').css("display", 'block');
	$('.title-help-wrapper').css("display", 'block');

	$('#create-box-01').css({
		"width": '100%',
		'display': 'block',
});

//Styling for Title Input
	$('#title1').css ({
		'display': 'block',
		'text-align': 'center',
		'position': 'absolute',	
		'top': '300px',
		})



		//add changes		
		var title =	$("#title1").val();

	$('#title1').focus (function() {


		$(this).removeAttr('placeholder');
		$('.getStarted-btn').delay(1000).css("display", 'block').animate({'top': '140px', 'opacity': '1'}, 2000);
		$('#title-text-help').delay(1000).fadeTo(500, 0);

	})

	$('#title1').focusout (function() {
		if (title.length >=0) {
			$(this).attr('placeholder', "Memory Title");		
		}
	});

}









else if (createPageManager === 2) {
			 	// cloudFirstTime = 1;
	
		$('.process-heart').attr('src', 'img/icons/heart_icon_02.png');


		$('#create-box-01').css({
			"width": '100%',
			'display': 'block'});



	$('.tag-cloud-wrapper').css({"display": 'block',});
	$('.tag-cloud-help').css({"display": 'block',});
	$('#choosen-cloud-text').css({
		"width": '70%',
		"left": "200px",
		'top': "-170px",
	});

		if (cloudFirstTime == 1) {

				$(function() {

		   $('.close').bind("tap", tapHandler);
		function tapHandler (event) 
		  {

		  		if (hashtagCount >=2 && hashtagCount <=4) {
		  cloudBtnAppear ();	
		  }
		  }});
				
		}

		if (cloudIconMid == 0) {


		}


	}

	else if (createPageManager === 3) {

		$('.process-heart').attr('src', 'img/icons/heart_icon_03.png');

		paintingPosX = 220;
		paintingPosY = 350;
				 	newCanvas ();
	$('#drawing-box').css("height", '700px');
	$('.drawing-help').css("display", 'block');
	$('#downloadLnk').css("display", 'none');
	$('#drawing-box').css({
		'width': '100%',
		"display": 'block',
		'height' : '700px;'
		});

	$('#paint-slider').css({
		'top': '0px',
		'left': '-90px',
		});

	$('#content').css({
		'margin-left': '180px',
		});



	
				$('#drawing-box').fadeTo(6000, 1, function () {
					$('.drawing-help-btn').css ('display', 'block');
					// $('.drawing-help > h3').fadeTo(1500, 0);
			  	 	$('.drawing-help-btn').animate({'top': '650px', 'opacity': '1'}, 1500);	
			  	 	console.log("tick");				
				});
	}
	else if (createPageManager === 4)  {
		$('.create-section-02').css({

		'width': "630px",
		'padding': "0px 30px 0 30px",
		'height': '810px',
		});


		$('.process-heart').attr('src', 'img/icons/heart_icon_04.png');

		sadEmotionEntered ();
		$(".book-help").css("display", "block");
		$('.create-section-01').css ('display', 'none');
		$('.create-section-01').css ('display', 'none');
		$('.create-section-02').css({
			// "width": '100%',
			'display': 'block'});
		$('.submitButton').css ('display', 'none');

	}



else if (createPageManager == 5) {
$('.process-heart').attr('src', 'img/icons/Heart_full.gif');
sadEmotionEntered ();

$('#content-main-wrapper').css({
	'border': '1px solid #d2cbc2',
		'background-color': 'white',
		'width': "630px",
		'padding': "0px 30px 0 30px",
		'height': '780px',
		'margin': '25px',
});

$('.process-heart').attr('onclick', 'submitMemory()');

paintingPosX = 384;
paintingPosY = 74;

$('.create-process-back').css("display", 'none');
$(".book-help").css("display", "none");
$('#input-tag-cloud').css ({"width": "20%", "left": "5%", "top": "0%", "opacity": "0.1" 	});

$('.createpage-nav').css({
'top': '875px',
'left': '0px',
});

$('.process-heart').css({
'width': '75px',
'float': 'none',
'top': "-105px",
'left': '327px',
});
}





// });

};


function cloudBtnAppear () {


$('.cloud-continue-btn').css({'display': 'block',});
		  	 	$('.cloud-continue-btn').animate({'top': '300px', 'opacity': '1'}, 1000);
		  	 	//change this. //This changes button positioning
		 	cloudFirstTime = 0;

		 

};



function sadEmotionEntered () {

if (userHappy == 0) {

	$('#text-area-01').animate({'height': '175px'}, 1500);
	$('#text-area-02').fadeTo(1500, 1);
	$('#text-area-02').css({
	'display': 'inline-block',
	});

}
else {
	$('#text-area-02').fadeTo(1000,0);
	$('#text-area-01').animate({'height': '350px'}, 1500, function () {
		$('#text-area-02').css({
		'display': 'none',
		});
	});
}

} 

