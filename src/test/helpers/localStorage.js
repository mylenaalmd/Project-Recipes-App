// fonte: https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

export default localStorageMock;
