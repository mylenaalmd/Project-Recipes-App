import React from 'react';
import PropTypes from 'prop-types';
// import useFetch from '../hooks/useFetch';

function IngredientsList({ currentRecipe, saveCheckbox, ingredients }) {
  return (
    <div>
      {ingredients.map((ingredient, i) => (
        <div
          key={ ingredient }
          data-testid={ `${i}-ingredient-step` }
          className="ingredients-list"
        >
          <label htmlFor={ `${i}-${ingredient}` } className="label">
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
            <span
              className="checkmark"
            />
            <p
              className={
                currentRecipe
                && currentRecipe.some((made) => made === ingredient)
                  ? 'checkboxIngredient ingredient-name'
                  : 'ingredient-name'
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
