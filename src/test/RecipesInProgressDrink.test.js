import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { chocolateCoffee } from './helpers/drinksAPI';
import doneRecipes from './helpers/doneRecipesAPI';

const INGREDIENTS = [
  '3/4 oz Amaretto',
  '1/2 oz Dark Creme de Cacao',
  '8 oz Coffee',
];

const RECIPES_IN_PROGRESS = {
  cocktails: {
    16082: [],
  },
};

const INITIAL_PATHNAME = '/drinks/16082/in-progress';

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

export default localStorageMock;

describe('Testes do componente Recipes in progress', () => {
  const jestMockApi = () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(chocolateCoffee),
      }));
  };
  const LINK_API = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=16082';

  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jestMockApi();
    localStorageMock.setItem('inProgressRecipes', JSON.stringify(RECIPES_IN_PROGRESS));
    localStorage.setItem('favoriteRecipes', JSON.stringify(STORAGE_MOCK));
    localStorageMock.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  it('Testa a chamada do fetch', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(INITIAL_PATHNAME);

    const foodName = await screen.findByText(/Almond Chocolate Coffee/i);

    expect(foodName).toBeInTheDocument();
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledWith(LINK_API);
  });

  it('Testa se a receita está na tela ao renderizar',
    async () => {
      const { history } = renderWithRouter(<App />);
      history.push(INITIAL_PATHNAME);
      const IMG_URL = 'https://www.thecocktaildb.com/images/media/drink/jls02c1493069441.jpg';

      const recipeTitle = await screen.findByTestId('recipe-title');
      const recipeCategory = await screen.findByTestId('recipe-category');
      const shareBtn = await screen.findByTestId('share-btn');
      const favoriteBtn = await screen.findByTestId('favorite-btn');
      const recipeImage = await screen.findByTestId('recipe-photo');
      const recipeInstructions = await screen.findByTestId('instructions');
      const finishRecipeBtn = await screen.findByTestId('finish-recipe-btn');

      INGREDIENTS.forEach((ingredient) => {
        const ingredientName = screen.queryByText(ingredient);
        expect(ingredientName).toBeInTheDocument();
      });

      expect(recipeTitle).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(shareBtn).toBeInTheDocument();
      expect(favoriteBtn).toBeInTheDocument();
      expect(recipeImage).toHaveAttribute('src', IMG_URL);
      expect(recipeInstructions).toBeInTheDocument();
      expect(finishRecipeBtn).toBeInTheDocument();
      expect(finishRecipeBtn).toBeDisabled();
      // expect(title).toBeInTheDocument();
    });

  // https://stackoverflow.com/questions/50023902/how-can-document-execcommand-be-unit-te

  it('Testa se o botão de compartilhar funciona',
    async () => {
      const { history } = renderWithRouter(<App />);
      history.push(INITIAL_PATHNAME);
      window.document.execCommand = function execCommandMock() { return 'click'; };
      const shareBtn = await screen.findByTestId('share-btn');
      userEvent.click(shareBtn);

      const copiedMessage = await screen.findByText(/link copied!/i);
      expect(copiedMessage).toBeInTheDocument();
    });

  it('Testa se o botão de favoritar funciona', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(INITIAL_PATHNAME);
    const favoriteBtn = await screen.findByTestId('favorite-btn');
    expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');

    userEvent.click(favoriteBtn);
    expect(favoriteBtn).toHaveAttribute('src', 'blackHeartIcon.svg');

    userEvent.click(favoriteBtn);
    expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');
  });

  it('Testa se o checkbox funciona', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(INITIAL_PATHNAME);
    const checkboxName = await screen.findByTestId('0-ingredient');
    expect(checkboxName).not.toBeChecked();

    userEvent.click(checkboxName);
    expect(checkboxName).toBeChecked();
  });

  it('Testa o botão fica habilitado apos concluir', async () => {
    const { history } = renderWithRouter(<App />);
    history.push(INITIAL_PATHNAME);

    const finishRecipeBtn = await screen.findByTestId('finish-recipe-btn');
    expect(finishRecipeBtn).toBeDisabled();

    INGREDIENTS.forEach((_el, index) => {
      const checkboxName = screen.getByTestId(`${index}-ingredient`);
      userEvent.click(checkboxName);
    });
    expect(finishRecipeBtn).toBeEnabled();

    userEvent.click(finishRecipeBtn);
    const { location: { pathname } } = history;
    expect(pathname).toBe('/done-recipes');
  });
  it('Testa se aplicação funciona com o localstorage vazio', async () => {
    localStorage.setItem('inProgressRecipes', []);
    const { history } = renderWithRouter(<App />);
    history.push(INITIAL_PATHNAME);

    const recipeTitle = await screen.findByTestId('recipe-title');
    expect(recipeTitle).toBeInTheDocument();
    const checkboxName = await screen.findByTestId('0-ingredient');
    expect(checkboxName).not.toBeChecked();
  });
});
