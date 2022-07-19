import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const MAX_RECIPES = 6;
const urlFoods = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

function DrinksDetails() {
  const { dataDrink, setDataDrink, dataFoods,
    recipesMade, doingRecipe, setDataFood } = useContext(context);
  const { idRecipe } = useParams();
  const urlDrink = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlFoods, setDataFood, MAX_RECIPES, 'meals');
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
          {dataFoods.map((food, index) => (
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
          { recipesMade.some((made) => made.idDrink === drink.idDrink) === false
          && (
            <button
              className="btn-start-recipe"
              data-testid="start-recipe-btn"
              type="button"
              onClick={ () => push() }
            >
              { doingRecipe?.some((doing) => doing.idDrink === drink.idDrink)
                ? 'Continue Recipe' : 'Start Recipe' }
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default DrinksDetails;
