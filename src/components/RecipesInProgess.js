import React from 'react';
import PropTypes from 'prop-types';
import RecipesInProgressFood from './RecipesInProgressFood';
import RecipesInProgressDrinks from './RecipesInProgressDrink';

function RecipesInProgress({ type }) {
  return (
    <div>
      {
        type === 'foods' ? <RecipesInProgressFood /> : <RecipesInProgressDrinks />
      }
    </div>
  );
}

RecipesInProgress.propTypes = {
  type: PropTypes.string.isRequired,
};

export default RecipesInProgress;
