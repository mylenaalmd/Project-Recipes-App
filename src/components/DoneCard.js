import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';

const copy = require('clipboard-copy');

function DoneCard({ recipe, index, idCopied, setIdCopied }) {
  const copiedLink = (data) => {
    copy(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
    setIdCopied(data);
  };
  return (
    <section>
      <div className="cards">
        <Link to={ `${recipe.type}s/${recipe.id}` }>

          <img
            src={ recipe.image }
            alt={ recipe.name }
            data-testid={ `${index}-horizontal-image` }
          />
          <p
            data-testid={ `${index}-horizontal-name` }
          >
            {recipe.name}
          </p>
        </Link>
        <p
          data-testid={ `${index}-horizontal-top-text` }
        >
          {recipe.type === 'food' ? (`${recipe.nationality} -  ${recipe.category} `)
            : (recipe.alcoholicOrNot)}
        </p>
        <p
          data-testid={ `${index}-horizontal-done-date` }
        >
          {recipe.doneDate}
        </p>
        <button
          onClick={ () => copiedLink(recipe.id) }
          type="button"
        >
          <img
            alt="share icon"
            data-testid={ `${index}-horizontal-share-btn` }
            src={ shareIcon }
          />
        </button>
        {idCopied === recipe.id && <span>Link copied!</span> }
        <div>
          { recipe.tags && recipe.tags.filter((element, i) => i < 2 && element)
            .map((el) => (
              <p
                data-testid={ `${index}-${el}-horizontal-tag` }
                key={ el }
              >
                {el}
              </p>))}
        </div>
      </div>
    </section>
  );
}
DoneCard.propTypes = {
  recipe: PropTypes.object,
  index: PropTypes.number,
  idCopied: PropTypes.number,
  setIdCopied: PropTypes.func,
}.isRequired;

export default DoneCard;
