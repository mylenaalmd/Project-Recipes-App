import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import foodAPI from './helpers/foodAPI';
import { firstLetterDrink, firstLetterFood,
  ingredientDrink, ingredientFood, nameDrink, nameFood } from './helpers/searchAPI';

describe('Testes do componente SearchBar', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(foodAPI),
      }));

    const { history } = renderWithRouter(<App />);
    history.push('/foods');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const txtSearchBtn = 'search-top-btn';
  const txtSearchInput = 'search-input';
  const txtExecBtn = 'exec-search-btn';

  it('Testa se consegue buscar por ingrediente (food)', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const INGREDIENT = 'cheese';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(ingredientFood),
      }));

    const ingredientRadio = screen.getByTestId('ingredient-search-radio');
    expect(ingredientRadio).toBeInTheDocument();
    userEvent.click(ingredientRadio);
    userEvent.type(searchInput, INGREDIENT);
    userEvent.click(execBtn);

    const foodWithCheese = await screen.findByText(/big mac/i);
    const foodWithCheese2 = await screen.findByText(/cream cheese tart/i);
    expect(foodWithCheese).toBeInTheDocument();
    expect(foodWithCheese2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=cheese');
  });

  it('Testa se consegue buscar pelo nome (food)', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const NAME = 'big';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(nameFood),
      }));

    const nameRadio = screen.getByTestId('name-search-radio');
    expect(nameRadio).toBeInTheDocument();
    userEvent.click(nameRadio);
    userEvent.type(searchInput, NAME);
    userEvent.click(execBtn);

    const foodNameBig = await screen.findByText(/big mac/i);
    const foodNameBig2 = await screen.findByText(/bigos/i);
    expect(foodNameBig).toBeInTheDocument();
    expect(foodNameBig2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=big');
  });

  it('Testa se consegue buscar pela primeira letra (food)', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const FIRST_LETTER = 'a';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(firstLetterFood),
      }));

    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    expect(firstLetterRadio).toBeInTheDocument();
    userEvent.click(firstLetterRadio);
    userEvent.type(searchInput, FIRST_LETTER);
    userEvent.click(execBtn);

    const foodWithA = await screen.findByText(/Apple Frangipan Tart/i);
    const foodWithA2 = await screen.findByText(/Apple & Blackberry Crumbl/i);
    expect(foodWithA).toBeInTheDocument();
    expect(foodWithA2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
  });

  it('Testa se consegue buscar com todos os filtros (drinks)', async () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(),
      }));
  });
});
