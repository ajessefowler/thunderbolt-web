/*
    Retrieves weather data for selected location and updates page
*/

/* 
	Find the weather, given the user's latitude and longitude.
*/
function getWeather(lat, long, isFavoriteLocation = false) {
	const weatherKey = '014160f48f5c2882a6f60dcbeb59425e';
	const weatherUrl = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long;
	const weatherRequest = new XMLHttpRequest();

	weatherRequest.open('GET', weatherUrl, true);

	weatherRequest.onload = function() {
		if (weatherRequest.status >= 200 && weatherRequest.status < 400) {
			const data = JSON.parse(weatherRequest.responseText);

			if (!isFavoriteLocation) {

				// Change font size of hourly summary if content is too long
				if (data.hourly.summary.length > 110) {
					document.getElementById('hourlysummary').style.fontSize = '14pt';
				} else if (data.hourly.summary.length > 70) {
					document.getElementById('hourlysummary').style.fontSize = '15pt';
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

				// Resize the hourly content based on the height of the hourly summary
				resizeHourly();

				// Load Skycons and add the icon for current condition to the page
				let icons = new Skycons({'color': '#000000'});
				const list  = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind', 'fog']; 
				let i, e;

  				for (i = list.length; i--;) {
					let weatherType = list[i];
					let elements = document.getElementsByClassName(weatherType);

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
				 
			} else {
				// Update favorite menu with weather
			}
		} else {
			console.log('Data error.');
		}
	};

	weatherRequest.onerror = function() {
		console.log('Connection error.');
	};

	weatherRequest.send();
}

// Return time of day in 00:00 AM/PM format based off time retrieved from JSON data
function getTime(unixTime) {

	// Convert from milliseconds to seconds
	const jsTime = new Date(unixTime * 1000);
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

	const min = jsTime.getMinutes() < 10 ? '0' + jsTime.getMinutes() : jsTime.getMinutes();
	const time = hour + ':' + min + ' ' + meridiem;

	return time;
}

// Return day of the week based off JSON data
function getDayOfWeek(unixTime) {

	// Convert from milliseconds to seconds
	const jsTime = new Date(unixTime * 1000);
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
	const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return directions[Math.floor(((angle + (360 / 16) / 2) % 360) / (360 / 16))];
}