import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Foods from './pages/Foods';
import Drinks from './pages/Drinks';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import FoodsDetail from './pages/FoodsDetail';
import DrinksDetail from './pages/DrinksDetail';
import Provider from './context/Provider';

function App() {
  return (
    <Switch>
      <Provider>
        <Route exact path="/" component={ Login } />
        <Route exact path="/foods" component={ Foods } />
        <Route exact path="/drinks" component={ Drinks } />
        <Route exact path="/profile" component={ Profile } />
        <Route exact path="/done-recipes" component={ DoneRecipes } />
        <Route exact path="/favorite-recipes" component={ FavoriteRecipes } />
        <Route path="/foods/:idRecipe" component={ FoodsDetail } />
        <Route path="/drinks/:idRecipe" component={ DrinksDetail } />
      </Provider>
    </Switch>
  );
}

export default App;
