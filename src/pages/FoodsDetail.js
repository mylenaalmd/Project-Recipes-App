import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import './RecipeDetails.css';
import useFetchIngredients from '../hooks/useFetchIngredients';

const copy = require('clipboard-copy');

const MAX_RECIPES = 6;
const THREE_SECONDS = 3000;
const urlDrink = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

function FoodDetails({ history: { push }, location: { pathname } }) {
  const { dataFood, setDataFood, dataDrink,
    recipesMade, doingRecipe, setDataDrink, setDoingRecipe } = useContext(context);
  const { idRecipe } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const getDoing = () => {
      const doing = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (doing?.meals) setDoingRecipe(Object.keys(doing.meals));
      if (doing?.cocktails) setDoingRecipe(Object.keys(doing.cocktails));
    };
    getDoing();
  }, [setDoingRecipe]);

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
  useFetchIngredients(urlFood, setDataFood, setIngredients, 'meals');
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');

  return (
    <div className="detail">
      {dataFood.length > 0 && dataFood.map((food) => (
        <div
          key={ food.idMeal }
          className="card"
        >
          <img
            src={ food.strMealThumb }
            alt={ food.strMeal }
            data-testid="recipe-photo"
            className="recipe-img"
          />
          <h1
            data-testid="recipe-title"
            className="title-detail"
          >
            {food.strMeal}

          </h1>
          <section className="category-container">
            <span
              data-testid="recipe-category"
              className="recipe-category"
            >
              {food.strCategory}

            </span>
            <div className="link-copied">
              { isCopied && (<span>Link copied!</span>)}
            </div>
            <nav className="btn-container">
              <button
                type="button"
                data-testid="share-btn"
                onClick={ showMessagem }
                className="btn-detail"
              >
                <img src={ shareIcon } alt="share-btn" />
              </button>
              <button
                type="button"
                onClick={ () => favoriteRecipe(!isFav) }
                className="btn-detail"
              >
                <img
                  data-testid="favorite-btn"
                  alt="favorite-btn"
                  className="favorite-icon"
                  src={ isFav ? (blackHeart) : (whiteHeart) }
                />
              </button>
            </nav>
          </section>
          <main className="recipe-detail">
            <ul>
              {
                ingredients.map((key, index) => (
                  <div
                    key={ key }
                    data-testid={ `${index}-ingredient-name-and-measure` }
                  >
                    <li
                      className="ingredient-list"
                    >
                      {key}

                    </li>
                  </div>
                ))
              }
            </ul>
            <p
              className="instructions"
              data-testid="instructions"
            >
              {food.strInstructions}

            </p>
          </main>
          <iframe
            className="video"
            src={ food.strYoutube }
            title={ food.strMeal }
            data-testid="video"
          />
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
