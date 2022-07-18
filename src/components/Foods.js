import React, { useContext, useState } from 'react';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const initialUrlFood = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
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
  const [urlFood, setUrlFood] = useState('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const [filterAtual, setFilterAtual] = useState('');
  useFetch(urlFood, setDataFoods, MAX_RECIPES, 'meals');
  useFetch(urlFoodCategory, setDataFoodsCategory, MAX_CATEGORIES, 'meals');

  const handleClick = (category) => {
    if (category === '' || filterAtual === category) {
      setUrlFood(initialUrlFood);
      console.log('bora resetar');
    } else {
      console.log('bora trocar a categoria');
      setUrlFood(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    }
    setFilterAtual(category);
  };
  return (
    <div>
      {(dataFoods.length && dataFoodsCategory.length) > 0 && (
        <div>
          <div className="categories">
            <button
              type="button"
              key="All"
              data-testid="All-category-filter"
              onClick={ () => handleClick('') }
            >
              All
            </button>
            {dataFoodsCategory
              .map(({ strCategory }) => (
                <button
                  type="button"
                  key={ strCategory }
                  data-testid={ `${strCategory}-category-filter` }
                  onClick={ () => handleClick(strCategory) }
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
