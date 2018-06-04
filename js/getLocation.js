/*
	Obtains user's location either automatically or manually, then retrieves weather data based on location
*/

document.addEventListener('DOMContentLoaded', init);

// If a location has been favorited, load the data for that location, otherwise display the landing page
function init() {
	if (favoriteLocations.length !== 0) {
		document.getElementById('splashsearchdiv').parentNode.removeChild(document.getElementById('splashsearchdiv'));
		updateLocalStorage();
		updatePage(favoriteLocations[0]);
	} else {
		addLanding();
	}
}

// Find the user's current location, if supported
function findLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(resolveAddress, locationError);
	} else {
		alert('Your browser does not support location. Please enter your location.');
	}
}

// Find weather based on user's determined coordinates and update HTML
function resolveAddress(position) {
	const lat = position.coords.latitude;
	const long = position.coords.longitude;
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	const request = new XMLHttpRequest();

	request.open('GET', url, true);
	
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			const location = JSON.parse(request.responseText);
			const city = location.results[0].address_components[3].long_name;
			const state = location.results[0].address_components[5].long_name;
			const currentLocation = new Location(city, state, lat, long);
			updatePage(currentLocation);
		} else {
			console.log('Data error.');
		}
	};

	request.onerror = () => { console.log('Connection error.'); };

	request.send();
}

// Alert user when their location cannot be found
function locationError() {
	alert('Unable to retrieve location.');
}

// Implement Google Autocomplete and find weather based on selection
function searchLocation() {

	const countryRestriction = { componentRestrictions: { country: 'us' }};

	// Autocomplete and listener for main search bar
	const autocomplete = new google.maps.places.Autocomplete(document.querySelector('#autocomplete'), countryRestriction);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		document.getElementById('autocomplete').blur();
		const currentLocation = resolveLocation(autocomplete);
		updatePage(currentLocation);
	});

	// Autocomplete and listener for splashscreen search bar
	const splashcomplete = new google.maps.places.Autocomplete(document.querySelector('#splashsearch'), countryRestriction);
	google.maps.event.addListener(splashcomplete, 'place_changed', function() {
		document.getElementById('splashsearch').blur();
	});

	document.getElementById('splashsearchbutton').addEventListener('click', function() {
		const currentLocation = resolveLocation(splashcomplete);
		updatePage(currentLocation);
	});

	function resolveLocation(element) {
		const place = element.getPlace();
		const lat = place.geometry.location.lat();
		const long = place.geometry.location.lng();
		const city = place.address_components[3].long_name;
		const state = place.address_components[5].long_name;
		const location = new Location(city, state, lat, long);
		return location;
	}
}

// Update the page to reflect the new location
function updatePage(currentLocation) {
	const faveIcon = document.getElementById('faveicon');

	// Initialize favorite button
	if (isFavorited(currentLocation) === false) {
		faveIcon.style.animation = 'unfavorite .2s linear forwards';
	} else {
		faveIcon.style.animation = 'favorite .2s linear 2 forwards';
	}
	faveIcon.style.display = 'block';
	faveIcon.addEventListener('click', function() {
		currentLocation.favorite();
	})

	// Update HTML
	removeLanding();
	document.getElementById('currentheader').innerHTML = currentLocation.city + ', ' + currentLocation.state;
	getWeather(currentLocation.lat, currentLocation.long);
	initMap({ lat: currentLocation.lat, lng: currentLocation.long });
	addContent();
}

// If given Location object is favorited, return its index in LocalStorage, otherwise return false
function isFavorited(location) {
	let i;
	let isFavorited = false;
	const favorites = JSON.parse(localStorage.getItem('favorites'));
	
	for (i = 0; i < favorites.length; ++i) {
		if (location.city === favorites[i].city && location.state === favorites[i].state) {
			isFavorited = i;
			break;
		}
	}

	return isFavorited;
}

// Create a Google Maps baselayer with a radar layer on top
function initMap(position) {

	const map = new google.maps.Map(document.getElementById('map'), {
		center: position,
		zoom: 9,
		mapTypeId: 'terrain',
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
	});

	const marker = new google.maps.Marker({
		position: position,
		map: map,
		icon: 'img/mapmarker.svg'
	});

	const radar = new google.maps.ImageMapType ({
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