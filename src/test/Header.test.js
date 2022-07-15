import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import Header from '../components/Header';

describe('Testes do componente Header', () => {
  it('Testa se o icon redireciona para /profile', () => {
    const { history } = renderWithRouter(<Header />);

    const iconProfileBtn = screen.getByTestId('profile-top-btn');

    expect(iconProfileBtn).toBeInTheDocument();
    userEvent.click(iconProfileBtn);

    const { pathname } = history.location;
    expect(pathname).toBe('/profile');
  });

  it('Testa se o search funciona corretamente', () => {
    renderWithRouter(<Header title="Foods" isSearch="true" />);

    const btnSearch = screen.getByTestId('search-top-btn');

    expect(btnSearch).toBeInTheDocument();
    userEvent.click(btnSearch);

    const searchBarComponent = screen.getByTestId('search-input');
    expect(searchBarComponent).toBeInTheDocument();
  });
});
