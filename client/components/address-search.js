import React, { useState, useEffect } from 'react';
import styles from './address-search.css';

const AddressSearch = ({ onSubmit }) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress('');
  }, []);

  return (
    <form onSubmit={onSubmit} className={styles.main_banner}>
      <h2 className='where__vote'>Where do I vote?</h2>
      <div class='main__banner'>
        <div class='search__title'>
          <label class='call__to__action' htmlFor='address'>
            Enter address or zip code:
          </label>
        </div>
        <div class='search__input__section'>
          <input
            class='search__input'
            id='address'
            placeholder='enter address/zip code'
          />
        </div>
        <div class='search__button'>
          <button type='submit' class='search__input__button'>
            <p class='search__input__button-text'>Search Locations</p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddressSearch;
