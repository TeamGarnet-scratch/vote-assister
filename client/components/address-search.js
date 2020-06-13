import React, { useState, useEffect } from 'react';
import './address-search.css';

const AddressSearch = ({ onSubmit }) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress('');
  }, []);

  return (
    <form onSubmit={onSubmit} className='address__search'>
      <h2 className='where__vote'>Where do I vote?</h2>
      <div className='call__to__action'>
        <label className='call__to__action' htmlFor='address'>
          Enter address or zip code:
        </label>
      </div>
      <div className='search__input'>
        <input
          className='search__input'
          id='address'
          placeholder='enter address/zip code'
        />
      </div>
      <div className='search__button'>
        <button type='submit' className='search__button'>
          Search Locations
        </button>
      </div>
    </form>
  );
};

export default AddressSearch;
