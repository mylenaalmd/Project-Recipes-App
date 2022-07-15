import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import localStorage from './helpers/localStorage';

describe('Testes da tela de Login', () => {
  it('Testa se ao colocar email e senha corretos o botão fica habilitado', () => {
    renderWithRouter(<Login />);

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

    expect(btnLogin).toBeEnabled();
  });

  it('Testa se ao colocar email e senha inválidos, o botão continua desabilitado', () => {
    renderWithRouter(<Login />);

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
  });

  it('Testa se tem as chaves corretas salvas no localStorage e ocorre o redirecionamento', () => {
    const { history } = renderWithRouter(<Login />);

    const USER_KEY = 'user';
    const MEALSTOKEN_KEY = 'mealsToken';
    const COCKTAILTOKEN_KEY = 'cocktailsToken';
    const TOKEN_VALUE = 1;
    const EMAIL_VALID = 'test@test.com';
    const PASSWORD_VALID = 'senha1';

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

    let getUser = localStorage.getItem(USER_KEY);
    let getMealToken = localStorage.getItem(MEALSTOKEN_KEY);
    let getCocktailToken = localStorage.getItem(COCKTAILTOKEN_KEY);

    setTimeout(() => {
      getUser = localStorage.getItem(USER_KEY);
      getMealToken = localStorage.getItem(MEALSTOKEN_KEY);
      getCocktailToken = localStorage.getItem(COCKTAILTOKEN_KEY);
    }, 2000);

    expect(getUser).toEqual({ email: EMAIL_VALID });
    expect(getCocktailToken).toBe(TOKEN_VALUE);
    expect(getMealToken).toBe(TOKEN_VALUE);

    const { pathname } = history.location;
    expect(pathname).toBe('/foods');;
  });
});