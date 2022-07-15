import React from 'react';
import PropTypes from 'prop-types';
import Foods from './Foods';
import Drinks from './Drinks';

function Recipes({ type }) {
  return (
    <div>
      {
        type === 'foods' ? <Foods /> : <Drinks />
      }
    </div>
  );
}

Recipes.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Recipes;
