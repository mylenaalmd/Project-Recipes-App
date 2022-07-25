import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const NUMBER = 1;

const initialUrlDrinks = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const urlDrinksCategory = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const MAX_CATEGORIES = 5;
const MAX_RECIPES = 12;
function Drinks() {
  const {
    dataDrinks,
    dataDrinksCategory,
    setDataDrinks,
    setDataDrinksCategory,
  } = useContext(context);
  const [urlDrinks, setUrlDrinks] = useState('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
  const [filterAtual, setFilterAtual] = useState('');
  useFetch(urlDrinks, setDataDrinks, MAX_RECIPES, 'drinks');
  useFetch(urlDrinksCategory, setDataDrinksCategory, MAX_CATEGORIES, 'drinks');

  const toggleClick = (category) => {
    if (category === '' || filterAtual === category) {
      setUrlDrinks(initialUrlDrinks);
    } else {
      setUrlDrinks(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    }
    setFilterAtual(category);
  };
  return (
    <div>
      {(dataDrinks.length && dataDrinksCategory.length) > 0 && (
        <div>
          <div className="categories">
            <button
              type="button"
              key="All"
              className="strCategory-category-filter1"
              data-testid="All-category-filter"
              onClick={ () => toggleClick('') }
            >
              All
            </button>
            {dataDrinksCategory
              .map(({ strCategory }, index) => (
                <button
                  type="button"
                  key={ strCategory }
                  className={ index <= NUMBER
                    ? 'strCategory-category-filter1' : 'strCategory-category-filter2' }
                  data-testid={ `${strCategory}-category-filter` }
                  onClick={ () => toggleClick(strCategory) }
                >
                  {strCategory}
                </button>))}
          </div>
          <div className="cards">
            {dataDrinks.map((drink, index) => (
              <Link to={ `/drinks/${drink.idDrink}` } key={ drink.idDrink }>
                <div
                  className="card"
                  data-testid={ `${index}-recipe-card` }
                >
                  <img
                    src={ drink.strDrinkThumb }
                    alt={ drink.strDrink }
                    data-testid={ `${index}-card-img` }
                  />
                  <h1 data-testid={ `${index}-card-name` }>{drink.strDrink}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>)}
    </div>);
}

export default Drinks;
