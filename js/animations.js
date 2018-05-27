/*
	Animations for search boxes and splashscreen
*/

var splashRemoved = false;

// Animate the splash screen on first load
$(function() {
	splashRemoved = false;
	$('#splashheader').velocity('fadeIn', { delay: 200, duration: 1000 });
	$('#splashsearchdiv')
		.velocity({ top: -8 }, { delay: 1000, duration: 270, easing: 'spring'})
		.velocity({ top: 0}, {delay: 0, duration: 100, easing: 'spring'});
});

// Slides settings menu in and out
$(function() {
	let settingsOpen = false;
	$(document).on('click', '#settingsbtn', function() {
		if (!settingsOpen) {
			$('#settingspanel').velocity({ bottom: 84 }, { duration: 150, easing: 'spring' });
			settingsOpen = true;
		} else {
			$('#settingspanel').velocity({ bottom: 36 }, { duration: 150, easing: 'spring' });
			settingsOpen = false;
		}
	});
})

// Animates settings slider and updates units on page
$(function() {
	let rightSwitchPos = 0;
	let leftSwitchPos = 0;

	$(document).on('click', '#rightswitch', function() {
		if (rightSwitchPos === 0) {
			rightSwitchPos = 1;
			$('#rightslider').velocity({ left: 13 }, { duration: 150, easing: 'spring' });
		} else {
			rightSwitchPos = 0;
			$('#rightslider').velocity({ left: 0 }, { duration: 150, easing: 'spring' });
		}
	});

	$(document).on('click', '#leftswitch', function() {
		if (leftSwitchPos === 0) {
			leftSwitchPos = 1;
			$('#leftslider').velocity({ left: 13 }, { duration: 150, easing: 'spring' });
		} else {
			leftSwitchPos = 0;
			$('#leftslider').velocity({ left: 0 }, { duration: 150, easing: 'spring' });
		}
	});
});

// Slide menu in and out
$(function() {

	$(document).on('click', '#menubutton', function() {
		$('#menu').velocity({ left: 10 }, { duration: 370, easing: 'spring' });
		document.getElementById('menushade').style.display = '';
	});

	$(document).on('click', '#closemenu', function() {
		$('#menu').velocity({ left: -400 }, { duration: 370, easing: 'spring' });
		document.getElementById('menushade').style.display = 'none';
	});
});

// Hides splashscreen and re-enables scrolling
function removeSplash() {
	if (!splashRemoved) {
		setTimeout(function() {
			document.getElementById('splashsearchdiv').parentNode.removeChild(document.getElementById('splashsearchdiv'));
		}, 400);
		$('#splashsearchdiv')
			.velocity({ top: -8 }, { duration: 100, easing: 'spring' })
			.velocity({ top: 500 }, { duration: 200, easing: 'spring' });
		$('#splashheader').velocity("fadeOut", { delay: 200, duration: 250 });
		splashRemoved = true;
		addContent();
	}
}

function addContent() {
	$('#currently').velocity({ top: 0 }, { delay: 900, duration: 500, easing: 'spring' });
	$('#hourly').velocity({ top: 0 }, { delay: 1100, duration: 500, easing: 'spring' });
	$('#daily').velocity({ top: 0 }, { delay: 1300, duration: 500, easing: 'spring' });
	$('#radar').velocity({ top: 0 }, { delay: 1500, duration: 500, easing: 'spring' });
	document.querySelector('header').velocity({ top: 0 }, { delay: 600, duration: 300, easing: 'spring'});
	setTimeout(function(){ $('body').css('overflow','auto'); }, 2000);
}

// Animates the border radii and shadows on focus and blur. Each corner radius must be animated separately.
$(function() {
	$('#autocomplete').focus(function() {
		$('#searchbox').velocity({
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			borderBottomLeftRadius: 3,
			borderBottomRightRadius: 3
		}, { duration: 200 });
		$('#searchbox').css('box-shadow', '0px 1px 6px #212121');
	});

	$('#autocomplete').blur(function() {
		$('#searchbox').velocity({
			borderTopLeftRadius: 15,
			borderTopRightRadius: 15,
			borderBottomLeftRadius: 15,
			borderBottomRightRadius: 15
		}, { duration: 200 });
		$('#searchbox').css('box-shadow', '0px 0px 3px #666666 inset');
	});

	$('#splashsearch').focus(function() {
		$('#splashlocate').css('box-shadow', '0px 1px 5px #424242');
	});

	$('#splashsearch').blur(function() {
		$('#splashlocate').css('box-shadow', '0px 1px 3px #424242');
	});
});

// Calculates height of hourly content based on hourly summary
function resizeHourly() {
	let hourlyHeight = 750 - document.getElementById('hourlyheader').clientHeight;
	document.getElementById('hourlycontent').style.height = hourlyHeight + 'px';
}

// Resizes hourly content whenever window is resized to maintain proper look
window.addEventListener('resize', resizeHourly);