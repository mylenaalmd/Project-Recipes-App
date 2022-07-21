import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './src/test/helpers/renderWithRouter';
import App from './src/App';
import { drinksAPI, drinksShake, drinksCategory } from './src/test/helpers/drinksAPI';

describe('Testes do componente Drinks', () => {
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
    expect(global.fetch).toBeCalledWith(LINK_API);
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

      const shakeCard1 = await screen.findByAltText('151 Florida Bushwacker');
      const shakeCard2 = await screen.findByAltText('Avalanche');
      expect(shakeCard1).toBeInTheDocument();
      expect(shakeCard2).toBeInTheDocument();
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake');

      jestMockApi();
      userEvent.click(btnCategoryShake);

      const allCard1 = await screen.findByAltText('GG');
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

    const allCard1 = await screen.findByAltText('GG');
    expect(allCard1).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith(LINK_API);
  });
});
