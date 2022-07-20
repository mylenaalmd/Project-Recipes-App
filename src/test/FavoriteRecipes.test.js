import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';

// https://stackoverflow.com/questions/50023902/how-can-document-execcommand-be-unit-te
// fonte: https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

const STORAGE_MOCK = [
  { alcoholicOrNot: '',
    category: 'Side',
    id: '52977',
    image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    name: 'Corba',
    nationality: 'Turkish',
    type: 'food' },
  {
    alcoholicOrNot: '',
    category: 'Side',
    id: '53060',
    image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    name: 'Burek',
    nationality: 'Croatian',
    type: 'food',
  },
  {
    alcoholicOrNot: 'Alcoholic',
    category: 'Shot',
    id: '13501',
    image: 'https://www.thecocktaildb.com/images/media/drink/tqpvqp1472668328.jpg',
    name: 'ABC',
    nationality: '',
    type: 'drink',
  },
];

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Testes do componente favoriteRecipes', () => {
  const customBeforeEach = () => {
    const { history } = renderWithRouter(<App />);
    localStorage.setItem('favoriteRecipes', JSON.stringify(STORAGE_MOCK));
    history.push('/favorite-recipes');
  };

  it('Testa os filtros - Food, Drinks e All', async () => {
    customBeforeEach();
    const food1 = await screen.findByText(STORAGE_MOCK[0].name);
    const food2 = await screen.findByText(STORAGE_MOCK[1].name);
    const drink1 = await screen.findByText(STORAGE_MOCK[2].name);

    const btnFood = screen.getByTestId('filter-by-food-btn');
    const btnDrinks = screen.getByTestId('filter-by-drink-btn');
    const btnAll = screen.getByTestId('filter-by-all-btn');

    const all = [food1, food2, drink1, btnAll, btnDrinks, btnFood];
    const foods = [food1, food2];

    all.forEach((curr) => { expect(curr).toBeInTheDocument(); });

    userEvent.click(btnFood);
    foods.forEach((curr) => { expect(curr).toBeInTheDocument(); });
    expect(drink1).not.toBeInTheDocument();

    userEvent.click(btnDrinks);
    foods.forEach((curr) => { expect(curr).not.toBeInTheDocument(); });
    const drinkAgain = await screen.findByText(STORAGE_MOCK[2].name);
    expect(drinkAgain).toBeInTheDocument();

    userEvent.click(btnAll);
    const food1Again = await screen.findByText(STORAGE_MOCK[0].name);
    const food2Again = await screen.findByText(STORAGE_MOCK[1].name);
    expect(drinkAgain).toBeInTheDocument();
    expect(food1Again).toBeInTheDocument();
    expect(food2Again).toBeInTheDocument();
  });

  it('Testa se é possível remover dos favoritos', async () => {
    customBeforeEach();
    const food1 = await screen.findByText(STORAGE_MOCK[0].name);
    const food2 = await screen.findByText(STORAGE_MOCK[1].name);
    const drink1 = await screen.findByText(STORAGE_MOCK[2].name);
    const btnFav = await screen.findByTestId('0-horizontal-favorite-btn');

    const all = [food1, food2, drink1, btnFav];
    all.forEach((curr) => { expect(curr).toBeInTheDocument(); });

    userEvent.click(btnFav);
    expect(food1).not.toBeInTheDocument();
    expect(food2).toBeInTheDocument();
    expect(drink1).toBeInTheDocument();
  });

  it('Testa a função de copiar o link da receita', async () => {
    customBeforeEach();

    window.document.execCommand = function execCommandMock() { return 'click'; };

    const THREE_SECONDS = 3000;
    const btnCopy = await screen.findByTestId('0-horizontal-share-btn');
    expect(btnCopy).toBeInTheDocument();
    userEvent.click(btnCopy);

    const linkCopiedTxt = await screen.findByText(/Link copied!/i);
    expect(linkCopiedTxt).toBeInTheDocument();

    setTimeout(() => {
      expect(linkCopiedTxt).not.toBeInTheDocument();
    }, THREE_SECONDS);
  });
});
