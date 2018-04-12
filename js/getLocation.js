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
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	
	$.getJSON(url).done(function(location) {
		let city = location.results[0].address_components[3].long_name;
		let state = location.results[0].address_components[5].long_name;

		document.getElementById('autocomplete').value = city + ', ' + state;
		getWeather(lat, long);
		updateHeader(city);
	});

	// Removes splashscreen if it is still visible
	if (document.getElementById("splashscreen")) {
		removeSplash();
	}
}

// Implements Google Autocomplete, and updates HTML and finds weather based on selection
$(function searchLocation() {

	// Autocomplete and listener for main search bar
	let autocomplete = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'));
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		let place = this.getPlace();
		let lat = place.geometry.location.lat();
		let long = place.geometry.location.lng();
		let city = place.address_components[3].long_name;
		getWeather(lat, long);
		updateHeader(city);
	});

	// Autocomplete and listener for splashscreen search bar
	let splashcomplete = new google.maps.places.Autocomplete(document.querySelector('#splashsearch'));
	google.maps.event.addListener(splashcomplete, 'place_changed', function() {
		var splashPlace = this.getPlace();
		var splashLat = splashPlace.geometry.location.lat();
		var splashLong = splashPlace.geometry.location.lng();
		var splashCity = splashPlace.address_components[3].long_name;
	});

	// Trying to get search field to only send results on click of search button
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
	const weatherKey = '014160f48f5c2882a6f60dcbeb59425e';

	// For testing purposes, cors-anywhere has been added to allow access to the Dark Sky API locally
	$.getJSON('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long).done(function(data) {
		
		// Update HTML to reflect retrieved weather data
		$('#temp').html(Math.round(data.currently.temperature) + '°F');
		$('#condition').html(data.minutely.summary);
		$('#wind').html('<strong>Wind:</strong> ' + Math.round(data.currently.windSpeed) + ' mph');
		$('#humidity').html('<strong>Humidity:</strong> ' + Math.round(data.currently.humidity * 100) + '%');
		$('#dewpoint').html('<strong>Dew Point:</strong> ' + Math.round(data.currently.dewPoint) + '°');
		$('#pressure').html('<strong>Pressure:</strong> ' + Math.round(data.currently.pressure) + ' mb');
		$('#feelslike').html('<strong>Feels Like:</strong> ' + Math.round(data.currently.apparentTemperature) + '°');
		$('#sunrise').html('<strong>Sunrise:</strong> ' + getTime(data.daily.data[0].sunriseTime));
		$('#sunset').html('<strong>Sunset:</strong> ' + getTime(data.daily.data[0].sunsetTime));
		$('#chanceprecip').html('<strong>Precipitation:</strong> ' + Math.round(data.currently.precipProbability * 100) + '%');
		$('#hourlysummary').html(data.hourly.summary);
		$('#dailysummary').html(data.daily.summary);

		// Update hourly data
		for (let j = 1; j < 11; j++) {
			document.getElementById('hourtime' + j).innerHTML = getTime(data.hourly.data[j].time);
			document.getElementById('hourtemp' + j).innerHTML = Math.round(data.hourly.data[j].temperature) + '°';
		}

		// Update daily data
		for (let j = 1; j < 8; j++) {
			document.getElementById('dayofweek' + j).innerHTML = getDayOfWeek(data.daily.data[j].time);
			document.getElementById('high' + j).innerHTML = Math.round(data.daily.data[j].temperatureHigh) + '°';
			document.getElementById('low' + j).innerHTML = Math.round(data.daily.data[j].temperatureLow) + '°';
		}

		// Loads Skycons, and adds the icon for current conditions to the page
		let icons = new Skycons({'color': '#000000'}),
     	list  = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog'], i;

  		for(i = list.length; i--;) {
			let weatherType = list[i], elements = document.getElementsByClassName(weatherType);

			for (e = elements.length; e--;){
   				icons.set(elements[e], weatherType);
			}
		}

		// Adds icons to page
		icons.add(document.getElementById('icon'), data.currently.icon);
		
		for (let i = 1; i < 11; i++) {
			icons.add(document.getElementById('houricon' + i), data.hourly.data[i].icon);
		}
		for (let j = 1; j < 8; j++) {
			icons.add(document.getElementById('dayicon' + j), data.daily.data[j].icon);
		}

 		icons.play();
	});
}

// Returns time of day in 00:00 AM/PM format based off time retrieved from JSON data
function getTime(unixTime) {

	// Convert from milliseconds to seconds
	let jsTime = new Date(unixTime * 1000);
	let hour = 0;
	let meridiem = '';

	switch (jsTime.getHours()) {
		case 0:
			hour = 12;
			meridiem = 'AM';
			break;
		case 12:
			hour = 12;
			meridiem = 'PM';
			break;
		default:
			if (jsTime.getHours() < 12) {
				hour = jsTime.getHours();
				meridiem = 'AM';
			} else {
				hour = (jsTime.getHours() - 12);
				meridiem = 'PM';
			}
	}

	let min = jsTime.getMinutes() < 10 ? '0' + jsTime.getMinutes() : jsTime.getMinutes();
	let time = hour + ':' + min + ' ' + meridiem;

	return time;
}

// Returns day of the week based off JSON data
function getDayOfWeek(unixTime) {

	// Convert from milliseconds to seconds
	let jsTime = new Date(unixTime * 1000);
	let day = '';

	switch (jsTime.getDay()) {
		case 0:
			day = 'Sun';
			break;
		case 1:
			day = 'Mon';
			break;
		case 2:
			day = 'Tue';
			break;
		case 3:
			day = 'Wed';
			break;
		case 4:
			day = 'Thu';
			break;
		case 5:
			day = 'Fri';
			break;
		case 6:
			day = 'Sat';
			break;
		default:
			console.log('Day of week could not be retrieved.');
	}

	return day;
}

// Alerts user when their location cannot be found
function locationError() {
	window.alert('Unable to retrieve location.');
}

// Updates current header to reflect selected location
function updateHeader(city) {
	document.getElementById('currentheader').innerHTML = 'Currently in ' + city;
	$('#faveicon').fadeIn();
}

function initMap(position) {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40, lng: -83},
		zoom: 8,
		disableDefaultUI: true
	});
}