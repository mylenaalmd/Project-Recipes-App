import React, { useState } from 'react';

function SearchBar() {
  const [valueSearch, setValueSearch] = useState('');

  const handleChange = (callback, { target: { value } }) => {
    callback(value);
  };

  return (
    <div className="searchBar">
      <input
        type="text"
        data-testid="search-input"
        value={ valueSearch }
        onChange={ (e) => handleChange(setValueSearch, e) }
      />

      <input
        type="radio"
        name="typeSearch"
        value="1"
        data-testid="ingredient-search-radio"
      />
      Ingredient
      <input
        type="radio"
        name="typeSearch"
        value="2"
        data-testid="name-search-radio"
      />
      Name
      <input
        type="radio"
        name="typeSearch"
        value="3"
        data-testid="first-letter-search-radio"
      />
      First letter
      <button
        type="button"
        data-testid="exec-search-btn"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
