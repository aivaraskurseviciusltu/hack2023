import React, { useContext } from "react";
import Map, { Marker } from "react-map-gl";
import { MapContext } from "../../contexts/Map.context";
import "./styles.css";

const MapComponent = () => {
  const { markers } = useContext(MapContext);
  console.log({ markers });

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw"
      initialViewState={{
        latitude: 54.6943,
        longitude: 25.2836,
        zoom: 17,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker longitude={54.6943} latitude={25.2836} anchor="bottom">
        Test
      </Marker>
    </Map>
  );
};

export default MapComponent;
