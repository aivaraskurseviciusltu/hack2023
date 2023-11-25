var fetch = require('isomorphic-fetch');

//add user location name
var ADD_USER_LOCATION = 'ADD_USER_LOCATION';
var addUserLocation = function(location) {
	return {
		type: ADD_USER_LOCATION,
		location: location
	};
};

var getLocation = function(location) {
	return function(dispatch) {
		var latitude = location.lat;
    	var longitude = location.lng;
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyBOvMQKAtB336uW1OUdCgtPeay9VPmYsaE';
		return fetch(url)
		.then(function(response) {
            if (response.status < 200 || response.status >= 300) {
                var error = new Error(response.statusText)
                error.response = response
                throw error;
            }
            return response;
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var town = data.results[1].formatted_address;
            return dispatch(addUserLocation(town));
        })
        .catch(function() {
        	console.log('error');
        });
	}
};

//add items to list
var ADD_ITEM = 'ADD_ITEM';
var addItem = function(item) {
	return {
		type: ADD_ITEM,
		item: item
	};
};

var ADD_BAT = 'ADD_BAT';
var addBat = function(bat) {
	return {
		type: ADD_BAT,
		bat: bat
	};
};

var ADD_ESCAPE_DATA = 'ADD_ESCAPE_DATA';
var addEscapeData = function(user, infection, safe) {
	return {
		type: ADD_ESCAPE_DATA,
		userCoords: user,
		infectionCoords: infection,
		safePlaceCoords: safe
	};
};

var ADD_NEAREST_SAFE_PLACE = 'ADD_NEAREST_SAFE_PLACE';
var addNearestSafePlace = function(coords) {
	return {
		type: ADD_NEAREST_SAFE_PLACE,
		nearestSafePlace: coords
	};
};

var getNearestSafePlace = function(user, safe) {
	return function(dispatch) {
		var userLat = user.lat;
		var userLng = user.lng;
		var safePlaceCoords = safe;

		//calculate nearest safe place lat to user location
        var nearestSafeLat = null;
        var diffLat = Math.abs(userLat - safePlaceCoords[0].lat)
        for(var i = 0; i < safePlaceCoords.length; i++) {
        	var newNearest = Math.abs(userLat - safePlaceCoords[i].lat);
        	if(newNearest < diffLat) {
        		diffLat = newNearest;
        		nearestSafeLat = safePlaceCoords[i].lat;
        	}
        }

        //calculate nearest safe place lng to user location
        var nearestSafeLng = null;
        var diffLng = Math.abs(userLng - safePlaceCoords[0].lng)
        for(var i = 0; i < safePlaceCoords.length; i++) {
        	var newNearest = Math.abs(userLng - safePlaceCoords[i].lng);
        	if(newNearest < diffLng) {
        		diffLng = newNearest;
        		nearestSafeLng = safePlaceCoords[i].lng;
        	}
        }

        //determine absolute nearest safe place using smallest difference in lat or lng
        var absoluteNearest = null;
        if(diffLat < diffLng) {
        	absoluteNearest = diffLat;
        }
        else {
        	absoluteNearest = diffLng;
        }
        for(var i = 0; i < safePlaceCoords.length; i++) {
        	if(absoluteNearest == safePlaceCoords[i].lat) {
        		nearestSafeLat = safePlaceCoords[i].lat;
        		nearestSafeLng = safePlaceCoords[i].lng;
        	}
        	else if(absoluteNearest == safePlaceCoords[i].lng) {
        		nearestSafeLat = safePlaceCoords[i].lat;
        		nearestSafeLng = safePlaceCoords[i].lng;
        	}
        }

        var nearestSafePlace = {lat: nearestSafeLat, lng: nearestSafeLng};
        return dispatch(addNearestSafePlace(nearestSafePlace));
	};
};

var ADD_USER_JOURNEY_TIME = 'ADD_USER_JOURNEY_TIME';
var addUserJourneyTime = function(time) {
	return {
		type: ADD_USER_JOURNEY_TIME,
		userJourneyTime: time
	};
};

var getUserJourney = function(user, safe, items) {
	return function(dispatch) {
		var userLat = user.lat;
		var userLng = user.lng;
		var nearestSafeLat = safe.lat;
		var nearestSafeLng = safe.lng;

        //get travel time using origin and destination latlng objects and travel mode from items
        var origin = {lat: userLat, lng: userLng};
        var destination = {lat: nearestSafeLat, lng: nearestSafeLng};
        var directionsService = new google.maps.DirectionsService;
        var getRouteData = function(mode) {
        	directionsService.route({
        		origin: origin,
        		destination: destination,
        		travelMode: mode
        	}, function(response, status) {
        		if(status === 'OK') {
        			var time = (response.routes[0].legs[0].duration.value);
        			//user walking time reduced to account for running, and driving time increased to account for traffic
        			if(mode == 'WALKING') {
        				time = time * 0.5
        			}
        			else if(mode == 'DRIVING') {
        				time = time * 2
        			}
        			
        		} else {
        			window.alert('Directions request failed due to ' + status);
        		}
        		var itemsArr = items;
        		for(var i = 0; i < itemsArr.length; i++) {
        			if(itemsArr[i] == 'Smartphone' || itemsArr[i] == 'Radio' || items[i] == 'Map') {
        				time = time * 0.9;
        			}
        			else {
        				time = time;
        			}
        		};
        		return dispatch(addUserJourneyTime(time));
        	});
        };

        //check for transport options in items array and call directions api function with applicable travel mode
        var itemsArr = items;
        var setTravelMode = function() {
        	var travelMode = null;
        	var car = false;
        	var bicycle = false;
        	for(var i = 0; i < itemsArr.length; i++) {
        		if(itemsArr[i] == 'Car') {
        			car = true;
        			travelMode = 'DRIVING';
        		}
        		else if(itemsArr[i] == 'Bicycle') {
        			bicycle = true;
        			travelMode = 'BICYCLING';
        		}
        	};
        	if(car === true && bicycle === true) {
        		travelMode = 'DRIVING';
        	}
        	else if(car === false && bicycle === false) {
        		travelMode = 'WALKING';
        	}
        	getRouteData(travelMode);
    	}
        setTravelMode();
	};
};

var ADD_ZOMBIE_JOURNEY_TIME = 'ADD_ZOMBIE_JOURNEY_TIME';
var addZombieJourneyTime = function(time) {
	return {
		type: ADD_ZOMBIE_JOURNEY_TIME,
		zombieJourneyTime: time
	};
};

var getZombieJourney = function(infection, safe, bat) {
	return function(dispatch) {
		var infectionLat = infection.lat;
		var infectionLng = infection.lng;		
		var nearestSafeLat = safe.lat;
		var nearestSafeLng = safe.lng;

        //get travel time using origin and destination latlng objects and travel mode from items
        var origin = {lat: infectionLat, lng: infectionLng};
        var destination = {lat: nearestSafeLat, lng: nearestSafeLng};
        var directionsService = new google.maps.DirectionsService;
        var getRouteData = function() {
        	directionsService.route({
        		origin: origin,
        		destination: destination,
        		travelMode: 'DRIVING'
        	}, function(response, status) {
        		if(status === 'OK') {
        			//zombie travel time set at half driving time
        			var time = ((response.routes[0].legs[0].duration.value) * 2);
        		} else {
        			window.alert('Directions request failed due to ' + status);
        		}
        		if(bat == true) {
        			time = time * 1.1;
        		}
        		return dispatch(addZombieJourneyTime(time));
        	});
        };
        getRouteData();
	};
};

exports.ADD_USER_LOCATION = ADD_USER_LOCATION;
exports.addUserLocation = addUserLocation;
exports.getLocation = getLocation;

exports.ADD_ITEM = ADD_ITEM;
exports.addItem = addItem;

exports.ADD_BAT = ADD_BAT;
exports.addBat = addBat;

exports.ADD_ESCAPE_DATA = ADD_ESCAPE_DATA;
exports.addEscapeData = addEscapeData;

exports.ADD_NEAREST_SAFE_PLACE = ADD_NEAREST_SAFE_PLACE;
exports.addNearestSafePlace = addNearestSafePlace;
exports.getNearestSafePlace = getNearestSafePlace;

exports.ADD_USER_JOURNEY_TIME = ADD_USER_JOURNEY_TIME;
exports.addUserJourneyTime = addUserJourneyTime;
exports.getUserJourney = getUserJourney;

exports.ADD_ZOMBIE_JOURNEY_TIME = ADD_ZOMBIE_JOURNEY_TIME;
exports.addZombieJourneyTime = addZombieJourneyTime;
exports.getZombieJourney = getZombieJourney;