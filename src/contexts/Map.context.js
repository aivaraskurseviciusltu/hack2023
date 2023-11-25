import React, { createContext, useState } from "react";

// Create a context with a default value (in this case, an empty object)
const MapContext = createContext({});

// Create a provider component to wrap your app with
const MapContextProvider = ({ children }) => {
  const [markers, setMarkers] = useState([
    {
      latitude: 54.6943,
      longitude: 25.2836,
      description: "Test",
      category: "myLocation",
      img: "./test.png",
    },
  ]);

  const updateMarkers = (newMarkers) => {
    setMarkers((prevState) => ({ ...prevState, markers: newMarkers }));
  };

  return (
    <MapContext.Provider value={{ markers, updateMarkers }}>
      {children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
