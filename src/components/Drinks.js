import React, { useContext, useEffect } from 'react';
import context from '../context/context';

function Foods() {
  const { dataDrinks, setDataDrinks } = useContext(context);
  const MAX_RECIPES = 12;

  useEffect(() => {
    async function fetchApi() {
      const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
      const response = await fetch(url);
      const result = await response.json();
      setDataDrinks(result);
    }
    fetchApi();
  }, [setDataDrinks]);

  return (
    <div className="cards">
      {
        Object.keys(dataDrinks).length > 0 && dataDrinks.drinks.map((drink, index) => (
          index < MAX_RECIPES
          && (
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
          )
        ))
      }
    </div>
  );
}

export default Foods;
