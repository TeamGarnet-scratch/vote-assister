import React, { useRef, useState, memo } from 'react';
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

import styled from 'styled-components';
import mapStyle from './MapStyle';

class LoadScriptOnlyIfNeeded extends LoadScript {
  componentDidMount() {
    const cleaningUp = true;
    const isBrowser = typeof document !== 'undefined'; // require('@react-google-maps/api/src/utils/isbrowser')
    const isAlreadyLoaded =
      window.google &&
      window.google.maps &&
      document.querySelector('body.first-hit-completed'); // AJAX page loading system is adding this class the first time the app is loaded
    if (!isAlreadyLoaded && isBrowser) {
      // @ts-ignore
      if (window.google && !cleaningUp) {
        console.error('google api is already presented');
        return;
      }

      this.isCleaningUp().then(this.injectScript);
    }

    if (isAlreadyLoaded) {
      this.setState({ loaded: true });
    }
  }
}

const options = {
  styles: mapStyle,
};

const mapContainerStyle = {
  height: `80vh`,
  width: `45%`,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-15%,-50%)',
};
const InfoWrap = styled.div`
  display: ${(props) => props.display || 'flex'};
  max-width: 300px;
  margin-top: 1em;
`;
const InfoWrapTittle = styled.h2`
  font-size: 1.2em;
  text-decoration: underline;
`;
const InfoWrapCellTittlePoll = styled.h3`
  font-size: 1em;
  color: #b0acac;
  margin-right: 2em;
  width: 5em;
`;
const InfoWrapCellTittleTwoColumns = styled.h3`
  font-size: 1em;
  margin-right: 2em;
  width: 5em;
`;
const InfoWrapCellTittleOneColumns = styled.h3`
  font-size: 1em;
`;

const InfoBoxContent = (props) => {
  console.log('INFOBOXCONTENT', props);

  return (
    <div className="info-wrap">
      <InfoWrapTittle>{props.address.locationName}</InfoWrapTittle>
      <InfoWrap>
        <InfoWrapCellTittlePoll>poll hours</InfoWrapCellTittlePoll>
        <div>
          <strong>{props.pollingHours}</strong>
        </div>
      </InfoWrap>
      <InfoWrap>
        <InfoWrapCellTittleTwoColumns>Address:</InfoWrapCellTittleTwoColumns>
        <div>
          {props.address.line1}
          <br />
          {props.address.city}, {props.address.state} {props.address.zip}
        </div>
      </InfoWrap>
      <InfoWrap display="inline-block">
        <InfoWrapCellTittleTwoColumns>Notes:</InfoWrapCellTittleTwoColumns>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut sem
          quis purus tristique fermentum ac in urna. Nam sodales, augue eget
          mollis tincidunt, erat risus blandit elit, id pharetra libero ligula
          sit amet sapien.
        </div>
      </InfoWrap>
      {/* <h3>{props.title}</h3>
      <div>{props.id}</div>
      <div>{props.desc}</div> */}
    </div>
  );
};

const Map = ({ mapData }) => {
  console.log('MAP DATA', mapData);

  const { pollingLocations } = mapData;

  const initPosition = {
    lat: 36.2111059,
    lng: -113.7191045,
  };

  //temp test coordinates
  const markersDefault = [
    {
      id: 1,
      position: { lat: 37.3609851, lng: -122.0029431 },
      title: 'Hello World1!',
      desc: 'text 01',
    },
    {
      id: 2,
      position: { lat: 37.36808, lng: -122.267645 },
      title: 'Hello World2!',
      desc: 'text 02',
    },
    {
      id: 3,
      position: { lat: 40.6976684, lng: -74.2605591 },
      title: 'Hello World3!',
      desc: 'text 03',
    },
  ];

  const [markers, setMarkerMap] = useState(null);
  const [infoOpen, setInfoOpen] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(8);
  const handleMapLoaded = (map) => {
    mapRef.current = map;
  };

  const markerLoadHandler = (marker, location) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [location.address.locationName]: marker };
    });
  };

  const markerClickHandler = (event, location) => {
    // Remember which place was clicked
    setSelectedPlace(location);
    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
    // If you want to zoom in a little on marker click
    if (zoom < 13) {
      setZoom(4);
    }
  };

  return (
    <div>
      <LoadScriptOnlyIfNeeded
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        language="en"
        region="us"
      >
        <GoogleMap
          onLoad={handleMapLoaded}
          mapContainerStyle={mapContainerStyle}
          center={{
            lat: parseFloat(mapData.userLocation.lat),
            lng: parseFloat(mapData.userLocation.long),
          }}
          options={options}
          zoom={8}
        >
          {pollingLocations.map((location) => (
            <Marker
              key={location.address.locationName}
              position={{
                lat: location.address.latitude,
                lng: location.address.longitude,
              }}
              onLoad={(marker) => markerLoadHandler(marker, location)}
              onClick={(marker) => markerClickHandler(marker, location)}
              icon={{
                path:
                  'M4 24h-2v-24h2v24zm18-21.387s-1.621 1.43-3.754 1.43c-3.36 0-3.436-2.895-7.337-2.895-2.108 0-4.075.98-4.909 1.694v12.085c1.184-.819 2.979-1.681 4.923-1.681 3.684 0 4.201 2.754 7.484 2.754 2.122 0 3.593-1.359 3.593-1.359v-12.028z',
                fillColor: '#033362',
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25,
              }}
            />
          ))}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markers[selectedPlace.address.locationName]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <InfoBoxContent
                id={selectedPlace.address.locationName}
                {...selectedPlace}
              />
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScriptOnlyIfNeeded>
    </div>
  );
};

export default memo(Map);
