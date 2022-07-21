import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import context from '../context/context';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

const copy = require('clipboard-copy');

const THREE_SECONDS = 3000;

function RecipesInProgressDrink() {
  const { idRecipe } = useParams();
  const [cocktails, setCocktails] = useState({ [idRecipe]: [] });
  const { dataDrink, setDataDrink } = useContext(context);
  const MAX_RECIPES = 1;
  const history = useHistory();
  const [urlDrink] = useState(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`);
  useFetch(urlDrink, setDataDrink, MAX_RECIPES, 'drinks');
  const [isCopied, setIsCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  // const meals = food[0];
  console.log(dataDrink[0]);

  // const saveCheck = (dado) => {
  //   setCocktails({ [idRecipe]: [...cocktails[idRecipe], dado] });
  //   localStorage.setItem('inProgressRecipes', JSON.stringify({ ...cocktails }));
  //   console.log(cocktails);
  // };
  const saveCheck = (dado) => {
    console.log(dado);
    setCocktails((prev) => (
      {
        ...prev,
        [idRecipe]: [cocktails[idRecipe], dado],

      }
    ));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setCocktails(data);
  }, []);

  useEffect(() => {
    const dataLocalStorage = () => {
      localStorage.setItem('inProgressRecipes', JSON.stringify({ cocktails }));
    };
    dataLocalStorage();
  }, [cocktails]);

  const showMessagem = () => {
    setIsCopied(true);
    copy(`http://localhost:3000/drinks/${idRecipe}/in-progress`);
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

  return (
    <>
      <div>RecipesInProgress</div>
      { dataDrink.map((drink, index) => (
        <div key={ drink.idDrink } className="recipesInProgress">
          { isCopied && (<p>Link copied!</p>)}
          <h2 data-testid="recipe-title">{drink.strDrink}</h2>
          <h4 data-testid="recipe-category">{drink.strCategory}</h4>
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
                    <label htmlFor="checkbox">
                      <input
                        className="checkboxIngredient"
                        type="checkbox"
                        value="checkbox"
                        onClick={
                          () => saveCheck(`${drink[`strMeasure${i + 1}`]} ${drink[key]}`)
                        }
                      />
                    </label>
                    <p>
                      {`${drink[`strMeasure${index + 1}`]} ${drink[key]}`}
                    </p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{drink.strInstructions}</p>
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
// RecipesInProgressDrink.propTypes = {
//   history: PropTypes.objectOf(
//     PropTypes.func.isRequired,
//   ).isRequired,
//   location: PropTypes.shape({
//     pathname: PropTypes.string.isRequired }).isRequired,
// };
export default RecipesInProgressDrink;
