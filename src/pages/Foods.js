import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Recipes from '../components/Recipes';

function Foods() {
  return (
    <>
      <Header
        title="Foods"
        isSearch
      />
      <Recipes
        type="foods"
      />
      <Footer />
    </>
  );
}

export default Foods;
