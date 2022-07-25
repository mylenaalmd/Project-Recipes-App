import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
// import useFetch from '../hooks/useFetch';

// const urlFood = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
// const urlFoodCategory = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
// const urlDrinks = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
// const urlDrinksCategory = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
// const MAX_CATEGORIES = 5;
// const MAX_RECIPES = 12;
function Provider({ children }) {
  const [dataFoods, setDataFoods] = useState([]);
  const [dataFoodsCategory, setDataFoodsCategory] = useState([]);
  const [dataDrinks, setDataDrinks] = useState([]);
  const [dataDrinksCategory, setDataDrinksCategory] = useState([]);
  const [dataFood, setDataFood] = useState([]);
  const [dataDrink, setDataDrink] = useState([]);
  const [recipesMade, setRecipesMade] = useState([]);
  const [doingRecipe, setDoingRecipe] = useState([]);

  // useFetch(urlFood, setDataFoods, MAX_RECIPES, 'meals');
  // useFetch(urlFoodCategory, setDataFoodsCategory, MAX_CATEGORIES, 'meals');
  // useFetch(urlDrinks, setDataDrinks, MAX_RECIPES, 'drinks');
  // useFetch(urlDrinksCategory, setDataDrinksCategory, MAX_CATEGORIES, 'drinks');

  // useEffect(() => {
  //   const getDoing = () => {
  //     const doing = JSON.parse(localStorage.getItem('inProgressRecipes'));
  //     if (doing?.meals) setDoingRecipe(Object.keys(doing.meals));
  //     if (doing?.cocktails) setDoingRecipe(Object.keys(doing.cocktails));
  //   };
  //   getDoing();
  // }, []);

  const context = {
    dataFoods,
    setDataFoods,
    dataFoodsCategory,
    setDataFoodsCategory,
    dataDrinks,
    setDataDrinks,
    dataDrinksCategory,
    setDataDrinksCategory,
    dataFood,
    setDataFood,
    dataDrink,
    setDataDrink,
    recipesMade,
    setRecipesMade,
    doingRecipe,
    setDoingRecipe,
  };
  return (
    <Context.Provider value={ context }>
      { children }
    </Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.any,
    ),
  ).isRequired,
};

export default Provider;
