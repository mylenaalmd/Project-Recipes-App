import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { foodAPI } from './helpers/foodAPI';
import { abcDrink } from './helpers/searchAPI';

// https://stackoverflow.com/questions/50023902/how-can-document-execcommand-be-unit-te
// fonte: https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

const STORAGE_RESULT = '[{"id":"13501","type":"drink","nationality":"","category":"Shot","alcoholicOrNot":"Alcoholic","name":"ABC","image":"https://www.thecocktaildb.com/images/media/drink/tqpvqp1472668328.jpg"}]';

const STORAGE_RESULT_PARSE = { alcoholicOrNot: 'Alcoholic',
  category: 'Shot',
  id: '13501',
  image: 'https://www.thecocktaildb.com/images/media/drink/tqpvqp1472668328.jpg',
  name: 'ABC',
  nationality: '',
  type: 'drink' };

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

describe('Testes do componente DrinkDetails', () => {
  const customBeforeEach = (initialStorage) => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(abcDrink),
      }));

    localStorage.setItem('inProgressRecipes', JSON.stringify([]));
    localStorage.setItem('favoriteRecipes', JSON.stringify(initialStorage));
    const { history } = renderWithRouter(<App />);
    history.push('/drinks/13501');
  };

  const txtFavBtn = 'favorite-btn';

  it('Testa a possibilidade de favoritar uma receita', async () => {
    customBeforeEach([]);
    const favoriteBtn = await screen.findByTestId(txtFavBtn);
    expect(favoriteBtn).toBeInTheDocument();
    expect(favoriteBtn).toHaveAttribute('src');
    expect(favoriteBtn).toContainHTML('whiteHeart');

    userEvent.click(favoriteBtn);

    const localMock = localStorage.getItem('favoriteRecipes');
    expect(localMock).toBe(STORAGE_RESULT);
    const favoritadoBtn = await screen.findByTestId(txtFavBtn);
    expect(favoritadoBtn).toBeInTheDocument();
    expect(favoritadoBtn).toContainHTML('blackHeart');
  });

  it('Testa a possibilidade de desfavoritar uma receita', async () => {
    customBeforeEach([STORAGE_RESULT_PARSE]);

    const favoriteBtn = await screen.findByTestId(txtFavBtn);
    expect(favoriteBtn).toBeInTheDocument();
    expect(favoriteBtn).toHaveAttribute('src');
    expect(favoriteBtn).toContainHTML('blackHeart');

    userEvent.click(favoriteBtn);

    const localMock = (localStorageMock.getItem('favoriteRecipes'));
    expect(localMock).toBe('[]');
  });

  it('Testa a funcionalidade de copiar', async () => {
    customBeforeEach([]);

    window.document.execCommand = function execCommandMock() { return 'click'; };

    const THREE_SECONDS = 3000;
    const btnCopy = await screen.findByTestId('share-btn');
    expect(btnCopy).toBeInTheDocument();
    userEvent.click(btnCopy);

    const linkCopiedTxt = await screen.findByText(/Link copied!/i);
    expect(linkCopiedTxt).toBeInTheDocument();

    setTimeout(() => {
      expect(linkCopiedTxt).not.toBeInTheDocument();
    }, THREE_SECONDS);
  });

  it('Testa se existe os cards de recomendação', async () => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(foodAPI),
      }));

    const { history } = renderWithRouter(<App />);
    history.push('/drinks/13501');

    const card1 = await screen.findByTestId('0-recomendation-card');
    expect(card1).toBeInTheDocument();
  });
});
