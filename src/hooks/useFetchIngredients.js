import { useEffect } from 'react';

function useFetchIngredients(url, callback, callback2, key) {
  useEffect(() => {
    async function fetchApi() {
      const response = await fetch(url);
      const result = await response.json();
      let arrayReduzido = '';
      let ingredientList = '';
      if (result[key]) {
        arrayReduzido = result[key].filter((_el, index) => index < 1);
        const ingredientes = Object.entries(result[key][0])
          .filter((el) => (el[0].includes('strIngredient') && el[1]) && el[1]);
        const quantidade = Object.entries(result[key][0])
          .filter((el) => (el[0].includes('strMeasure') && el[1]) && el[1]);
        ingredientList = ingredientes.map((el, i) => (quantidade[i]?.[1] === undefined
          ? el[1] : `${quantidade[i][1]} ${el[1]}`));
      }
      callback(arrayReduzido);
      callback2(ingredientList);
    }
    fetchApi();
  }, [url, callback, callback2, key]);
}

export default useFetchIngredients;
