import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import { burek } from './helpers/foodAPI';
import { drinksAPI } from './helpers/drinksAPI';

// https://stackoverflow.com/questions/50023902/how-can-document-execcommand-be-unit-te
// fonte: https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

const STORAGE_RESULT = '[{"id":"53060","type":"food","nationality":"Croatian","category":"Side","alcoholicOrNot":"","name":"Burek","image":"https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg"}]';

const STORAGE_RESULT_PARSE = { alcoholicOrNot: '',
  category: 'Side',
  id: '53060',
  image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
  name: 'Burek',
  nationality: 'Croatian',
  type: 'food' };

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

describe('Testes do componente FoodDetails', () => {
  const customBeforeEach = (initialStorage) => {
    jest.spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(burek),
      }));

    localStorage.setItem('inProgressRecipes', JSON.stringify([]));
    localStorage.setItem('favoriteRecipes', JSON.stringify(initialStorage));
    const { history } = renderWithRouter(<App />);
    history.push('/foods/53060');
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
        json: () => Promise.resolve(drinksAPI),
      }));

    const { history } = renderWithRouter(<App />);
    history.push('/foods/53060');

    const card1 = await screen.findByTestId('0-recomendation-card');
    expect(card1).toBeInTheDocument();
  });
});
