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

	if (document.getElementById("splashscreen")) {
		removeSplash();
	}
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
		var splashPlace = this.getPlace();
		var splashLat = splashPlace.geometry.location.lat();
		var splashLong = splashPlace.geometry.location.lng();
		var splashCity = splashPlace.address_components[3].long_name;
	});

	$('#splashsearchbutton').click(function() {
		console.log('fired');
		console.log(splashPlace);
		getWeather(splashLat, splashLong);
		updateHeader(splahCity);
		removeSplash();
	});
});

// Find the weather, given the user's latitude and longitude
function getWeather(lat, long) {
	let weatherKey = '014160f48f5c2882a6f60dcbeb59425e';

	// For testing purposes, cors-anywhere has been added to allow access to the Dark Sky API locally
	$.getJSON('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long).done(function(data) {
		let temp = Math.floor(data.currently.temperature);
		let condition = data.minutely.summary;
		let windSpeed = Math.floor(data.currently.windSpeed);
		let humidity = (data.currently.humidity * 100);
		let dewPoint = Math.floor(data.currently.dewPoint);
		$('#temp').html(temp + '°F');
		$('#condition').html(condition);
		$('#wind').html('<strong>Wind:</strong> ' + windSpeed + ' mph');
		$('#humidity').html('<strong>Humidity:</strong> ' + humidity + '%');
		$('#dewpoint').html('<strong>Dew Point:</strong> ' + dewPoint + '°F');

		// Loads Skycons, and adds the icon for current conditions to the page
		let icons = new Skycons({'color': '#000000'}),
     	list  = ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"], i;

  		for(i = list.length; i--; ) {
			let weatherType = list[i], elements = document.getElementsByClassName( weatherType );

			for (e = elements.length; e--;){
   				icons.set( elements[e], weatherType );
			}
		}

		icons.add(document.getElementById("icon"), data.currently.icon);
 		icons.play();
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