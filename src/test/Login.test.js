import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import Login from '../pages/Login';

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
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Testes da tela de Login', () => {
  it('Testa se ao colocar email e senha válidose inválidos', () => {
    renderWithRouter(<Login />);

    const EMAIL_VALID = 'test@test.com';
    const PASSWORD_VALID = 'senha12';
    const EMAIL_INVALID = 'test@1test.com.br';
    const PASSWORD_INVALID = 'senha';

    const inputEmail = screen.getByTestId('email-input');
    const inputPass = screen.getByTestId('password-input');
    const btnLogin = screen.getByTestId('login-submit-btn');

    expect(inputEmail).toBeInTheDocument();
    expect(inputPass).toBeInTheDocument();
    expect(btnLogin).toBeInTheDocument();
    expect(btnLogin).toBeDisabled();

    userEvent.type(inputEmail, EMAIL_INVALID);
    userEvent.type(inputPass, PASSWORD_INVALID);

    expect(btnLogin).toBeDisabled();

    userEvent.type(inputEmail, EMAIL_VALID);
    userEvent.type(inputPass, PASSWORD_VALID);

    expect(btnLogin).toBeEnabled();
  });

  it('Testa se tem as chaves no localStorage e ocorre o redirecionamento',
    () => {
      const { history } = renderWithRouter(<Login />);

      const USER_KEY = 'user';
      const MEALSTOKEN_KEY = 'mealsToken';
      const COCKTAILTOKEN_KEY = 'cocktailsToken';
      const TOKEN_VALUE = '1';
      const EMAIL_VALID = 'test@test.com';
      const PASSWORD_VALID = 'senha12';

      const inputEmail = screen.getByTestId('email-input');
      const inputPass = screen.getByTestId('password-input');
      const btnLogin = screen.getByTestId('login-submit-btn');

      expect(inputEmail).toBeInTheDocument();
      expect(inputPass).toBeInTheDocument();
      expect(btnLogin).toBeInTheDocument();
      expect(btnLogin).toBeDisabled();

      userEvent.type(inputEmail, EMAIL_VALID);
      userEvent.type(inputPass, PASSWORD_VALID);
      userEvent.click(btnLogin);

      const getUser = localStorage.getItem(USER_KEY);
      const getMealToken = localStorage.getItem(MEALSTOKEN_KEY);
      const getCocktailToken = localStorage.getItem(COCKTAILTOKEN_KEY);

      expect(getUser).toEqual(JSON.stringify({ email: EMAIL_VALID }));
      expect(getCocktailToken).toBe(TOKEN_VALUE);
      expect(getMealToken).toBe(TOKEN_VALUE);

      const { pathname } = history.location;
      expect(pathname).toBe('/foods');
    });
});
