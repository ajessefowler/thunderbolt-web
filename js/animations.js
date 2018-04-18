/*
	Animations for search boxes and splashscreen
*/

$(function() {
	$('#splashscreen').velocity('fadeIn', { delay: 0, duration: 700 });
	$('#splashsearchdiv')
		.velocity({ top: -8 }, { delay: 700, duration: 300, easing: 'spring'})
		.velocity({ top: 0}, {delay: 0, duration: 100, easing: 'spring'});
});

// Hides splashscreen and re-enables scrolling
function removeSplash() {
	$('#splashsearchdiv')
		.velocity({ top: -8 }, { duration: 100, easing: 'spring'})
		.velocity({ top: 500 }, { duration: 300, easing: 'spring'});
	$('#splashscreen').velocity("fadeOut", { duration: 400 });
	$('#maincontainer').velocity("fadeIn", { delay: 550, duration: 400 });
	document.querySelector('header').velocity("fadeIn", { delay: 550, duration: 400});
	document.querySelector('footer').velocity("fadeIn", { delay: 550, duration: 400 });
	$('body').css('overflow','auto');
}

// Slides favorites menu in and out on click
function toggleFavoritesMenu() {
	$('#favoritelocations').slideToggle();
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