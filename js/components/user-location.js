var React = require('react');
var connect = require('react-redux').connect;

var actions = require('../actions/index');

//show user location name
var UserLocation = function(props) {
    var userLocation ='>' + ' ' + props.userLocation;

	return (
		<div className="location-component">{userLocation}</div>
	)
};

var mapStateToProps = function(state, props) {
	return {
		userLocation: state.userLocation,
		userCoords: state.userCoords,
		items: state.items
	};
};

var Container = connect(mapStateToProps)(UserLocation);

module.exports = Container;