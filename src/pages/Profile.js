import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';

function Profile({ history: { push } }) {
  const email = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    push('/');
  };

  return (
    <section>
      <Header title="Profile" isSearch={ false } />
      <p data-testid="profile-email">{email?.email}</p>
      <Link
        data-testid="profile-done-btn"
        to="/done-recipes"
      >
        Done Recipes

      </Link>
      <Link
        data-testid="profile-favorite-btn"
        to="/favorite-recipes"
      >
        Favorite Recipes

      </Link>
      <button
        type="button"
        onClick={ () => handleLogout() }
        data-testid="profile-logout-btn"
      >
        Logout
      </button>
    </section>
  );
}

Profile.propTypes = {
  history: PropTypes.objectOf(
    PropTypes.func.isRequired,
  ).isRequired,
};

export default Profile;
