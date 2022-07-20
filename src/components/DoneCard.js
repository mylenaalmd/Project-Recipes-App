import React from 'react';
import PropTypes from 'prop-types';
import shareIcon from '../images/shareIcon.svg';

function DoneCard({ recipe, index }) {
  // const recipeTags = recipe.tags ? recipe.tags.splice(0, 2) : [];
  return (
    <section>
      <div>
        <img
          src={ recipe.image }
          alt={ recipe.name }
          data-testid={ `${index}-horizontal-image` }
        />
        <p
          data-testid={ `${index}-horizontal-top-text` }
        >
          {recipe.type === 'food' ? (`${recipe.nationality} -  ${recipe.category} `)
            : (recipe.alcoholicOrNot)}
        </p>
        <p
          data-testid={ `${index}-horizontal-name` }
        >
          {recipe.name}
        </p>
        <p
          data-testid={ `${index}-horizontal-done-date` }
        >
          {recipe.doneDate}
        </p>
        <img
          src={ shareIcon }
          alt="share icon"
          data-testid={ `${index}-horizontal-share-btn` }
        />
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
}.isRequired;

export default DoneCard;
