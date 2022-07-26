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
const urlFoods = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

function DrinksDetails({ history: { push }, location: { pathname } }) {
  const { dataDrink, setDataDrink, dataFoods,
    recipesMade, doingRecipe, setDataFoods, setDoingRecipe } = useContext(context);
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
  useFetchIngredients(urlDrink, setDataDrink, setIngredients, 'drinks');
  useFetch(urlFoods, setDataFoods, MAX_RECIPES, 'meals');

  return (
    <div className="detail">
      {dataDrink.length > 0 && dataDrink.map((drink) => (
        <div
          key={ drink.idDrink }
          className="card"
        >
          <img
            src={ drink.strDrinkThumb }
            alt={ drink.strDrink }
            data-testid="recipe-photo"
            className="recipe-img"
          />
          <h1
            data-testid="recipe-title"
            className="title-detail"
          >
            {drink.strDrink}

          </h1>
          <section className="category-container">
            <span
              data-testid="recipe-category"
              className="recipe-category"
            >
              {drink.strAlcoholic}

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
          <main className="recipe-in-progress">
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
              {drink.strInstructions}

            </p>
          </main>
          { recipesMade.some((made) => made === drink.idDrink) === false
            && (
              <button
                className="btn-start-recipe"
                data-testid="start-recipe-btn"
                type="button"
                onClick={ () => push(`${pathname}/in-progress`) }
              >
                { doingRecipe.some((doing) => doing === drink.idDrink)
                  ? 'Continue Recipe' : 'Start Recipe' }
              </button>
            )}
        </div>
      ))}
      <div className="carouselItems">
        {dataFoods.length > 0 && dataFoods.map((food, index) => (
          <div
            key={ food.idMeal }
            className="RecomendationCard"
            data-testid={ `${index}-recomendation-card` }
          >
            <img
              src={ food.strMealThumb }
              alt={ food.strMeal }
            />
            <h1
              data-testid={ `${index}-recomendation-title` }
            >
              {food.strMeal}

            </h1>
          </div>
        ))}
      </div>
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
