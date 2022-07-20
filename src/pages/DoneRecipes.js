import React, { useState } from 'react';
import DoneCard from '../components/DoneCard';
import Header from '../components/Header';

function DoneRecipes() {
  const [filter, setFilter] = useState('all');
  const [idCopied, setIdCopied] = useState('');
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));

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
            idCopied={ idCopied }
            setIdCopied={ setIdCopied }
          />)))}
    </section>
  );
}

export default DoneRecipes;
