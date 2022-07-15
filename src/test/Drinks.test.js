import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import drinksAPI from './helpers/drinksAPI';

describe('Testes do componente Drinks', () => {
  it('Testa a chamada do fetch', async () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drinksAPI),
      }));

    const { history } = renderWithRouter(<App />);
    history.push('/drinks');

    const drinkCard = await screen.findByTestId('0-recipe-card');

    expect(drinkCard).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
  });
});
