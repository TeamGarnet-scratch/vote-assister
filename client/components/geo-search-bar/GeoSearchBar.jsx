import React, { useRef, useState, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
/**
 * when place autocomplete options/results are rendered below the search bar,
 * those suggestions or query results need to be cleared the moment the user clicks
 * anywhere on the form. This library helps to accomplish that
 */
import useOnclickOutside from 'react-cool-onclickoutside';
/**
 *  This is a hook that injects scripts into the main web page.
 *  without this, one would have needed to load the google map scripts manually on the index.html
 *  loading it this was however helps ensures its only when this component is need that the google
 *  map scripts are loaded on the webpage or index.html
 *  This also ensures we don't need to load many scripts when our react application starts until the
 *  ComponentMount event of this component fires for injecting or loading the google map script
 *  https://github.com/wellyshen/use-places-autocomplete/issues/107
 */
import useScript from '../../common/useScript';
import styles from './GeoSearchBar.css';

const GeoSearchBar = () => {
  /**
   * Refresh tokens are needed to optimize the google place API to reduce the cost
   * Each time anyone types in this search bar, google counts the search individually on the API key's
   * account within the allowed quota.
   * With a token, until a result is returned all typing within a session maintains the same token and
   * is counted as 1 single search.
   */
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

  /**
   * The google map script is loaded here using useScript hook
   * https://github.com/wellyshen/use-places-autocomplete/issues/107
   */
  const [loaded, error] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
  );

  /**
   * this hook helps to generate a sessiontoken for all google place API queries and does not change until
   * a session is completed
   * https://github.com/wellyshen/use-places-autocomplete/issues/137
   */
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
    // the instruction to generate a new refresh token is invoked here
    // https://github.com/wellyshen/use-places-autocomplete/issues/137
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
