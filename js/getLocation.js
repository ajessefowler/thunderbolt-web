
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getWeather, locationError);
	} else {
		window.alert('Location not supported. Please enter your location.');
	}
}

function getWeather(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	let weatherKey = '60c417a1be6626f37fa6014a5b8abba8';
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	
	// Set the HTML to reflect the retrieved location
	$.getJSON(url).done(function(location) {
		
		let city = location.results[0].address_components[3].long_name;
		document.getElementById('autocomplete').value = city + ', ' + location.results[0].address_components[5].long_name;
		document.getElementById('currentheader').innerHTML = 'Currently in ' + city;
		$('#faveicon').fadeIn();

		$.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&APPID=' + weatherKey).done(function(data) {
			let temp = Math.floor(9 / 5 * (data.main.temp - 273) + 32);
			$('#description').html(temp + '°F');
		});
	});
}

function locationError() {
	window.alert('Unable to retrieve location.');
}