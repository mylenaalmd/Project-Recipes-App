import { useEffect } from 'react';

function useFetch(url, callback, maxLength, key) {
  useEffect(() => {
    async function fetchApi() {
      const response = await fetch(url);
      const result = await response.json();
      let arrayReduzido = '';
      if (result[key]) {
        arrayReduzido = result[key].filter((_el, index) => index < maxLength);
      }
      callback(arrayReduzido);
    }
    fetchApi();
  }, [url, callback, maxLength, key]);
}

export default useFetch;
