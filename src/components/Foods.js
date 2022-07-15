import React, { useContext, useEffect } from 'react';
import context from '../context/context';

function Foods() {
  const { dataFoods, setDataFoods } = useContext(context);
  const MAX_RECIPES = 12;

  useEffect(() => {
    async function fetchApi() {
      const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const response = await fetch(url);
      const result = await response.json();
      setDataFoods(result);
    }
    fetchApi();
  }, [setDataFoods]);

  return (
    <div className="cards">
      {
        Object.keys(dataFoods).length > 0 && dataFoods.meals.map((food, index) => (
          index < MAX_RECIPES
          && (
            <div
              key={ food.idMeal }
              className="card"
              data-testid={ `${index}-recipe-card` }
            >
              <img
                src={ food.strMealThumb }
                alt={ food.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <h1 data-testid={ `${index}-card-name` }>{food.strMeal}</h1>
            </div>
          )
        ))
      }
    </div>
  );
}

export default Foods;
