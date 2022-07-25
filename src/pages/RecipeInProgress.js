import React from 'react';
import PropTypes from 'prop-types';
import RecipeInProgressFood from '../components/RecipeInProgressFood';
import RecipeInProgressDrinks from '../components/RecipeInProgressDrink';

function RecipeInProgress({ type }) {
  return (
    <div>
      {
        type === 'foods' ? <RecipeInProgressFood /> : <RecipeInProgressDrinks />
      }
    </div>
  );
}

RecipeInProgress.propTypes = {
  type: PropTypes.string.isRequired,
};

export default RecipeInProgress;
