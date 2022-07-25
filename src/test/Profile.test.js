import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

// fonte: https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();

const email = 'um@email.com';

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

export default localStorageMock;

describe('Testes da página Profile', () => {
  it('Testa o redirecionamento para DoneRecipes', () => {
    localStorageMock.setItem('doneRecipes', '[]');
    localStorage.setItem('user', JSON.stringify({ email }));
    const { history } = renderWithRouter(<App />);
    history.push('/profile');

    const linkDone = screen.getByTestId('profile-done-btn');
    expect(linkDone).toBeInTheDocument();

    userEvent.click(linkDone);
    const { pathname } = history.location;
    expect(pathname).toBe('/done-recipes');
  });

  it('Testa o redirecionamento para Favorites', () => {
    const { history } = renderWithRouter(<App />);
    localStorageMock.setItem('favoriteRecipes', '[]');
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/profile');

    const linkFavorite = screen.getByTestId('profile-favorite-btn');
    expect(linkFavorite).toBeInTheDocument();

    userEvent.click(linkFavorite);
    const { pathname } = history.location;
    expect(pathname).toBe('/favorite-recipes');
  });

  it('Testa o funcionamento do botão logout', () => {
    const { history } = renderWithRouter(<App />);
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/profile');

    const logoutBtn = screen.getByTestId('profile-logout-btn');
    expect(logoutBtn).toBeInTheDocument();

    userEvent.click(logoutBtn);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
    const resultLocalStorage = localStorageMock.getItem('user');
    expect(resultLocalStorage).toBeUndefined();
  });
});
