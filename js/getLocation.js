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

/*
	Find weather based on user's determined coordinates and update HTML

	Takes two sets of arguments, a position when being used to find the user's location.
	Otherwise, takes latitude and longitude when being used to favorite the current location.
*/
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

		// Remove splashscreen if it is still visible
		if (!splashRemoved) {
			removeSplash();
		}
	});
}

// Implement Google Autocomplete and find weather based on selection
function searchLocation() {

	let countryRestriction = { componentRestrictions: { country: 'us' }};

	// Autocomplete and listener for main search bar
	let autocomplete = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'), countryRestriction);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		document.getElementById('autocomplete').blur();
		let place = this.getPlace();
		let lat = place.geometry.location.lat();
		let long = place.geometry.location.lng();
		let city = place.address_components[3].long_name;
		getWeather(lat, long);
		initMap({ lat: lat, lng: long });
		updateHeader(city);
	});

	// Autocomplete and listener for splashscreen search bar
	var splashcomplete = new google.maps.places.Autocomplete(document.querySelector('#splashsearch'), countryRestriction);
	google.maps.event.addListener(splashcomplete, 'place_changed', function() {
		document.getElementById('splashcomplete').blur();
		let splashPlace = this.getPlace();
	});

	// Finds weather at location in search box on click of search button
	$(document).on('click', '#splashsearchbutton', function() {
		let splashPlace = splashcomplete.getPlace();
		let splashLat = splashPlace.geometry.location.lat();
		let splashLong = splashPlace.geometry.location.lng();
		let splashCity = splashPlace.address_components[3].long_name;
		getWeather(splashLat, splashLong);
		initMap({ lat: splashLat, lng: splashLong });
		updateHeader(splashCity);
		if (!splashRemoved) {
			removeSplash();
		}
	});
}

// Alert user when their location cannot be found
function locationError() {
	window.alert('Unable to retrieve location.');
}

// Update current header to reflect selected location
function updateHeader(city) {
	document.getElementById('currentheader').innerHTML = 'Currently in ' + city;
}

// Create a Google Maps baselayer with a radar layer on top
function initMap(position) {

	let map = new google.maps.Map(document.getElementById('map'), {
		center: position,
		zoom: 9,
		disableDefaultUI: true,
		mapTypeId: 'terrain'
	});

	let marker = new google.maps.Marker({
		position: position,
		map: map,
		icon: 'img/mapmarker.svg'
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