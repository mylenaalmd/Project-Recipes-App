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
// import InProgressFood from './pages/InProgressFood';
// import InProgressDrink from './pages/InProgressDrink';
// import RecipeInProgressFood from './components/RecipeInProgressFood';
// import RecipeInProgressDrink from './components/RecipeInProgressDrink';
import RecipeInProgress from './pages/RecipeInProgress';

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
        <Route
          exact
          path="/drinks/:idRecipe/in-progress"
          render={ () => <RecipeInProgress type="drinks" /> }
        />
        <Route
          exact
          path="/foods/:idRecipe/in-progress"
          render={ () => <RecipeInProgress type="foods" /> }
        />
        <Route exact path="/foods/:idRecipe" component={ FoodsDetail } />
        <Route exact path="/drinks/:idRecipe" component={ DrinksDetail } />
      </Provider>
    </Switch>
  );
}

export default App;
