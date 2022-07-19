import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const MAX_RECIPES = 6;
const urlDrink = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?s-';

function FoodDetails({ history: { push } }) {
  const { dataFood, setDataFood, dataDrinks,
    recipesMade, doingRecipe, setDataDrink } = useContext(context);
  const { idRecipe } = useParams();
  const urlFood = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');

  return (
    <div className="detail">
      {dataFood.map((food) => (
        <div
          key={ food.idMeal }
          className="card"
        >
          <img
            src={ food.strMealThumb }
            alt={ food.strMeal }
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{food.strMeal}</h1>
          <h2 data-testid="recipe-category">{food.strCategory}</h2>
          {
            Object.keys(food).filter((key) => key.includes('strIngredient'))
              .map((key, index) => (
                food[key] && (
                  <div key={ key } data-testid={ `${index}-ingredient-name-and-measure` }>
                    <p>{`${food[`strMeasure${index + 1}`]} ${food[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <iframe src={ food.strYoutube } title={ food.strMeal } data-testid="video" />
          {dataDrinks.map((drink, index) => (
            <div
              key={ drink.idDrink }
              className="RecomendationCard"
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
              />
              <h1>{drink.strDrink}</h1>
            </div>
          ))}
          { recipesMade.some((made) => made.idMeal === food.idMeal) === false
          && (
            <button
              className="btn-start-recipe"
              data-testid="start-recipe-btn"
              type="button"
              onClick={ () => push() }
            >
              { doingRecipe.some((doing) => doing.idMeal === food.idMeal)
                ? 'Continue Recipe' : 'Start Recipe' }
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

FoodDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }).isRequired,
};

export default FoodDetails;
