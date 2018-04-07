/*
	Obtains user's location either automatically or manually, then retrieves weather data based on location
*/

// Automatically obtains the user's location, if supported
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(findCoords, locationError);
	} else {
		window.alert('Location not supported. Please enter your location.');
	}
}

/* 
	Finds the user's coordinates and updates the HTML to reflect the user's location. 
	Also finds the weather based on found location
*/
function findCoords(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	
	$.getJSON(url).done(function(location) {
		let city = location.results[0].address_components[3].long_name;
		let state = location.results[0].address_components[5].long_name;

		document.getElementById('autocomplete').value = city + ', ' + state;
		getWeather(lat, long);
		updateHeader(city);
	});
}

// Implements Google Autocomplete, and updates HTML and finds weather based on selection
$(function searchLocation() {
	let autocomplete = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'));
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		let place = this.getPlace();
		let lat = place.geometry.location.lat();
		let long = place.geometry.location.lng();
		let city = place.address_components[3].long_name;
		getWeather(lat, long);
		updateHeader(city);
	});

	let splashcomplete = new google.maps.places.Autocomplete(document.querySelector('#splashsearch'));
	google.maps.event.addListener(splashcomplete, 'place_changed', function() {
		let place = this.getPlace();
		let lat = place.geometry.location.lat();
		let long = place.geometry.location.lng();
		let city = place.address_components[3].long_name;
		getWeather(lat, long);
		updateHeader(city);
	});
});

// Find the weather, given the user's latitude and longitude
function getWeather(lat, long) {
	let weatherKey = '014160f48f5c2882a6f60dcbeb59425e';

	// For testing purposes, cors-anywhere has been added to allow access to the Dark Sky API locally
	$.getJSON('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long).done(function(data) {
		let temp = Math.floor(data.currently.temperature);
		$('#description').html(temp + '°F');
	});
}

// Alerts user when their location cannot be found
function locationError() {
	window.alert('Unable to retrieve location.');
}

// Updates currently header to reflect user's location
function updateHeader(city) {
	document.getElementById('currentheader').innerHTML = 'Currently in ' + city;
	$('#faveicon').fadeIn();
}