import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import profile from '../images/profileIcon.svg';
import search from '../images/searchIcon.svg';
import SearchBar from './SearchBar';

function Header({ title, isSearch }) {
  const [isSearchBar, setIsSearchBar] = useState(false);

  const changeSearch = () => {
    setIsSearchBar(!isSearchBar);
  };

  return (
    <div className="header">
      <Link
        to="/profile"
      >
        <img src={ profile } alt="profileIcon" data-testid="profile-top-btn" />
      </Link>
      <h1 data-testid="page-title">{title}</h1>
      {
        isSearch
        && (
          <button
            className="search-top-btn"
            type="button"
            onClick={ () => changeSearch() }
          >
            <img
              src={ search }
              alt="searchIcon"
              data-testid="search-top-btn"
            />
          </button>
        )
      }
      {
        isSearchBar && <SearchBar title={ title } />
      }
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isSearch: PropTypes.bool.isRequired,
};

export default Header;
