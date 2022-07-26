import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

const THREE_SECONDS = 3000;

function FavoriteRecipes() {
  const [favs, setFavs] = useState();
  const [isCopied, setIsCopied] = useState(false);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    const initial = async () => {
      const favRecipes = await JSON.parse(localStorage.getItem('favoriteRecipes'));
      setFavs(favRecipes);
    };

    initial();
  }, []);

  const removeFav = (id) => {
    const filtered = favs.filter((drink) => drink.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(filtered));
    setFavs(filtered);
  };

  const showMessagem = (link) => {
    setIsCopied(true);
    copy(link);
    setTimeout(() => {
      setIsCopied(false);
    }, THREE_SECONDS);
  };

  return (
    <section>
      <Header title="Favorite Recipes" isSearch={ false } />
      { isCopied && (<p>Link copied!</p>)}
      <button
        type="button"
        onClick={ () => setFilter('food') }
        data-testid="filter-by-food-btn"
      >
        Food
      </button>
      <button
        type="button"
        data-testid="filter-by-drink-btn"
        onClick={ () => setFilter('drink') }
      >
        Drinks
      </button>
      <button
        data-testid="filter-by-all-btn"
        type="button"
        onClick={ () => setFilter('all') }
      >
        All
      </button>
      {
        favs && favs.filter((curr) => (filter === 'all' ? curr : (curr.type === filter)))
          .map((recipe, index) => (
            <div className="cards" key={ recipe.id }>
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <img
                  className="detail"
                  data-testId={ `${index}-horizontal-image` }
                  alt={ recipe.name }
                  src={ recipe.image }
                />
              </Link>
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
              </Link>
              <p data-testid={ `${index}-horizontal-top-text` }>
                { recipe.type === 'food' ? (`${recipe.nationality} - ${recipe.category}`)
                  : (recipe.alcoholicOrNot) }
              </p>

              <button
                type="button"
                onClick={ () => showMessagem(`http://localhost:3000/${recipe.type}s/${recipe.id}`) }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="share-btn"
                />
              </button>
              <button
                type="button"
                onClick={ () => removeFav(recipe.id) }
              >
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  alt="favorite-btn"
                  src={ blackHeart }
                />
              </button>
            </div>
          ))
      }
    </section>
  );
}

export default FavoriteRecipes;
