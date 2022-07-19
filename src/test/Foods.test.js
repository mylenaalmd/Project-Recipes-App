import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { foodAPI, foodBreakfast, foodCategories } from './helpers/foodAPI';

describe('Testes do componente Foods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const LINK_API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  const jestMockApi = () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(foodAPI),
      }));
  };

  const categoriesMockApi = () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(foodCategories),
      }));
  };

  it('Testa a chamada do fetch', async () => {
    jestMockApi();

    const { history } = renderWithRouter(<App />);
    history.push('/foods');

    const foodCard = await screen.findByTestId('0-recipe-card');

    expect(foodCard).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  });

  it('Testa se a filtragem por categoria funciona e se com outro click retorna ao All',
    async () => {
      categoriesMockApi();

      const { history } = renderWithRouter(<App />);
      history.push('/foods');

      const btnCategoryBreakfast = await screen.findByTestId('Breakfast-category-filter');
      expect(btnCategoryBreakfast).toBeInTheDocument();

      jest.spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({
          json: () => Promise.resolve(foodBreakfast),
        }));
      userEvent.click(btnCategoryBreakfast);

      const breakCard1 = await screen.findByAltText(/Breakfast Potatoes/i);
      const breakCard2 = await screen.findByAltText(/English Breakfast/i);
      expect(breakCard1).toBeInTheDocument();
      expect(breakCard2).toBeInTheDocument();
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast');

      jestMockApi();
      userEvent.click(btnCategoryBreakfast);

      const allCard1 = await screen.findByAltText(/Corba/i);
      expect(allCard1).toBeInTheDocument();
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(LINK_API);
    });

  it('Testa o botão de filtro `All`', async () => {
    categoriesMockApi();

    const { history } = renderWithRouter(<App />);
    history.push('/foods');

    const btnCategoryBreakfast = await screen.findByTestId('Breakfast-category-filter');
    expect(btnCategoryBreakfast).toBeInTheDocument();

    userEvent.click(btnCategoryBreakfast);

    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast');

    jestMockApi();

    const allBtn = screen.getByTestId('All-category-filter');
    expect(allBtn).toBeInTheDocument();
    userEvent.click(allBtn);

    const allCard1 = await screen.findByAltText(/Corba/i);
    expect(allCard1).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith(LINK_API);
  });
});
