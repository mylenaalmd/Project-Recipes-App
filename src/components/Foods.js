import React, { useContext } from 'react';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const urlFood = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const urlFoodCategory = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const MAX_CATEGORIES = 5;
const MAX_RECIPES = 12;
function Foods() {
  const {
    dataFoods,
    dataFoodsCategory,
    setDataFoods,
    setDataFoodsCategory,
  } = useContext(context);
  useFetch(urlFood, setDataFoods, MAX_RECIPES, 'meals');
  useFetch(urlFoodCategory, setDataFoodsCategory, MAX_CATEGORIES, 'meals');
  return (
    <div>
      {(dataFoods.length && dataFoodsCategory.length) > 0 && (
        <div>
          <div className="categories">
            {dataFoodsCategory
              .map(({ strCategory }) => (
                <button
                  type="button"
                  key={ strCategory }
                  data-testid={ `${strCategory}-category-filter` }
                >
                  {strCategory}
                </button>))}
          </div>
          <div className="cards">
            {dataFoods.map((food, index) => (
              <div
                key={ food.idMeal }
                className="card"
                data-testid={ `${index}-recipe-card` }
              >
                <img
                  src={ food.strMealThumb }
                  alt={ food.strMeal }
                  data-testid={ `${index}-card-img` }
                />
                <h1 data-testid={ `${index}-card-name` }>{food.strMeal}</h1>
              </div>
            ))}
          </div>
        </div>)}
    </div>);
}

export default Foods;
