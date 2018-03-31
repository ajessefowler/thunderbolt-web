
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, locationError);
	} else {
		window.alert('Location not supported. Please enter your location.');
	}
}

function showPosition(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	
	// Set the HTML to reflect the retrieved location
	$.getJSON(url).done(function(location) {
		document.getElementById('autocomplete').value = location.results[0].address_components[3].long_name + ', ' + location.results[0].address_components[5].long_name;
	});
}

function locationError() {
	window.alert('Unable to retrieve location.');
}