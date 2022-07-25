import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import context from '../context/context';
import useFetch from '../hooks/useFetch';

const NUMBER = 1;

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

  const toggleFilter = (category) => {
    if (category === '' || filterAtual === category) {
      setUrlFood(initialUrlFood);
    } else {
      setUrlFood(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    }
    setFilterAtual(category);
  };
  return (
    <div>
      {(dataFoods.length && dataFoodsCategory.length) > 0 && (
        <div>
          <div
            className="categories"
          >
            <button
              type="button"
              key="All"
              className="strCategory-category-filter1"
              data-testid="All-category-filter"
              onClick={ () => toggleFilter('') }
            >
              All
            </button>
            {dataFoodsCategory
              .map(({ strCategory }, index) => (
                <button
                  type="button"
                  key={ strCategory }
                  className={ index <= NUMBER
                    ? 'strCategory-category-filter1' : 'strCategory-category-filter2' }
                  data-testid={ `${strCategory}-category-filter` }
                  onClick={ () => toggleFilter(strCategory) }
                >
                  {strCategory}
                </button>))}

          </div>
          <div className="cards">
            {dataFoods && dataFoods.map((food, index) => (
              <Link to={ `/foods/${food.idMeal}` } key={ food.idMeal }>
                <div
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
              </Link>
            ))}
          </div>
        </div>)}
    </div>);
}

export default Foods;
