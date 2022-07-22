import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

const MAX_RECIPES = 6;
const THREE_SECONDS = 3000;
const urlDrink = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

function FoodDetails({ history: { push }, location: { pathname } }) {
  const { dataFood, setDataFood, dataDrink,
    recipesMade, doingRecipe, setDataDrink } = useContext(context);
  const { idRecipe } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  console.log(doingRecipe);
  useEffect(() => {
    const changeIsFav = () => {
      const alreadyFav = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      if (alreadyFav.length === 0) return setIsFav(false);
      if (dataFood.length === 1) {
        const some = alreadyFav.some((meal) => meal?.id === dataFood[0].idMeal);
        setIsFav(some);
      }
    };

    changeIsFav();
  }, [dataFood]);

  const showMessagem = () => {
    setIsCopied(true);
    copy(`http://localhost:3000${pathname}`);
    setTimeout(() => {
      setIsCopied(false);
    }, THREE_SECONDS);
  };

  const favoriteRecipe = (change) => {
    const { idMeal, strMeal, strArea,
      strCategory, strMealThumb } = dataFood[0];
    const alreadyFav = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (change) {
      const newFav = {
        id: idMeal,
        type: 'food',
        nationality: strArea,
        category: strCategory,
        alcoholicOrNot: '',
        name: strMeal,
        image: strMealThumb,
      };
      alreadyFav.push(newFav);
      localStorage.setItem('favoriteRecipes', JSON.stringify(alreadyFav));
      setIsFav(true);
    } else {
      const filtered = alreadyFav.filter((food) => food.id !== idMeal);
      localStorage.setItem('favoriteRecipes', JSON.stringify(filtered));
      setIsFav(false);
    }
  };

  const urlFood = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');

  return (
    <div className="detail">
      {dataFood.length > 0 && dataFood.map((food) => (
        <div
          key={ food.idMeal }
          className="card"
        >
          { isCopied && (<p>Link copied!</p>)}
          <img
            src={ food.strMealThumb }
            alt={ food.strMeal }
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{food.strMeal}</h1>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ showMessagem }
          >
            <img src={ shareIcon } alt="share-btn" />
          </button>
          <button
            type="button"
            onClick={ () => favoriteRecipe(!isFav) }
          >
            <img
              data-testid="favorite-btn"
              alt="favorite-btn"
              src={ isFav ? (blackHeart) : (whiteHeart) }
            />
          </button>
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
          { recipesMade.some((made) => made === food.idMeal) === false
          && (
            <button
              className="btn-start-recipe"
              data-testid="start-recipe-btn"
              type="button"
              onClick={ () => push(`${pathname}/in-progress`) }
            >
              { doingRecipe.some((doing) => doing === food.idMeal)
                ? 'Continue Recipe' : 'Start Recipe' }
            </button>
          )}
        </div>
      ))}
      <div className="carouselItems">
        {dataDrink.length > 0 && dataDrink.map((drink, index) => (
          <div
            key={ drink.idDrink }
            className="RecomendationCard"
            data-testid={ `${index}-recomendation-card` }
          >
            <img
              src={ drink.strDrinkThumb }
              alt={ drink.strDrink }
            />
            <h1 data-testid={ `${index}-recomendation-title` }>{drink.strDrink}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

FoodDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired }).isRequired,
};

export default FoodDetails;
