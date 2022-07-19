import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const MAX_RECIPES = 6;

function Drinks() {
  const { dataFood, setDataFood, dataDrinks } = useContext(context);
  const { idRecipe } = useParams();
  const urlFood = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
  useFetch(urlFood, setDataFood, MAX_RECIPES, 'meals');
  return (
    <div className="detail">
      {dataFood.map((food) => (
        <div
          key={ food.idMeal }
          className="card"
        >
          <img
            src={ food.strMealThumb }
            alt={ food.strMeal }
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{food.strMeal}</h1>
          <h2 data-testid="recipe-category">{food.strCategory}</h2>
          {
            Object.keys(food).filter((key) => key.includes('strIngredient'))
              .map((key, index) => (
                food[key] && (
                  <div key={ key } data-testid={ `${index}-ingredient-name-and-measure` }>
                    <p>{`${food[`strMeasure${index + 1}`]} ${food[key]}`}</p>
                  </div>
                )
              ))
          }
          <p data-testid="instructions">{food.strInstructions}</p>
          <iframe src={ food.strYoutube } title={ food.strMeal } data-testid="video" />
          {dataDrinks.map((drink, index) => index < MAX_RECIPES && (
            <div
              key={ drink.idDrink }
              className="RecomendationCard"
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
              />
              <h1>{drink.strDrink}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Drinks;
