import React, { useState } from 'react';
import DoneCard from '../components/DoneCard';
import Header from '../components/Header';

const doneRecipes = [{
  id: '52771',
  type: 'food',
  nationality: 'Italian',
  category: 'Vegetarian',
  alcoholicOrNot: '',
  name: 'Spicy Arrabiata Penne',
  image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  doneDate: '23/06/2020',
  tags: ['Pasta', 'Curry'],
},
{
  id: '178319',
  type: 'drink',
  nationality: '',
  category: 'Cocktail',
  alcoholicOrNot: 'Alcoholic',
  name: 'Aquamarine',
  image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
  doneDate: '23/06/2020',
  tags: [],
},
];

function DoneRecipes() {
  const [filter, setFilter] = useState('all');
  // descomentar essa linha para passar nos testes
  // const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));

  const filters = ['all', 'food', 'drink'];
  return (
    <section>
      <Header title="Done Recipes" isSearch={ false } />
      {filters.map((element) => (
        <button
          type="button"
          data-testid={ `filter-by-${element}-btn` }
          key={ element }
          onClick={ () => setFilter(element) }
        >
          {element === 'drink' ? 'drinks' : element}
        </button>
      ))}
      {doneRecipes && (
        doneRecipes
          .filter((element) => (filter === 'all' || filter === element.type)
          && element).map((recipe, index) => (<DoneCard
            key={ recipe.name }
            recipe={ recipe }
            index={ index }
          />)))}
    </section>
  );
}

export default DoneRecipes;
