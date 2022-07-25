import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile({ history: { push } }) {
  const [email, setEmail] = useState('email@email.com');

  useEffect(() => {
    const getEmail = async () => {
      const localemail = await JSON.parse(localStorage.getItem('user'));
      if (localemail) setEmail(localemail.email);
    };
    getEmail();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    push('/');
  };

  return (
    <section className="profile">
      <Header title="Profile" isSearch={ false } />
      <p data-testid="profile-email">{email}</p>
      <div className="divProfile">
        <Link
          data-testid="profile-done-btn"
          to="/done-recipes"
          className="profile-done-btn"
        >
          Done Recipes
        </Link>
        <Link
          data-testid="profile-favorite-btn"
          to="/favorite-recipes"
          className="profile-favorite-btn"
        >
          Favorite Recipes
        </Link>
        <button
          type="button"
          className="profile-logout-btn"
          onClick={ () => handleLogout() }
          data-testid="profile-logout-btn"
        >
          Logout
        </button>
      </div>
      <Footer />
    </section>
  );
}

Profile.propTypes = {
  history: PropTypes.objectOf(
    PropTypes.func.isRequired,
  ).isRequired,
};

export default Profile;
