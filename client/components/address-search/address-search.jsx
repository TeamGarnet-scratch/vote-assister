import React, { useState, useEffect } from 'react';
import GeoSearchBar from '../geo-search-bar/GeoSearchBar';
import styles from './address-search.css';

const AddressSearch = ({ onSubmit }) => {
  const [address, setAddress] = useState();

  const handleAddress = (payload) => {
    console.log('PAYLOAD', payload);
    setAddress(payload);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  useEffect(() => {
    setAddress('');
  }, []);

  return (
    <form onSubmit={onFormSubmit} className={styles.main_banner}>
      <h2 className={styles.where__vote}>Where do I vote?</h2>
      <div className={styles.main__banner}>
        <div className={styles.search__title}>
          <label className={styles.call__to__action} htmlFor="address">
            Enter address or zip code:
          </label>
        </div>
        <div className={styles.search__input__section}>
          <GeoSearchBar onSubmit={handleAddress} />
        </div>
        <div className={styles.Namesearch__button}>
          <button type="submit" className={styles.search__input__button}>
            <p className={styles.search__input__button_text}>
              Search Locations
            </p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddressSearch;
