import React from 'react';
import PropTypes from 'prop-types';
import Context from './context';

function Provider({ children }) {
  const context = {};
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
