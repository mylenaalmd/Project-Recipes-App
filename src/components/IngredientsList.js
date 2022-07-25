import React from 'react';
import PropTypes from 'prop-types';
// import useFetch from '../hooks/useFetch';

function IngredientsList({ currentRecipe, saveCheckbox, ingredients }) {
  return (
    <div>
      {ingredients.map((ingredient, i) => (
        <div key={ ingredient } data-testid={ `${i}-ingredient-step` }>
          <label htmlFor={ `${i}-${ingredient}` }>
            <input
              type="checkbox"
              data-testid={ `${i}-ingredient` }
              id={ `${i}-${ingredient}` }
              checked={
                currentRecipe
                && currentRecipe.some((made) => made === ingredient)
              }
              onChange={ () => saveCheckbox(ingredient) }
            />
            <p
              className={
                currentRecipe
                && currentRecipe.some((made) => made === ingredient)
                  ? 'checkboxIngredient'
                  : ''
              }
            >
              {ingredient}
            </p>
          </label>
        </div>
      ))}
    </div>
  );
}

IngredientsList.propTypes = {
  currentRecipe: PropTypes.arrayOf(PropTypes.string),
  ingredients: PropTypes.arrayOf(PropTypes.string),
  saveCheckbox: PropTypes.func,
}.isRequired;

export default IngredientsList;
