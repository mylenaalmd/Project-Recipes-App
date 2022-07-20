import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

function RecipesInProgressFood() {
  const { dataFood, setDataFood } = useContext(context);
  const MAX_RECIPES = 1;
  const { idRecipe } = useParams();
  const [urlFood] = useState(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');
  const [isFav] = useState(false);
  // const meals = food[0];
  console.log(dataFood[0]);

  return (
    <>
      <div>RecipesInProgress</div>
      { dataFood.map((food, index) => (
        <div key={ food.idMeal } className="recipesInProgress">
          <h2 data-testid="recipe-title">{food.strMeal}</h2>
          <h4 data-testid="recipe-category">{food.strCategory}</h4>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ () => shareBtn() }
          >
            <img src={ shareIcon } alt="share-btn" />
          </button>
          <button
            type="button"
            data-testid="favorite-btn"
            onClick={ () => favoriteRecipe(!isFav) }
          >
            <img
              data-testid="favorite-btn"
              alt="favorite-btn"
              src={ isFav ? (blackHeart) : (whiteHeart) }
            />
          </button>
          <div
            className="card"
          >
            <img
              src={ food.strMealThumb }
              alt={ food.strMeal }
              data-testid="recipe-photo"
            />
          </div>
          {
            Object.keys(food).filter((key) => key.includes('strIngredient'))
              .map((key) => (
                food[key] && (
                  <div
                    key={ key }
                    data-testid={ `${index}-ingredient-step` }
                  >
                    <label htmlFor="checkbox">
                      <input
                        className="checkboxIngredient"
                        type="checkbox"
                        value="checkbox"
                      />
                    </label>
                    <p>{`${food[`strMeasure${index + 1}`]} ${food[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ () => push('/done-recipes') }
          >
            finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}

// RecipesInProgressFood.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired }).isRequired,
// };
export default RecipesInProgressFood;
