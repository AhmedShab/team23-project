currentPage = 1;

$(document).ready (function() {

// $(function() {
//   $('.create-button').bind("tap", tapHandler);

// 		function tapHandler (event) 
// 		  {
// 		 changePage(1);
// 		};
// 	});

//*** Page one controls ***//



	$(function(){
	  // Bind the swipeleftHandler callback function to the swipe event on div.box
	  $( "#page-one" ).on( "swipeleft", swipeleftHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swipeleftHandler( event ){
	    $('#page-one').animate({'left': '-800px',}, 500);
	    $('#page-two').animate({'left': '0px',}, 500);
	  }
	});


//*** Page two controls	 ***//
	$(function() {

  $('.create-button').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	changePage(2);
		}});



	$(function(){
	 $( "#page-two" ).on( "swipeleft", swipeleftHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swipeleftHandler( event ){
	    $('#page-two').animate({'left': '-800px',}, 500);
	    $('#page-three').animate({'left': '0px',}, 500);
	  }});

	$(function(){
	  // Bind the swipeleftHandler callback function to the swipe event on div.box
	  $( "#page-two" ).on( "swiperight", swiperightHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swiperightHandler( event ){
	    $('#page-one').animate({'left': '0px',}, 500);
	    $('#page-two').animate({'left': '768px',}, 500);
	  }});


//*** Page three controls ***//
	$(function(){
	 $( "#page-three" ).on( "swipeleft", swipeleftHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swipeleftHandler( event ){
	    $('#page-three').animate({'left': '-800px',}, 500);
	    $('#page-four').animate({'left': '0px',}, 500);
	  }});

	$(function(){
	  // Bind the swipeleftHandler callback function to the swipe event on div.box
	  $( "#page-three" ).on( "swiperight", swiperightHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swiperightHandler( event ){
	    $('#page-two').animate({'left': '0px',}, 500);
	    $('#page-three').animate({'left': '768px',}, 500);
	  }});


//*** Page four controls ***//
	$(function(){
	  // Bind the swipeleftHandler callback function to the swipe event on div.box
	  $( "#page-four" ).on( "swiperight", swiperightHandler );
	 
	  // Callback function references the event target and adds the 'swipeleft' class to it
	  function swiperightHandler( event ){
	    $('#page-three').animate({'left': '0px',}, 500);
	    $('#page-four').animate({'left': '768px',}, 500);
	  }});


});


function changePage(page) {
// $('#bottom-navbar > ul > li').css('background-colour','none');
// $(this).css('background-colour', 'red');
currentPage = page;
console.log(currentPage);

if (currentPage == 2) {

	

}
	
}


