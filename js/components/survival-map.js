var React = require('react');
var connect = require('react-redux').connect;

var EscapeOutcome = require('./escape-outcome');
var actions = require('../actions/index');
var store = require('../store');

var SurvivalMap = React.createClass({
	getInitialState: function() {
        return {
            userCoords: {},
            infectionCoords: {},
            safePlaceCoords: [],
            locationEnabled: false,
            showLoad: true,
            showStart: false,
            showOutcome: false,
            showMap: true,
            showKey: false
        }
    },

    shouldComponentUpdate: function() {
    	return true;
    },

	componentDidMount: function() {
		navigator.geolocation.getCurrentPosition(
            (position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var userCoords = {lat: latitude, lng: longitude};
            this.setState({userCoords: userCoords});
            this.setState({locationEnabled: true});
        });
        //random lats and lngs - scotland, wales, west, east
    	var randomLatLng =  [
    		{lat: (Math.random()*(57.468 - 54.965) + 54.965.toFixed() * 1), lng: (Math.random()*(-3.054 - -4.681) + -4.681.toFixed() * 1)},
    		{lat: (Math.random()*(53.186 - 51.713) + 51.713.toFixed() * 1), lng: (Math.random()*(-2.614 - -4.021) + -4.021.toFixed() * 1)},
    		{lat: (Math.random()*(54.495 - 50.875) + 50.875.toFixed() * 1), lng: (Math.random()*(-0.747 - -2.416) + -2.416.toFixed() * 1)},
			{lat: (Math.random()*(52.736 - 50.972) + 50.972.toFixed() * 1), lng: (Math.random()*(0.593 - -0.746) + -0.746.toFixed() * 1)}
		];
        var infectionCoords = randomLatLng[Math.floor(Math.random() * randomLatLng.length)];
        this.setState({infectionCoords: infectionCoords});
        //lats and lngs for safe places
        var safePlaceCoords = [
        	{lat: 51.891796, lng: 0.901473},
        	{lat: 55.9022, lng: -3.2395},
        	{lat: 57.583889, lng: -4.070278},
        	{lat: 54.377634, lng: -1.723628},
        	{lat: 52.823333, lng: -2.144722},
        	{lat: 51.2599, lng: -0.7598}
        ];
        this.setState({safePlaceCoords: safePlaceCoords});
	},

	generateMap: function() {
		this.setState({showLoad: false});
		this.setState({showStart: true});
		this.setState({showKey: true});
		var userCoords = this.state.userCoords;
		var infectionCoords = this.state.infectionCoords;
		var safePlaceCoords = this.state.safePlaceCoords;
		this.props.dispatch(actions.getNearestSafePlace(userCoords, safePlaceCoords));
		
		var zoom = null;
		if(window.innerWidth <= 500) {
			zoom = 5;
		}
		else {
			zoom = 6;
		}
		this.mapImage = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 54.559322, lng: -2.5},
				zoom: zoom
  		});

		var userIcon = '';
		var userMarker = new google.maps.Marker({
    		position: userCoords,
   			map: this.mapImage,
   			title: 'Your Location'
   		});
   		var infectionIcon = '../../../assets/images/infection-icon-30px.png'
   		var infectionMarker = new google.maps.Marker({
   			position: infectionCoords,
   			map: this.mapImage,
   			title: 'Infection Breakout Point',
   			icon: infectionIcon,
   			optimized: false,
   		});
   		var safeIcon = '../../../assets/images/assembly-point-icon-30px.png'
   		for(var i = 0; i < safePlaceCoords.length; i++) {
   			var safePlace = safePlaceCoords[i];
   			var safeMarker = new google.maps.Marker({
    			position: safePlace,
   				map: this.mapImage,
   				title: 'Safe Place',
   				icon: safeIcon
   			});
   		};
	},

	addEscapeOutcome: function() {
		this.setState({showStart: false});
		this.setState({showOutcome: true});
		this.setState({showMap: false});
		this.setState({showKey: false});
		var userCoords = this.state.userCoords;
		var infectionCoords = this.state.infectionCoords;
		var safePlaceCoords = this.state.safePlaceCoords;
		var nearestSafePlace = (store.getState().nearestSafePlace);
		var userItems = (store.getState().items);
		var yesBat = (store.getState().bat);
		this.props.dispatch(actions.addEscapeData(userCoords, infectionCoords, safePlaceCoords));
		this.props.dispatch(actions.getUserJourney(userCoords, nearestSafePlace, userItems));
		this.props.dispatch(actions.getZombieJourney(infectionCoords, nearestSafePlace, yesBat));
	},

	render: function() {
		return (
			<div className="survival-map">
				{this.state.locationEnabled && this.state.showLoad &&
				<button type="button" className="load-map" onClick={this.generateMap}>LOAD MAP</button> }
				{this.state.showStart &&
				<button type="button" className="start-moving" onClick={this.addEscapeOutcome}>LOAD PREDICTION</button> }
				{this.state.showOutcome &&
				<EscapeOutcome className="escape-container" userCoords={this.state.userCoords} infectionCoords={this.state.infectionCoords} safePlaceCoords={this.state.safePlaceCoords} /> }
				{this.state.showKey &&
				<div className="map-key">
					<li className="infection"><img className="icon" src="../../../assets/images/infection-icon-30px.png"></img>Infection Breakout Point</li>
					<li className="safe"><img className="icon" src="../../../assets/images/assembly-point-icon-30px.png"></img>Safe Assembly Point</li>
				</div> }
				{this.state.showMap &&
				<div className="map" id="map"></div> }
			</div>
		);
	}
});

var Container = connect()(SurvivalMap);

module.exports = Container;