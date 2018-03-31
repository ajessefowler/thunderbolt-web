
$(function() {
	$('#autocomplete').focus(function() {
		$('#searchbox').css('box-shadow', '0px 1px 7px #212121');
	});
	$('#autocomplete').blur(function() {
		$('#searchbox').css('box-shadow', '0px 0px 5px #666666 inset');
	});
});