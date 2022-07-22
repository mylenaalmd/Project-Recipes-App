import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

const THREE_SECONDS = 3000;

function RecipesInProgressDrink() {
  const { pathname } = useLocation();
  const rota = pathname.includes('drinks') ? 'cocktails' : 'meals';
  const { idRecipe } = useParams();
  const [cocktails, setCocktails] = useState({ [rota]: { [idRecipe]: [] } });
  const { dataDrink, setDataDrink, setDoingRecipe, doingRecipe,
    recipesMade, setRecipesMade } = useContext(context);
  const MAX_RECIPES = 1;
  const history = useHistory();
  const [urlDrink] = useState(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const saveCheck = (dado) => {
    setCocktails((prev) => (
      {
        ...prev,
        [rota]: {
          ...prev[rota],
          [idRecipe]: [...prev[rota][idRecipe], dado],
        },

      }
    ));
    setDoingRecipe([...doingRecipe, idRecipe]);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setCocktails(data === null ? { [rota]: { [idRecipe]: [] } } : data);
  }, [idRecipe, rota]);

  useEffect(() => {
    // const dataLocalStorage = () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(cocktails));
    // dataLocalStorage();
  }, [cocktails]);

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
          <h4 data-testid="recipe-category">{drink.strCategory}</h4>
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
          {
            Object.keys(drink).filter((key) => key.includes('strIngredient'))
              .map((key, i) => (
                drink[key] && (
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
                        checked={ cocktails[rota][idRecipe]
                          .some((made) => (
                            made === `${drink[`strMeasure${i + 1}`]} ${drink[key]}`)) }
                        onChange={
                          () => saveCheck(`${drink[`strMeasure${i + 1}`]} ${drink[key]}`)
                        }
                      />
                      <p
                        className={ cocktails[rota][idRecipe]
                          .some((made) => (
                            made === `${drink[`strMeasure${i + 1}`]} ${drink[key]}`))
                          ? 'checkboxIngredient' : '' }
                      >
                        {`${drink[`strMeasure${i + 1}`]} ${drink[key]}`}
                      </p>
                    </label>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{drink.strInstructions}</p>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn"
            disabled={ (Object.entries(drink)
              .filter((key) => key[0].includes('strIngredient')
              && key[1]).length !== cocktails[rota][idRecipe].length) }
            onClick={ () => handleFinish() }
          >
            Finish Recipe
          </button>
        </div>
      ))}
    </>
  );
}
export default RecipesInProgressDrink;
