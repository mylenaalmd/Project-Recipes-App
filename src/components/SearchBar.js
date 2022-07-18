import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import context from '../context/context';

const LIMIT_FETCH = 12;

function SearchBar({ title }) {
  const [valueSearch, setValueSearch] = useState('');
  const [valueRadio, setValueRadio] = useState('ingredient');
  const { setDataFoods, setDataDrinks } = useContext(context);
  const history = useHistory();
  const TEXT_LETTER = 'first letter';

  const handleChange = (callback, { target: { value } }) => {
    callback(value);
  };

  const submitDataFood = (result) => {
    if (result.meals.length === 1) {
      history.push(`/foods/${result.meals[0].idMeal}`);
    } else {
      setDataFoods(result.meals.filter((_el, index) => index < LIMIT_FETCH));
    }
  };

  const submitDataDrink = (result) => {
    if (result.drinks.length === 1) {
      history.push(`/drinks/${result.drinks[0].idDrink}`);
    } else {
      setDataDrinks(result.drinks.filter((_el, index) => index < LIMIT_FETCH));
    }
  };

  const fetchApi = async (url) => {
    try {
      const urlFetch = `${url}${valueSearch}`;
      const response = await fetch(urlFetch);
      const result = await response.json();
      if (title === 'Foods') {
        submitDataFood(result);
      } else {
        submitDataDrink(result);
      }
    } catch (erro) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  };

  const searchFoods = () => {
    if (valueRadio === 'ingredient') return fetchApi('https://www.themealdb.com/api/json/v1/1/filter.php?i=');
    if (valueRadio === 'name') return fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    if (valueRadio === TEXT_LETTER) return fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?f=');
  };

  const searchDrinks = () => {
    if (valueRadio === 'ingredient') return fetchApi('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=');
    if (valueRadio === 'name') return fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    if (valueRadio === TEXT_LETTER) return fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=');
  };

  const searchSubmit = () => {
    if (valueRadio === TEXT_LETTER && valueSearch.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    } else {
      if (title === 'Foods') return searchFoods();
      return searchDrinks();
    }
  };

  return (
    <div className="searchBar">
      <input
        type="text"
        data-testid="search-input"
        value={ valueSearch }
        onChange={ (e) => handleChange(setValueSearch, e) }
      />

      <input
        type="radio"
        name="typeSearch"
        value="ingredient"
        checked={ valueRadio === 'ingredient' }
        data-testid="ingredient-search-radio"
        onChange={ (e) => handleChange(setValueRadio, e) }
      />
      Ingredient
      <input
        type="radio"
        name="typeSearch"
        value="name"
        checked={ valueRadio === 'name' }
        data-testid="name-search-radio"
        onChange={ (e) => handleChange(setValueRadio, e) }
      />
      Name
      <input
        type="radio"
        name="typeSearch"
        value="first letter"
        checked={ valueRadio === TEXT_LETTER }
        data-testid="first-letter-search-radio"
        onChange={ (e) => handleChange(setValueRadio, e) }
      />
      First letter
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ () => searchSubmit() }
      >
        Search
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SearchBar;
