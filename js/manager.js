var currentPage = 1;
var user_LoggedIn = false;
var loading = 0;		//Use Loading Screen
var loadingDuration=0;  //Time is in millseconds eg.
var messageGenerator;
var userTalk;


$(document).ready (function() {

// Redirects user to homescreen if they aren't logged in
user_LoggedIn = false;

if (user_LoggedIn == true) {
console.log("Regan Accidentally Left user logged in when testing... Change user_LoggedIn = false; in manager.js")
}
// user_LoggedIn = true;

// This is the page it starts on.
// changePage(1);
changePage(1);


$('#load-content-wrapper').scroll(function() {
	var search_pos = $("#load-content-wrapper").scrollTop();
	console.log(search_pos);
	if (search_pos > 300) { console.log("Far Down");}
});



});


//****Controlls For Img/Video Input Upload



//*** Page one controls ***//
$(function() {

  $('.home-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	 changePage(1);
		}});

//*** Page two controls	 ***//
	$(function() {

  $('.create-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	changePage(2);

		}});

	//*** Page three controls	 ***//

	$(function() {

  $('.search-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {

		  	changePage(3);
			$('#search-loading').css('display', 'none');
		}
	

	});






	//*** Page four controls	 ***//

$(function() {

  $('.graph-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	changePage(4);
		}});

//*** Page Five Controlls ***//
$(function() {

  $('.social-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	changePage(5);
		}});


$(function(){
  // Bind the swipeleftHandler callback function to the swipe event on div.box
  $( ".ret-content-wrapper" ).on( "swiperight", swiperightHandler );
 
  // Callback function references the event target and adds the 'swipeleft' class to it
  function swiperightHandler( event ){
 	$('#page-search').css({
 			'display': 'inline-block',
 			'position': 'absolute',
 			'left': '-769px',
 			'top': '0px'
	 	}).animate({
	 		'left': '0px',
	 	}, 500,function () {
	 						changePage(3);
 							}).removeAttr("style");


 	$('#page-retrieved').css('position', 'absolute').animate({
 		'left': '769px',
 	}, 500,function () {
 		$('#page-retrieved').removeAttr("style").css("display", 'none');
 	});
 		
 

  }
});


function changePage(num) {
// $('#bottom-navbar > ul > li').css('background-colour','none');
// $(this).css('background-colour', 'red');
$('#nav-search').css('display', 'none');
$('#nav-norm').css('display', 'block');
$('.page').css('display', 'none');
$('#bottom-navbar > ul > li').siblings().css('background-color', 'transparent');
currentPage = num;

console.log(currentPage);

if (user_LoggedIn == false && currentPage == 0.1) {
$('#login-wrapper').css('display', 'inline-block');
}
else if (user_LoggedIn == false && currentPage == 0.2) {
$('#register-wrapper').css('display', 'inline-block');
if ( registerProcess == 0) {
		registerPage(1);
	}
}
else if (user_LoggedIn == false ) {
$('#login-wrapper').css('display', 'inline-block');
}
else if (currentPage == 1) {

			loadUserMemories();
		  	$('.home-hello-box').css({
		  		'height': '10px',
		  		'opacity': '0',
		  	}).animate({'height': '64px', 'opacity': '0.9'}, 1200).delay(2000).animate({'height': '0', 'opacity': '0'}, 2000);	
$('#page-home').css('display', 'inline-block');
$('.home-button').parent().css('background-color', '#ffb001');
}

else if (currentPage == 2) {	
$('#page-create').css('display', 'inline-block');
$('.create-button').parent().css('background-color', '#ffb001');
}

else if (currentPage == 3) {
	loadMemoriesFromDB();
	$('#page-search').css('display', 'inline-block');
	$('#nav-search').css('display', 'inline-block');
	$('#nav-norm').css('display', 'none');
	$('.search-button').parent().css('background-color', '#ffb001');
	

    		$("#nav-search-input").bind("tap", searchTap);
	function searchTap (event) 
	 {
		if ($("#nav-search-input").val() == "Search for hashtag")
		{
			$("#nav-search-input").val(""); 
		}
	};
}

else if (currentPage == 3.5) {	
$('#page-retrieved').css('display', 'inline-block');
$('.search-button').parent().css('background-color', '#ffb001');
 }

else if (currentPage == 4) {
getStats();

// drawGraph().createGraph('#data-table', '.chart');

$('#page-graph').css('display', 'inline-block');
$('.graph-button').parent().css('background-color', '#ffb001');
}

else if (currentPage == 5) {
$('#page-social').css('display', 'inline-block');
$('.social-button').parent().css('background-color', '#ffb001');
}




	
}


