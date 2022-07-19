import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

// const urlFoods = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const MAX_RECIPES = 6;

function Drinks() {
  const { dataDrink, setDataDrink, dataFoods } = useContext(context);
  const { idRecipe } = useParams();
  const urlDrink = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  return (
    <div className="detail">
      {dataDrink.map((drink) => (
        <div
          key={ drink.idDrink }
          className="card"
        >
          <img
            src={ drink.strDrinkThumb }
            alt={ drink.strDrink }
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{drink.strDrink}</h1>
          <h2 data-testid="recipe-category">{drink.strAlcoholic}</h2>
          {
            Object.keys(drink).filter((key) => key.includes('strIngredient'))
              .map((key, index) => (
                drink[key] && (
                  <div key={ key } data-testid={ `${index}-ingredient-name-and-measure` }>
                    <p>{`${drink[`strMeasure${index + 1}`]} ${drink[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{drink.strInstructions}</p>
          {dataFoods.map((food, index) => index < MAX_RECIPES && (
            <div
              key={ food.idMeal }
              className="card"
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                src={ food.strMealThumb }
                alt={ food.strMeal }
              />
              <h1>{food.strMeal}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Drinks;
