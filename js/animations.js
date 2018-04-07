/*
	Animations for search boxes and splashscreen
*/

// Hides splashscreen and re-enables scrolling
function removeSplash() {
	$('#splashscreen').fadeOut();
	$('html,body').css('overflow','auto');
}

// Animates the border radii and shadows on focus and blur. Each corner radius must be animated separately to function.
$(function() {
	$('#autocomplete').focus(function() {
		$('#searchbox').animate({
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			borderBottomLeftRadius: 3,
			borderBottomRightRadius: 3
		}, 200);
		$('#searchbox').css('box-shadow', '0px 1px 6px #212121');
	});

	$('#autocomplete').blur(function() {
		$('#searchbox').animate({
			borderTopLeftRadius: 15,
			borderTopRightRadius: 15,
			borderBottomLeftRadius: 15,
			borderBottomRightRadius: 15
		}, 200);
		$('#searchbox').css('box-shadow', '0px 0px 3px #666666 inset');
	});

	$('#splashsearch').focus(function() {
		$('#splashlocate').animate({
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			borderBottomLeftRadius: 3,
			borderBottomRightRadius: 3
		}, 200);
		$('#splashlocate').css('box-shadow', '0px 1px 3px #212121');
	});

	$('#splashsearch').blur(function() {
		$('#splashlocate').animate({
			borderTopLeftRadius: 25,
			borderTopRightRadius: 25,
			borderBottomLeftRadius: 25,
			borderBottomRightRadius: 25
		}, 200);
		$('#splashlocate').css('box-shadow', '0px 0px 7px #666666 inset');
	});
});