import React, { useRef, useState} from 'react';
import {LoadScript, GoogleMap, Polygon} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '70vh',
  width: '100%',
};
const Map04 = () => {
  const [position, setPosition] = useState({
    lat: 52.52047739093263,
    lng: 13.36653284549709,
  });
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(4);
  const handleMapLoaded = (map) => {
    mapRef.current = map;
  };
  const onChangeCenter = () => {
    if (!mapRef.current) return;
    const newPos = mapRef.current.getCenter().toJSON();
    console.log(newPos);
    setPosition(newPos);
  };
  const onChangeZoom = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    setZoom(currentZoom)
    //console.log(currentZoom);
  };
  return (
    <div>
      <LoadScript
         id="script-loader"
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        language='en'
        region='us'
      >
        <GoogleMap
          onLoad={handleMapLoaded}
          onCenterChanged={onChangeCenter}
          onZoomChanged={onChangeZoom}
          mapContainerStyle={mapContainerStyle}
          center={position}
          zoom={4}></GoogleMap>
      </LoadScript>
    </div>
  );
};
export default Map04;