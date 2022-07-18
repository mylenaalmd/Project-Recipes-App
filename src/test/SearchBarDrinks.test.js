import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import drinksAPI from './helpers/drinksAPI';
import App from '../App';
import { firstLetterDrink, abcDrink,
  ingredientDrink, nameDrink } from './helpers/searchAPI';

describe('Testes do componente SearchBar - drinks', () => {
  let historyMock = '';

  beforeEach(() => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drinksAPI),
      }));

    const { history } = renderWithRouter(<App />);
    historyMock = history;
    history.push('/drinks');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const txtSearchBtn = 'search-top-btn';
  const txtSearchInput = 'search-input';
  const txtExecBtn = 'exec-search-btn';

  it('Testa se consegue buscar pelo ingrediente (drinks)', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const INGREDIENT = 'vodka';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(ingredientDrink),
      }));

    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    expect(firstLetterRadio).toBeInTheDocument();
    userEvent.click(firstLetterRadio);
    const ingredientRadio = screen.getByTestId('ingredient-search-radio');
    expect(ingredientRadio).toBeInTheDocument();
    userEvent.click(ingredientRadio);
    userEvent.type(searchInput, INGREDIENT);
    userEvent.click(execBtn);

    const foodWithVodka = await screen.findByText(/155 belmont/i);
    const foodWithVodka2 = await screen.findByText(/501 blue/i);
    expect(foodWithVodka).toBeInTheDocument();
    expect(foodWithVodka2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=vodka');
  });

  it('Testa se consegue buscar pelo nome (drinks)', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const NAME = 'Coffee';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(nameDrink),
      }));

    const nameRadio = screen.getByTestId('name-search-radio');
    expect(nameRadio).toBeInTheDocument();
    userEvent.click(nameRadio);
    userEvent.type(searchInput, NAME);
    userEvent.click(execBtn);

    const drinkName = await screen.findByText(/Thai Coffee/i);
    const drinkName2 = await screen.findByText(/Iced Coffee/i);
    expect(drinkName).toBeInTheDocument();
    expect(drinkName2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Coffee');
  });

  it('Testa se consegue buscar pela primeira letra (drinks)', async () => {
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
        json: () => Promise.resolve(firstLetterDrink),
      }));

    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    expect(firstLetterRadio).toBeInTheDocument();
    userEvent.click(firstLetterRadio);
    userEvent.type(searchInput, FIRST_LETTER);
    userEvent.click(execBtn);

    const drinkWithA = await screen.findByText(/A1/i);
    const drinkWithA2 = await screen.findByText(/ABC/i);
    expect(drinkWithA).toBeInTheDocument();
    expect(drinkWithA2).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
  });

  it('Testa se quando tem apenas uma bebida, muda para a pag de details', async () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const NAME = 'Coffee';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(abcDrink),
      }));

    const nameRadio = screen.getByTestId('name-search-radio');
    expect(nameRadio).toBeInTheDocument();
    userEvent.click(nameRadio);
    userEvent.type(searchInput, NAME);
    userEvent.click(execBtn);

    const { pathname } = historyMock.location;
    expect(pathname).toBe(`/drinks/${abcDrink.drinks[0].idDrink}`);
  });

  it('Verifica mensagem de alerta', () => {
    const searchTopBtn = screen.getByTestId(txtSearchBtn);
    expect(searchTopBtn).toBeInTheDocument();
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(txtSearchInput);
    const execBtn = screen.getByTestId(txtExecBtn);

    expect(searchInput).toBeInTheDocument();
    expect(execBtn).toBeInTheDocument();

    const ALERT_TXT = 'Sorry, we haven\'t found any recipes for these filters.';

    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
          drinks: null,
        }),
      }));

    userEvent.click(execBtn);

    expect(global.alert.name).toBe(ALERT_TXT);
  });
});
