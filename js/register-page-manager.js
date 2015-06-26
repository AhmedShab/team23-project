var registerProcess =0;

$(document).ready (function() {

// registerPage(0); //used for test - comment out

});



function registerPage(num) {

	registerProcess = num;
		$('.register-section').removeAttr('style', 'none');
		$('.register-section').css('display', 'none');

	if (registerProcess ==1) {
		$('.register-get-started').css({
			'display': 'block',
			'top': '1024px',
			}).animate({'top': '0px',}, 1500);	
	}

		if (registerProcess ==1.1) {
		$('.register-terms').css({
			'display': 'block',
			'top': '1024px',
			}).animate({'top': '0px',}, 1500);	
	}


	else if (registerProcess ==2) {
		$('.register-get-started').animate({'left': '-1024px',}, 800).css({
			'display': 'block',
			})


		$('.register-page2').css({
			'display': 'block',
			'top': '0px',
			'left': '768px',
			}).animate({'left': '0px',}, 700);	
	}

	else if (registerProcess ==3) {
		$('.register-page2').animate({'left': '-1024px',}, 800).css({
			'display': 'block',
			})


		$('.register-page3').css({
			'display': 'block',
			'top': '0px',
			'left': '768px',
			}).animate({'left': '0px',}, 700);	
	}


	else if (registerProcess ==4) {
		$('.register-page3').animate({'left': '-1024px',}, 800).css({
			'display': 'block',
			})


		$('.register-page4').css({
			'display': 'block',
			'top': '0px',
			'left': '768px',
			}).animate({'left': '0px',}, 700);	
	}


}