import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import SearchBar from '../components/SearchBar';

describe('Testes do componente SearchBar', () => {
  it('Teste para não ficar vazio', () => {
    renderWithRouter(<SearchBar />);

    const searchInput = screen.getByTestId('search-input');

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'pesquisa');
    expect(searchInput).toHaveValue('pesquisa');
  });
});
