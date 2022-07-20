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
const urlFoods = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

function DrinksDetails({ history: { push }, location: { pathname } }) {
  const { dataDrink, setDataDrink, dataFoods,
    recipesMade, doingRecipe, setDataFoods } = useContext(context);
  const { idRecipe } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const changeIsFav = () => {
      const alreadyFav = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      if (alreadyFav.length === 0) return setIsFav(false);
      if (dataDrink.length === 1) {
        const some = alreadyFav.some((drink) => drink.id === dataDrink[0].idDrink);
        setIsFav(some);
      }
    };

    changeIsFav();
  }, [dataDrink]);

  const showMessagem = () => {
    setIsCopied(true);
    copy(`http://localhost:3000${pathname}`);
    setTimeout(() => {
      setIsCopied(false);
    }, THREE_SECONDS);
  };

  const favoriteRecipe = (change) => {
    const { idDrink, strDrink,
      strCategory, strAlcoholic, strDrinkThumb } = dataDrink[0];
    const alreadyFav = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (change) {
      const newFav = {
        id: idDrink,
        type: 'drink',
        nationality: '',
        category: strCategory,
        alcoholicOrNot: strAlcoholic,
        name: strDrink,
        image: strDrinkThumb,
      };
      alreadyFav.push(newFav);
      localStorage.setItem('favoriteRecipes', JSON.stringify(alreadyFav));
      setIsFav(true);
    } else {
      const filtered = alreadyFav.filter((drink) => drink.id !== idDrink);
      localStorage.setItem('favoriteRecipes', JSON.stringify(filtered));
      setIsFav(false);
    }
  };

  const urlDrink = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  useFetch(urlFoods, setDataFoods, MAX_RECIPES, 'meals');

  return (
    <div className="detail">
      {dataDrink.map((drink) => (
        <div
          key={ drink.idDrink }
          className="card"
        >
          { isCopied && (<p>Link copied!</p>)}
          <img
            src={ drink.strDrinkThumb }
            alt={ drink.strDrink }
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{drink.strDrink}</h1>
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
              className="RecomendationCard"
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
              onClick={ () => push(`${pathname}/in-progress`) }
            >
              { doingRecipe.some((doing) => doing.idDrink === drink.idDrink)
                ? 'Continue Recipe' : 'Start Recipe' }
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="ButtonRecipe"
        data-testid="start-recipe-btn"
      >
        Start Recipe
      </button>
    </div>
  );
}

DrinksDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired }).isRequired,
};

export default DrinksDetails;
