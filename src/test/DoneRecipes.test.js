import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import doneRecipes from './helpers/doneRecipesAPI';

const RECIPES_IN_PROGRESS = {
  meals: {
    53060: [],
  },
  cocktails: {
    16082: [],
  },
};
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

export default localStorageMock;

describe('Testes do componente Done Recipes', () => {
  beforeEach(() => {
    const { history } = renderWithRouter(<App />);
    localStorageMock.setItem('doneRecipes', JSON.stringify(doneRecipes));
    localStorageMock.setItem('inProgressRecipes', JSON.stringify(RECIPES_IN_PROGRESS));
    history.push('/done-recipes');
  });
  it('Testa se o titulo e os botões de filtragem estão na tela ao renderizar',
    () => {
      const title = screen.getByText(/done recipes/i);
      const btnAll = screen.getByText(/all/i);
      const btnFood = screen.getByText(/food/i);
      const btnDrinks = screen.getByText(/drinks/i);
      expect(btnAll).toBeInTheDocument();
      expect(btnFood).toBeInTheDocument();
      expect(btnDrinks).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

  it('Testa se todas as receitas favoritas estão na tela ao renderizar',
    () => {
      doneRecipes.forEach((_element, index) => {
        const recipeImage = screen.getByTestId(`${index}-horizontal-image`);
        const recipeCategory = screen.getByTestId(`${index}-horizontal-top-text`);
        const recipeName = screen.getByTestId(`${index}-horizontal-name`);
        const recipeDate = screen.getByTestId(`${index}-horizontal-done-date`);
        const recipeShareBtn = screen.getByTestId(`${index}-horizontal-share-btn`);
        expect(recipeImage).toBeInTheDocument();
        expect(recipeCategory).toBeInTheDocument();
        expect(recipeName).toBeInTheDocument();
        expect(recipeDate).toBeInTheDocument();
        expect(recipeShareBtn).toBeInTheDocument();
      });
      const tag1 = screen.getByTestId('0-Pasta-horizontal-tag');
      const tag2 = screen.getByTestId('0-Curry-horizontal-tag');
      expect(tag1).toBeInTheDocument();
      expect(tag2).toBeInTheDocument();
    });

  it('Testa se o filtro funciona',
    () => {
      const foodName = () => screen.queryByText('Spicy Arrabiata Penne');
      const drinkName = () => screen.queryByText('Aquamarine');
      const btnAll = screen.getByTestId('filter-by-all-btn');
      const btnFood = screen.getByTestId('filter-by-food-btn');
      const btnDrink = screen.getByTestId('filter-by-drink-btn');

      userEvent.click(btnFood);
      expect(drinkName()).not.toBeInTheDocument();
      expect(foodName()).toBeInTheDocument();

      userEvent.click(btnAll);
      expect(drinkName()).toBeInTheDocument();
      expect(foodName()).toBeInTheDocument();

      userEvent.click(btnDrink);
      expect(drinkName()).toBeInTheDocument();
      expect(foodName()).not.toBeInTheDocument();
    });

  // https://stackoverflow.com/questions/50023902/how-can-document-execcommand-be-unit-te

  it('Testa se o botão de compartilhar funciona',
    async () => {
      window.document.execCommand = function execCommandMock() { return 'click'; };
      const shareBtn = screen.getByTestId('0-horizontal-share-btn');
      userEvent.click(shareBtn);

      const copiedMessage = await screen.findByText(/link copied!/i);
      expect(copiedMessage).toBeInTheDocument();
    });
});
