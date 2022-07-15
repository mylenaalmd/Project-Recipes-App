import React, { useContext } from 'react';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const urlDrinks = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
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
  useFetch(urlDrinks, setDataDrinks, MAX_RECIPES, 'drinks');
  useFetch(urlDrinksCategory, setDataDrinksCategory, MAX_CATEGORIES, 'drinks');
  return (
    <div>
      {(dataDrinks.length && dataDrinksCategory.length) > 0 && (
        <div>
          <div className="categories">
            {dataDrinksCategory
              .map(({ strCategory }) => (
                <button
                  type="button"
                  key={ strCategory }
                  data-testid={ `${strCategory}-category-filter` }
                >
                  {strCategory}
                </button>))}
          </div>
          <div className="cards">
            {dataDrinks.map((drink, index) => (
              <div
                key={ drink.idDrink }
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
            ))}
          </div>
        </div>)}
    </div>);
}

export default Drinks;
