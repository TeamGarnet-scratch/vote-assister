import React, { useState, useEffect } from 'react';
import styles from './address-search.css';

const AddressSearch = ({ onSubmit }) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress('');
  }, []);

  return (
    <form onSubmit={onSubmit} className={styles.main_banner}>
      <h2 className={styles.where__vote}>Where do I vote?</h2>
      <div className={styles.main__banner}>
        <div className={styles.search__title}>
          <label className={styles.call__to__action} htmlFor="address">
            Enter address or zip code:
          </label>
        </div>
        <div className={styles.search__input__section}>
          <input
            className={styles.search__input}
            id="address"
            placeholder="enter address/zip code"
          />
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
