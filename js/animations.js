/*
	Animations for search boxes and splashscreen
*/

(function() {
	let settingsOpen = false;
	let searchOpen = false;
	let rightSwitchPos = 0;
	let leftSwitchPos = 0;
	let closeDiv = document.createElement('div');
	let searchDiv = document.createElement('div');

	// Slides settings menu in and out
	document.getElementById('settingsbtn').addEventListener('click', function() {
		if (!settingsOpen) {
			document.getElementById('settingspanel').style.animation = 'settingsOut .4s ease forwards';
			document.getElementById('settingsbtn').style.animation = 'settingsBtnOut .4s ease forwards';
			settingsOpen = true;
		} else {
			document.getElementById('settingspanel').style.animation = 'settingsIn .4s ease forwards';
			document.getElementById('settingsbtn').style.animation = 'settingsBtnIn .4s ease forwards';
			settingsOpen = false;
		}
	});

	// Animates settings slider and updates units on page
	document.getElementById('rightswitch').addEventListener('click', function() {
		if (rightSwitchPos === 0) {
			rightSwitchPos = 1;
			$('#rightslider').velocity({ left: 13 }, { duration: 150, easing: 'spring' });
		} else {
			rightSwitchPos = 0;
			$('#rightslider').velocity({ left: 0 }, { duration: 150, easing: 'spring' });
		}
	});

	document.getElementById('leftswitch').addEventListener('click', function() {
		if (leftSwitchPos === 0) {
			leftSwitchPos = 1;
			$('#leftslider').velocity({ left: 13 }, { duration: 150, easing: 'spring' });
		} else {
			leftSwitchPos = 0;
			$('#leftslider').velocity({ left: 0 }, { duration: 150, easing: 'spring' });
		}
	});

	// Slide menu in and out
	document.getElementById('menubutton').addEventListener('click', function() {
		document.getElementById('menu').style.animation = 'menuIn .4s ease forwards';
		document.getElementById('menushade').style.display = 'block';
		document.getElementById('menushade').style.animation = 'fadeIn .5s ease forwards';
	});

	document.getElementById('closemenu').addEventListener('click', function() {
		document.getElementById('menu').style.animation = 'menuOut .4s ease forwards';
		document.getElementById('menushade').style.animation = 'fadeOut .5s ease forwards';
		setTimeout(function(){ document.getElementById('menushade').style.display = 'none'; }, 500);
	});

	// Create function to DRY these

	document.getElementById('menushade').addEventListener('click', function() {
		document.getElementById('menu').style.animation = 'menuOut .4s ease forwards';
		document.getElementById('menushade').style.animation = 'fadeOut .5s ease forwards';
		setTimeout(function(){ document.getElementById('menushade').style.display = 'none'; }, 500);
	})

	// Slide search bar in and out
	document.getElementById('searchbutton').addEventListener('click', function() {
		if (!searchOpen) {
			searchOpen = true;
			document.getElementById('searchbar').style.animation = 'searchOut .5s ease forwards';
			document.getElementById('searchicon').innerHTML = 'clear';
		} else {
			searchOpen = false;
			document.getElementById('searchbar').style.animation = 'searchIn .5s ease forwards';
			document.getElementById('searchicon').innerHTML = 'search';
		}
	});

	// Resizes hourly content whenever window is resized to maintain proper look
	window.addEventListener('resize', resizeHourly);
})();

// Hides splashscreen and re-enables scrolling
function removeSplash() {
	let splashRemoved = false;

	if (!splashRemoved) {
		setTimeout(function() {
			document.getElementById('splashsearchdiv').parentNode.removeChild(document.getElementById('splashsearchdiv'));
			addContent();
		}, 600);
		document.getElementById('splashlocbutton').style.animation = 'splashButtonsOut .4s ease forwards';
		document.getElementById('splashlocate').style.animation = 'splashButtonsOut .4s ease forwards';
		document.getElementById('splashexit').style.animation = 'splashFadeOut .6s ease forwards';
		document.getElementById('splashtexthead').style.animation = 'splashFadeOut .6s ease forwards';
		document.getElementById('splashtextsub').style.animation = 'splashFadeOut .6s ease forwards';
		splashRemoved = true;
	}
}

function addContent() {
	document.getElementById('menubutton').style.animation = 'buttonsIn .4s ease .3s forwards';
	document.getElementById('searchbutton').style.animation = 'buttonsIn .4s ease .4s forwards';
	document.getElementById('currently').style.animation = 'contentIn .5s ease .5s forwards';
	document.getElementById('hourly').style.animation = 'contentIn .5s ease .7s forwards';
	document.getElementById('daily').style.animation = 'contentIn .5s ease .9s forwards';
	document.getElementById('radar').style.animation = 'contentIn .5s ease 1.1s forwards';
	setTimeout(function(){ $('body').css('overflow','auto'); }, 1600);
}

// Calculates height of hourly content based on hourly summary
function resizeHourly() {
	if (window.innerWidth > 800) {
		const hourlyHeight = 750 - document.getElementById('hourlyheader').clientHeight;
		document.getElementById('hourlycontent').style.height = hourlyHeight + 'px';
	} else {
		document.getElementById('hourlycontent').style.height = '170px';
	}
}