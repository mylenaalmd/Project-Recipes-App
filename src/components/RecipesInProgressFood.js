import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

const THREE_SECONDS = 3000;

function RecipesInProgressFood() {
  const { idRecipe } = useParams();
  const [meals, setMeals] = useState({ [idRecipe]: [] });
  const { dataFood, setDataFood } = useContext(context);
  const history = useHistory();
  const MAX_RECIPES = 1;
  const [urlFood] = useState(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // const saveCheckbox = (dado) => {
  //   setMeals({ [idRecipe]: [...meals[idRecipe], dado] });
  //   localStorage.setItem('inProgressRecipes', JSON.stringify({ meals }));
  // };

  const saveCheckbox = (dado) => {
    setMeals((prev) => (
      {
        ...prev,
        [idRecipe]: [...prev[idRecipe], dado],

      }
    ));
    console.log(meals);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setMeals(data === null ? { [idRecipe]: [] } : data);
  }, [idRecipe]);

  useEffect(() => {
    // const dataLocalStorage = () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(meals));
    // };
    // dataLocalStorage();
  }, [meals]);

  const showMessagem = () => {
    setIsCopied(true);
    copy(`http://localhost:3000/foods/${idRecipe}/in-progress`);
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

  return (
    <>
      <div>RecipesInProgress</div>
      { dataFood.map((food) => (
        <div key={ food.idMeal } className="recipesInProgress">
          { isCopied && (<p>Link copied!</p>)}
          <h2 data-testid="recipe-title">{food.strMeal}</h2>
          <h4 data-testid="recipe-category">{food.strCategory}</h4>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ showMessagem }
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
              .map((key, i) => (
                food[key] && (
                  <div
                    key={ key }
                    data-testid={ `${i}-ingredient-step` }
                  >
                    <label htmlFor="checkbox">
                      <input
                        className="checkboxIngredient"
                        type="checkbox"
                        id={ i }
                        onClick={
                          () => saveCheckbox(`${food[`strMeasure${i + 1}`]} ${food[key]}`)
                        }
                      />
                    </label>
                    <p>{`${food[`strMeasure${i + 1}`]} ${food[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ () => history.push('/done-recipes') }
          >
            Finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}

export default RecipesInProgressFood;
