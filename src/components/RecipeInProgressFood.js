import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import useFetchIngredients from '../hooks/useFetchIngredients';
import context from '../context/context';
import blackHeart from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import IngredientsList from './IngredientsList';

const copy = require('clipboard-copy');

function RecipeInProgressFood() {
  const { pathname } = useLocation();
  const rota = pathname.includes('foods') && 'meals';
  const { idRecipe } = useParams();

  const data = localStorage.getItem('inProgressRecipes');
  let INITIAL_STATE = { [rota]: { [idRecipe]: [] }, cocktails: {} };
  if (data) {
    const object = JSON.parse(data);
    if (Object.keys(object[rota]).some((item) => item === idRecipe)) {
      INITIAL_STATE = { [rota]: { [idRecipe]: object[rota][idRecipe] }, cocktails: {} };
    }
  }
  const [meals, setMeals] = useState(INITIAL_STATE);

  const { dataFood, setDataFood, setDoingRecipe, doingRecipe,
    recipesMade, setRecipesMade } = useContext(context);
  const history = useHistory();
  const urlFood = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  useFetchIngredients(urlFood, setDataFood, setIngredients, 'meals');

  const saveCheckbox = (dado) => {
    if (meals[rota][idRecipe].some((el) => el === dado)) {
      setMeals((prev) => (
        {
          ...prev,
          [rota]: {
            ...prev[rota],
            [idRecipe]: prev[rota][idRecipe].filter((item) => item !== dado),
          },
        }
      ));
    } else {
      setMeals((prev) => (
        {
          ...prev,
          [rota]: {
            ...prev[rota],
            [idRecipe]: [...prev[rota][idRecipe], dado],
          },

        }
      ));
    }
    setDoingRecipe([...doingRecipe, idRecipe]);
  };

  useEffect(() => {
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
  }, [meals, rota]);

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
          <IngredientsList
            currentRecipe={ meals[rota][idRecipe] }
            ingredients={ ingredients }
            saveCheckbox={ saveCheckbox }

          />
          <p data-testid="instructions">{food.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn "
            disabled={ meals[rota][idRecipe]
              && (ingredients.length !== meals[rota][idRecipe].length) }
            onClick={ () => handleFinish() }
          >
            Finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}

export default RecipeInProgressFood;
