import React, { useRef, useState, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import useScript from '../../common/useScript';
import styles from './GeoSearchBar.css';

const GeoSearchBar = () => {
  const [refreshSessionToken, setRefreshSessionToken] = useState(true);
  const [apiSessionToken, setApiSessionToken] = useState();

  const renewSessionToken = () => {
    return apiSessionToken;
  };

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      sessionToken: renewSessionToken(),
    },
    debounce: 500,
    callbackName: 'initMap',
  });

  const [loaded, error] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=AIzaSyDccN-2MwnzPQhW9Nfwvat5Wf53-Oy15yI&libraries=places&callback=initMap`
  );

  useEffect(() => {
    if (refreshSessionToken) {
      if (window.google) {
        setApiSessionToken(
          new window.google.maps.places.AutocompleteSessionToken()
        );
      }
      setRefreshSessionToken(false);
    }
  }, [refreshSessionToken]);

  const ref = useRef();

  useOnclickOutside(ref, () => {
    clearSuggestions();
    setRefreshSessionToken(true); // since user has clicked outside suggestion, renew session token
  });

  const handleSelect = ({ description }) => () => {
    setValue(description, false);
    clearSuggestions();
    getGeocode({ address: description })
      .then((results) => {
        console.log(
          "Here is the address as geocoded from the places's suggestion :: ",
          results
        );
        return getLatLng(results[0]);
      })
      .then(async ({ lat, lng }) => {
        // SEND TO BACKEND
        console.log(
          'Here are the lat/long pairs of the location :: ',
          `Lat ::${lat}, Lon ${lng}`
        );
      })
      .catch((error) => {
        if (window.DEBUG) {
          console.log('Error: ', error);
        }
      });
    setRefreshSessionToken(true); // since user has selected a suggestion and suggested set has been cleared
  };

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={id} onClick={handleSelect(suggestion)}>
          <strong className={styles.navbar__main_text}>{main_text}</strong>{' '}
          <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        className={styles.navbar__location__search}
        placeholder="Please type your address/zip code..."
        value={value}
        onChange={handleInput}
        disabled={!ready}
      />
      {status === 'OK' && (
        <ul className={styles.navbar__location__suggestion}>
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

export default GeoSearchBar;
