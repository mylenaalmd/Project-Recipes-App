import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import useFetchIngredients from '../hooks/useFetchIngredients';
import context from '../context/context';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import IngredientsList from './IngredientsList';

const copy = require('clipboard-copy');

function RecipeInProgressDrink() {
  const { pathname } = useLocation();
  const rota = pathname.includes('drinks') && 'cocktails';
  const { idRecipe } = useParams();

  const data = localStorage.getItem('inProgressRecipes');
  let INITIAL_STATE = { [rota]: { [idRecipe]: [] }, meals: {} };
  if (data) {
    const object = JSON.parse(data);
    if (Object.keys(object[rota]).some((item) => item === idRecipe)) {
      INITIAL_STATE = { [rota]: { [idRecipe]: object[rota][idRecipe] }, meals: {} };
    }
  }
  const [cocktails, setCocktails] = useState(INITIAL_STATE);

  const { dataDrink, setDataDrink, setDoingRecipe, doingRecipe,
    recipesMade, setRecipesMade } = useContext(context);
  const history = useHistory();
  const urlDrink = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  useFetchIngredients(urlDrink, setDataDrink, setIngredients, 'drinks');

  const saveCheckbox = (dado) => {
    if (cocktails[rota][idRecipe].some((el) => el === dado)) {
      setCocktails((prev) => (
        {
          ...prev,
          [rota]: {
            ...prev[rota],
            [idRecipe]: prev[rota][idRecipe].filter((item) => item !== dado),
          },
        }
      ));
    } else {
      setCocktails((prev) => (
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
        cocktails: {
          ...object?.meals,
          ...cocktails[rota],
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(object));
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(cocktails));
    }
  }, [cocktails, rota]);

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
    copy(`http://localhost:3000/drinks/${idRecipe}`);
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

  const handleFinish = () => {
    history.push('/done-recipes');
    const filtered = doingRecipe.filter((curr) => curr !== idRecipe);
    setDoingRecipe(filtered);
    setRecipesMade([...recipesMade, idRecipe]);
  };

  return (
    <>
      <div>RecipesInProgress</div>
      { dataDrink.map((drink) => (
        <div key={ drink.idDrink } className="recipesInProgress">
          <h2 data-testid="recipe-title">{drink.strDrink}</h2>
          <h4 data-testid="recipe-category">{drink.Alcoholic}</h4>
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
              src={ drink.strDrinkThumb }
              alt={ drink.strDrink }
              data-testid="recipe-photo"
            />
          </div>
          <IngredientsList
            currentRecipe={ cocktails[rota][idRecipe] }
            ingredients={ ingredients }
            saveCheckbox={ saveCheckbox }

          />
          <p data-testid="instructions">{drink.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn"
            disabled={ cocktails[rota][idRecipe]
              && (ingredients.length !== cocktails[rota][idRecipe].length) }
            onClick={ () => handleFinish() }
          >
            Finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}
export default RecipeInProgressDrink;
