import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import foodAPI from './helpers/foodAPI';

describe('Testes do componente Foods', () => {
  it('Testa a chamada do fetch', async () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(foodAPI),
      }));

    const { history } = renderWithRouter(<App />);
    history.push('/foods');

    const foodCard = await screen.findByTestId('0-recipe-card');

    expect(foodCard).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  });
});
