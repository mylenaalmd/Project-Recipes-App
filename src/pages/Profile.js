import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile({ history: { push } }) {
  const [user, setUser] = useState('email@email.com');

  useEffect(() => {
    const getEmail = async () => {
      const localemail = await localStorage.getItem('user');
      if (localemail) {
        const object = JSON.parse(localemail);
        setUser(object.email);
      }
    };
    getEmail();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    push('/');
  };

  return (
    <section>
      <Header title="Profile" isSearch={ false } />
      <p data-testid="profile-email">{user}</p>
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
      <Footer />
    </section>
  );
}

Profile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }),
}.isRequired;

export default Profile;
