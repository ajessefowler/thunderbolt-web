/* 
    Initializes favorite locations to those saved in LocalStorage, or an empty array if no favorites exist.
*/

//var favoriteLocations = JSON.parse(localStorage.getItem('favorites')) || [];
var favoriteLocations = [];

// Creates new Location object with name and coordinates. Also maintains whether Location is favorited.
class Location {
    constructor(city, state, lat, long) {
	    this.city = city;
	    this.state = state;
	    this.lat = lat;
	    this.long = long;
	    this.isFavorited = false;
    }

    favorite() {
        if (typeof(Storage) !== 'undefined') {

            if (!this.isFavorited) {
                this.isFavorited = true;
                document.getElementById('faveicon').style.color = '#EF5350';
                favoriteLocations.push(this);
                console.log(favoriteLocations);
             } else {
                this.isFavorited = false;
                document.getElementById('faveicon').style.color = '#FFFFFF';
                for (let i = 0; i < favoriteLocations.length; ++i) {
                    if ((favoriteLocations[i].city === this.city) && (favoriteLocations[i].state === this.state)) {
                        favoriteLocations.splice(i, 1);
                        break;
                    }
                }
             }
    
            updateLocalStorage();
            updateFavoritesMenu();
             
        } else {
            alert('Your browser does not support favorite locations.');
        }
    }
}

// Updates LocalStorage with the latest contents of favoriteLocations after any action
function updateLocalStorage() {
	let favoritesNode = document.getElementById('favorites');

	// Remove current favorites list from favorites menu
	while (favoritesNode.lastChild) {
		favoritesNode.removeChild(favoritesNode.lastChild);
	}

	localStorage.setItem('favorites', JSON.stringify(favoriteLocations));
}

function updateFavoritesMenu() {
	let div;
	let favorites = JSON.parse(localStorage.getItem('favorites'));

	// Add new favorites list to favorites menu
	for (let i = 0; i < favorites.length; ++i) {
		div = document.createElement('div');
		icon = document.createElement('i');
		div.className = 'favorite';
		icon.className = 'material-icons removefave';
		div.setAttribute('id', ('favorite' + i));
		icon.setAttribute('id', ('removebtn' + i));
        div.innerHTML = '<p>' + favorites[i].city + ', ' + favorites[i].state + '</p>';
        icon.innerHTML = 'delete_outline';
		document.getElementById('favorites').appendChild(div);
		document.getElementById('favorite' + i).appendChild(icon);
	}
}