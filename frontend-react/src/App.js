import React, { useState, useEffect } from 'react';
import Maps from './Maps';
import './App.css';

// API key of the google map
const GOOGLE_MAP_API_KEY = 'AIzaSyB1eSGw9zA1ryObW3CzSzYF9AkMN-RXrt4';

// load google map script
const loadGoogleMapScript = (callback) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
}

function App() {


  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true)
    });
  }, []);

  const [taxi, setTaxi] = useState([]);
  const [users, setUser] = useState([]);
  const [location, setLocation] = useState(null);


  function findCoordinates() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const locationDetails = JSON.stringify(position);
        console.log(locationDetails);
        setLocation(locationDetails);
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    fetchTaxi();
    fetchUsers();
  }, [])

  const fetchTaxi = async () => {
    fetch(`http://localhost:3000/cabs`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      // ...then we update the users state
      .then(data => {
        setTaxi(data.data)
      })
      // Catch any errors we hit and update the app
      .catch(error =>
        console.log(error)
      );
  }

  const fetchUsers = async () => {
    fetch(`http://localhost:3000/user`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      // ...then we update the users state
      .then(data => {
        setUser(data.data)
      })
      // Catch any errors we hit and update the app
      .catch(error =>
        console.log(error)
      );
  };

  return (
    <div className="App">
      <header className="App-header">
        {!loadMap ? <div>Loading...</div> : <Maps taxi={taxi} users={users} />}
        <h2>Location: {location}</h2>
        <button onClick={findCoordinates} >Get Location</button>
      </header>
    </div>
  );
}

export default App;
