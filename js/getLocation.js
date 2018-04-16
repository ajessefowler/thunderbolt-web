/*
	Obtains user's location either automatically or manually, then retrieves weather data based on location
*/

// Automatically obtain the user's location, if supported
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(findCoords, locationError);
	} else {
		window.alert('Location not supported. Please enter your location.');
	}
}

// Find weather based on user's determined coordinates and update HTML
function findCoords(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let mapPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	
	$.getJSON(url).done(function(location) {
		let city = location.results[0].address_components[3].long_name;
		let state = location.results[0].address_components[5].long_name;

		document.getElementById('autocomplete').value = city + ', ' + state;
		getWeather(lat, long);
		initMap(mapPosition);
		updateHeader(city);
	});

	// Remove splashscreen if it is still visible
	if (document.getElementById("splashscreen")) {
		removeSplash();
	}
}

// Implement Google Autocomplete and find weather based on selection
function searchLocation() {

	// Autocomplete and listener for main search bar
	let autocomplete = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'));
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		document.getElementById('autocomplete').blur();
		let place = this.getPlace();
		let lat = place.geometry.location.lat();
		let long = place.geometry.location.lng();
		let mapPosition = {lat: lat, lng: long};
		let city = place.address_components[3].long_name;
		getWeather(lat, long);
		initMap(mapPosition);
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
}

// Find the weather, given the user's latitude and longitude
function getWeather(lat, long) {
	const weatherKey = '014160f48f5c2882a6f60dcbeb59425e';

	// For testing purposes, cors-anywhere has been added to allow access to the Dark Sky API locally
	$.getJSON('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long).done(function(data) {

		// Change font size of hourly summary if content is too long
		if (data.hourly.summary.length > 110) {
			document.getElementById('hourlysummary').style.fontSize = '14pt';
			document.getElementById('hourlysummary').style.paddingBottom = '12px';
		} else if (data.hourly.summary.length > 100) {
			document.getElementById('hourlysummary').style.fontSize = '15pt';
			document.getElementById('hourlysummary').style.paddingBottom = '12px';
		} else if (data.hourly.summary.length > 71) {
			document.getElementById('hourlysummary').style.paddingBottom = '10px';
		}

		// Update HTML to reflect retrieved weather data
		$('#temp').html(Math.round(data.currently.temperature) + '°F');
		$('#condition').html(data.minutely.summary);
		$('#wind').html('<strong>Wind:</strong> ' + Math.round(data.currently.windSpeed) + ' mph ' + getWindDirection(data.currently.windBearing));
		$('#humidity').html('<strong>Humidity:</strong> ' + Math.round(data.currently.humidity * 100) + '%');
		$('#dewpoint').html('<strong>Dew Point:</strong> ' + Math.round(data.currently.dewPoint) + '°');
		$('#pressure').html('<strong>Pressure:</strong> ' + Math.round(data.currently.pressure) + ' mb');
		$('#feelslike').html('<strong>Feels Like:</strong> ' + Math.round(data.currently.apparentTemperature) + '°');
		$('#sunrise').html('<strong>Sunrise:</strong> ' + getTime(data.daily.data[0].sunriseTime));
		$('#sunset').html('<strong>Sunset:</strong> ' + getTime(data.daily.data[0].sunsetTime));
		$('#chanceprecip').html('<strong>Precipitation:</strong> ' + Math.round(data.currently.precipProbability * 100) + '%');
		$('#hourlysummary').html(data.hourly.summary);
		$('#dailysummary').html(data.daily.summary);

		// Load Skycons and add the icon for current condition to the page
		let icons = new Skycons({'color': '#000000'}),
     	list  = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog'], i;

  		for (i = list.length; i--;) {
			let weatherType = list[i], elements = document.getElementsByClassName(weatherType);

			for (e = elements.length; e--;) {
   				icons.set(elements[e], weatherType);
			}
		}

		icons.add(document.getElementById('icon'), data.currently.icon);
		
		// Update hourly data and icons
		for (let i = 1; i < 13; i++) {
			document.getElementById('hourtime' + i).innerHTML = getTime(data.hourly.data[i].time);
			document.getElementById('hourtemp' + i).innerHTML = Math.round(data.hourly.data[i].temperature) + '°';
			icons.add(document.getElementById('houricon' + i), data.hourly.data[i].icon);
		}

		// Update daily data and icons
		for (let j = 1; j < 8; j++) {
			document.getElementById('dayofweek' + j).innerHTML = getDayOfWeek(data.daily.data[j].time);
			document.getElementById('high' + j).innerHTML = Math.round(data.daily.data[j].temperatureHigh) + '°';
			document.getElementById('low' + j).innerHTML = Math.round(data.daily.data[j].temperatureLow) + '°';
			icons.add(document.getElementById('dayicon' + j), data.daily.data[j].icon);
		}

 		icons.play();
	});
}

// Return time of day in 00:00 AM/PM format based off time retrieved from JSON data
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

// Return day of the week based off JSON data
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

// Return the wind direction
function getWindDirection(angle) {

	let directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return directions[Math.floor(((angle + (360 / 16) / 2) % 360) / (360 / 16))];
}

// Alert user when their location cannot be found
function locationError() {
	window.alert('Unable to retrieve location.');
}

// Update current header to reflect selected location
function updateHeader(city) {
	document.getElementById('currentheader').innerHTML = 'Currently in ' + city;
	$('#faveicon').fadeIn();
}

// Create a Google Map for the baselayer of the radar
function initMap(position) {

	let map = new google.maps.Map(document.getElementById('map'), {
		center: position,
		zoom: 9,
		disableDefaultUI: true,
		mapTypeId: 'terrain'
	});

	let marker = new google.maps.Marker({
		position: position,
		map: map
	});

	let radar = new google.maps.ImageMapType ({
		getTileUrl: function(tile, zoom) {
			return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
		},
		tileSize: new google.maps.Size(256, 256),
		opacity: 0.60,
		name: 'NEXRAD',
		isPng: true
	});

	map.overlayMapTypes.setAt('1', radar);
}