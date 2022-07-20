import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

function RecipesInProgressDrink() {
  const { dataDrink, setDataDrink } = useContext(context);
  const MAX_RECIPES = 1;
  const { idRecipe } = useParams();
  const [urlDrink] = useState(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  const [isFav] = useState(false);
  // const meals = food[0];
  console.log(dataDrink[0]);

  return (
    <>
      <div>RecipesInProgress</div>
      { dataDrink.map((drink, index) => (
        <div key={ drink.idDrink } className="recipesInProgress">
          <h2 data-testid="recipe-title">{drink.strDrink}</h2>
          <h4 data-testid="recipe-category">{drink.strCategory}</h4>
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
              src={ drink.strDrinkThumb }
              alt={ drink.strDrink }
              data-testid="recipe-photo"
            />
          </div>
          {
            Object.keys(drink).filter((key) => key.includes('strIngredient'))
              .map((key) => (
                drink[key] && (
                  <div
                    key={ key }
                    data-testid={ `${index}-ingredient-step` }
                  >
                    <p>{`${drink[`strMeasure${index + 1}`]} ${drink[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{drink.strInstructions}</p>
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
// RecipesInProgressDrink.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired }).isRequired,
// };
export default RecipesInProgressDrink;
