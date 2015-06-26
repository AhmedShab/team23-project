//Coded By Regan Petrie

var temp_ana = 1;


$(document).ready (function() {

$(".white-fader").fadeTo(1500, 0);




//Regan Delete **********************************/

 $('#content-main-wrapper-graph > img').bind("tap", tapHandler);

		function tapHandler (event) 
		  {
		  	temp_ana +=1;
		  	console.log(temp_ana);

		  	if (temp_ana == 2)  {
		  		$("#content-main-wrapper-graph > img").attr('src', 'img/analytics_02.jpg');
		  	}
	};







//END OF TEMP **********///



// $(function() {

//   $('.load-arrow').bind("tap", tapHandler);

// 		function tapHandler (event) 
// 		  {
// 		  	//change this to swipe right animation.
// 		  	$(".white-fader").fadeTo(1500, 1, function () {
// 		  		window.location.href = 'retrieved.html';
// 		  	});
// 		};
// 	});




// Mini Menu **************//









});

