import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Context from './context';

function Provider({ children }) {
  const [dataFoods, setDataFoods] = useState([]);
  const [dataDrinks, setDataDrinks] = useState([]);
  const context = { dataFoods, setDataFoods, dataDrinks, setDataDrinks };
  return (
    <Context.Provider value={ context }>
      { children }
    </Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.any,
    ),
  ).isRequired,
};

export default Provider;
