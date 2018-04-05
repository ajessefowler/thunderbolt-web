
$(function() {
	let searchBox = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'));
	searchBox.addListener('places_changed', function() {});
	
	$('#autocomplete').focus(function() {
		$('#searchbox').animate({
			borderTopLeftRadius: 5,
			borderTopRightRadius: 5,
			borderBottomLeftRadius: 5,
			borderBottomRightRadius: 5
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
});