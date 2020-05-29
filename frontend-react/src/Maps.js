import React, { useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";

//Socket Server URL
const ENDPOINT = "http://localhost:3000";

const GMap = (props) => {

    const googleMapRef = useRef(null);
    let googleMap = null;
    var gmarkers = [];

    useEffect(() => {
        googleMap = initGoogleMap();
        var bounds = new window.google.maps.LatLngBounds();

        props.taxi.forEach(x => {
            if (x.available) {
                const marker = createMarker(x, 'http://localhost:3000/public/img/taxi.png');
                gmarkers.push(marker);
                bounds.extend(marker.position);
            }
        });
        props.users.forEach(x => {
            if (!x.in_ride) {
                const marker = createMarker(x, 'http://localhost:3000/public/img/user.png');
                gmarkers.push(marker);
                bounds.extend(marker.position);
            }
        });

        googleMap.fitBounds(bounds, { padding: [500, 500] });
    }, []);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("broadcast", data => {
            if (data.type === 'removeMarker') {
                removeMarkers(data.data)
            } else if (data.type === 'addMarker') {
                addMarker(data.data)
            }
        });
    }, [])

    function removeMarkers(data) {
        data.forEach(item => {
            let index = gmarkers.findIndex(x => {
                return x.unique_id === item._id;
            })
            gmarkers[index].setMap(null);
            gmarkers.splice(index, 1)
            return item;
        })
    }

    function addMarker(data) {
        data.forEach(item => {
            if (item.type === 'user') {
                const marker = createMarker(item, 'http://localhost:3000/public/img/user.png');
                gmarkers.push(marker);
            } else {
                const marker = createMarker(item, 'http://localhost:3000/public/img/taxi.png');
                gmarkers.push(marker);
            }
            return item;
        })
    }

    // initialize the google map
    const initGoogleMap = () => {
        return new window.google.maps.Map(googleMapRef.current, {
            center: { lat: 11.9315893, lng: 79.8054707 },
            zoom: 10,
            maxZoom: 16
        });
    }

    // create marker on google map
    const createMarker = (markerObj, image_url) => new window.google.maps.Marker({
        position: { lat: markerObj.lat, lng: markerObj.lon },
        map: googleMap,
        title: markerObj.name,
        icon: {
            url: image_url,
            scaledSize: new window.google.maps.Size(50, 50)
        },
        unique_id: markerObj._id
    });

    return <div
        ref={googleMapRef}
        style={{ width: '100%', height: '100vh' }}
    />
}

export default GMap;