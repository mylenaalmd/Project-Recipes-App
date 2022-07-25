import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
// import { foodAPI, foodBreakfast, foodCategories } from './helpers/foodAPI';
import { drinksAPI, drinksCategory, drinksShake } from './helpers/drinksAPI';

describe('Testes do componente Foods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const LINK_API = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

  const jestMockApi = () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drinksAPI),
      }));
  };

  const categoriesMockApi = () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drinksCategory),
      }));
  };

  it('Testa a chamada do fetch', async () => {
    jestMockApi();

    const { history } = renderWithRouter(<App />);
    history.push('/drinks');

    const drinkCard = await screen.findByTestId('0-recipe-card');

    expect(drinkCard).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
  });

  it('Testa se a filtragem por categoria funciona e se com outro click retorna ao All',
    async () => {
      categoriesMockApi();

      const { history } = renderWithRouter(<App />);
      history.push('/drinks');

      const btnCategoryShake = await screen.findByTestId('Shake-category-filter');
      expect(btnCategoryShake).toBeInTheDocument();

      jest.spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({
          json: () => Promise.resolve(drinksShake),
        }));
      userEvent.click(btnCategoryShake);

      const breakCard1 = await screen.findByText(/151 Florida Bushwacker/i);
      const breakCard2 = await screen.findByText(/Avalanche/i);
      expect(breakCard1).toBeInTheDocument();
      expect(breakCard2).toBeInTheDocument();
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake');

      jestMockApi();
      userEvent.click(btnCategoryShake);

      const allCard1 = await screen.findByAltText(/GG/i);
      expect(allCard1).toBeInTheDocument();
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(LINK_API);
    });

  it('Testa o botão de filtro `All`', async () => {
    categoriesMockApi();

    const { history } = renderWithRouter(<App />);
    history.push('/drinks');

    const btnCategoryShake = await screen.findByTestId('Shake-category-filter');
    expect(btnCategoryShake).toBeInTheDocument();

    userEvent.click(btnCategoryShake);

    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake');

    jestMockApi();

    const allBtn = screen.getByTestId('All-category-filter');
    expect(allBtn).toBeInTheDocument();
    userEvent.click(allBtn);

    const allCard1 = await screen.findByAltText(/GG/i);
    expect(allCard1).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith(LINK_API);
  });
});
