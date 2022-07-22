import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import useFetch from '../hooks/useFetch';
import useFetchIngredients from '../hooks/useFetchIngredients';
import context from '../context/context';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

// const THREE_SECONDS = 3000;

// const laland = JSON.parse(localStorage.getItem('inProgressRecipes'));

function RecipesInProgressFood() {
  const { pathname } = useLocation();
  const rota = pathname.includes('foods') && 'meals';
  const { idRecipe } = useParams();
  const INITIAL_STATE = { [rota]: { [idRecipe]: [] } };
  const [meals, setMeals] = useState(INITIAL_STATE);
  const { dataFood, setDataFood } = useContext(context);
  const history = useHistory();
  const urlFood = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  useFetchIngredients(urlFood, setDataFood, setIngredients, 'meals');

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
    // console.log(meals);
  };

  useEffect(() => {
    // const dataLocalStorage = () => {
    const local = localStorage.getItem('inProgressRecipes');
    if (local) {
      let object = JSON.parse(local);
      object = {
        ...object,
        meals: {
          ...object?.meals,
          ...meals[rota],
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(object));
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(meals));
    }
    // };
    // dataLocalStorage();
  }, [meals, rota]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setMeals(data === null ? { [rota]: { [idRecipe]: [] } } : data);
  }, [idRecipe, rota]);

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
    // setTimeout(() => {
    //   setIsCopied(false);
    // }, THREE_SECONDS);
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

            ingredients.map((key, i) => (
              <div
                key={ key }
                data-testid={ `${i}-ingredient-step` }
              >
                <label
                  htmlFor={ i }
                  className={ meals[rota][idRecipe] && meals[rota][idRecipe]
                    .some((made) => (
                      made === key))
                    ? 'checkboxIngredient' : '' }
                >
                  <input
                    type="checkbox"
                    data-testid={ `${i}-ingredient` }
                    id={ i }
                    checked={ meals[rota][idRecipe] && meals[rota][idRecipe]
                      .some((made) => (
                        made === key)) }
                    onChange={
                      () => saveCheckbox(key)
                    }
                  />
                  <p
                    className={ meals[rota][idRecipe] && meals[rota][idRecipe]
                      .some((made) => (
                        made === key))
                      ? 'checkboxIngredient' : '' }
                  >

                    {key}
                  </p>

                </label>
              </div>
            ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn "
            disabled={ meals[rota][idRecipe]
              && (ingredients.length !== meals[rota][idRecipe].length) }
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
