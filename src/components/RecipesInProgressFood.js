import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

const THREE_SECONDS = 3000;

function RecipesInProgressFood() {
  const { pathname } = useLocation();
  const rota = pathname.includes('foods') ? 'meals' : 'cocktails';
  const { idRecipe } = useParams();
  const [meals, setMeals] = useState({ [rota]: { [idRecipe]: [] } });
  const { dataFood, setDataFood, setDoingRecipe, doingRecipe,
    recipesMade, setRecipesMade } = useContext(context);
  const history = useHistory();
  const MAX_RECIPES = 1;
  const [urlFood] = useState(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const saveCheckbox = (dado) => {
    setMeals((prev) => (
      {
        ...prev,
        [rota]: {
          ...prev[rota],
          [idRecipe]: [...prev[rota][idRecipe], dado],
        },

      }
    ));
    setDoingRecipe([...doingRecipe, idRecipe]);
    // console.log(meals);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setMeals(data === null ? { [rota]: { [idRecipe]: [] } } : data);
  }, [idRecipe, rota]);

  useEffect(() => {
    // const dataLocalStorage = () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(meals));
    // };
    // dataLocalStorage();
  }, [meals]);

  useEffect(() => {
    const changeIsFav = () => {
      const alreadyFav = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      if (alreadyFav.length === 0) return setIsFav(false);
      if (dataFood.length === 1) {
        const some = alreadyFav.some((meal) => meal.id === dataFood[0].idMeal);
        setIsFav(some);
      }
    };

    changeIsFav();
  }, [dataFood]);

  const showMessagem = () => {
    setIsCopied(true);
    copy(`http://localhost:3000/foods/${idRecipe}`);
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

  const handleFinish = () => {
    history.push('/done-recipes');
    const filtered = doingRecipe.filter((curr) => curr !== idRecipe);
    setDoingRecipe(filtered);
    setRecipesMade([...recipesMade, idRecipe]);
  };

  return (
    <>
      <div>RecipesInProgress</div>
      { dataFood.map((food) => (
        <div key={ food.idMeal } className="recipesInProgress">
          <h2 data-testid="recipe-title">{food.strMeal}</h2>
          <h4 data-testid="recipe-category">{food.strCategory}</h4>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ showMessagem }
          >
            <img src={ shareIcon } alt="share-btn" />
          </button>
          { isCopied && (<p>Link copied!</p>)}
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
                    <label
                      htmlFor={ i }
                    >
                      <input
                        type="checkbox"
                        id={ i }
                        checked={ meals[rota][idRecipe]
                          .some((made) => (
                            made === `${food[`strMeasure${i + 1}`]} ${food[key]}`)) }
                        onChange={
                          () => saveCheckbox(`${food[`strMeasure${i + 1}`]} ${food[key]}`)
                        }
                      />
                      <p
                        className={ meals[rota][idRecipe]
                          .some((made) => (
                            made === `${food[`strMeasure${i + 1}`]} ${food[key]}`))
                          ? 'checkboxIngredient' : '' }
                      >
                        {`${food[`strMeasure${i + 1}`]} ${food[key]}`}
                      </p>
                    </label>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn "
            disabled={ (Object.entries(food)
              .filter((key) => key[0].includes('strIngredient')
              && key[1]).length !== meals[rota][idRecipe].length) }
            onClick={ () => handleFinish() }
          >
            Finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}

export default RecipesInProgressFood;
