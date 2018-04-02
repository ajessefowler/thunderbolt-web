
function getWeather(lat, long, city) {

	let key = '60c417a1be6626f37fa6014a5b8abba8';

	$.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&APPID=' + key).done(function(data) {
		let temp = Math.floor(9 / 5 * (data.main.temp - 273) + 32);
		$('#description').html('It\'s ' + temp + '°F in ' + city + '.');
	});

}