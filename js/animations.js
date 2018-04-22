/*
	Animations for search boxes and splashscreen
*/

var splashRemoved = false;

// Animate the splash screen on first load
$(function() {
	splashRemoved = false;
	$('#splashheader').velocity('fadeIn', { delay: 400, duration: 700 });
	$('#splashsearchdiv')
		.velocity({ top: -8 }, { delay: 750, duration: 270, easing: 'spring'})
		.velocity({ top: 0}, {delay: 0, duration: 100, easing: 'spring'});
});

// Slide menu in and out
$(function() {

	$('#menu').on('click', '#menubutton', function() {
		$('#menu').velocity({ left: 0 }), { duration: 180, easing: 'spring' };
	});

/*	$('#menubutton').on('click', function() {
		$('#menu').velocity({ left: 0 }), { duration: 180, easing: 'spring' };
	});*/

	$('#closemenu').click(function() {
		$('#menu').velocity({ left: -240 }), { duration: 180, easing: 'spring' };
	});
})

// Hides splashscreen and re-enables scrolling
function removeSplash() {
	setTimeout(function() {
		document.getElementById('splashsearchdiv').parentNode.removeChild(document.getElementById('splashsearchdiv'));
	}, 400);
	$('#splashsearchdiv')
		.velocity({ top: -8 }, { duration: 100, easing: 'spring'})
		.velocity({ top: 500 }, { duration: 200, easing: 'spring'});
	$('#splashheader').velocity("fadeOut", { delay: 200, duration: 250 });
	$('#maincontainer').velocity("fadeIn", { delay: 700, duration: 400 });
	document.querySelector('header')
		.velocity({ top: 0 }, { delay: 700, duration: 400, easing: 'spring'})
	$('body').delay(600).css('overflow','auto');
	splashRemoved = true;
}

// Animates the border radii and shadows on focus and blur
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
		$('#splashlocate').velocity({
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			borderBottomLeftRadius: 3,
			borderBottomRightRadius: 3
		}, { duration: 200 });
		$('#splashlocate').css('box-shadow', '0px 1px 5px #000000');
	});

	$('#splashsearch').blur(function() {
		$('#splashlocate').velocity({
			borderTopLeftRadius: 25,
			borderTopRightRadius: 25,
			borderBottomLeftRadius: 25,
			borderBottomRightRadius: 25
		}, { duration: 200 });
		$('#splashlocate').css('box-shadow', '0px 0px 7px #666666 inset');
	});
});