import React, { useState } from 'react';
import { Container, Button, Card, CardColumns, Modal } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';

import './RecipeBuilder.scss';

import checkList from '../../utils/checkList.json';
import {
  FIND_RECIPES_BY_INGREDIENTS,
  GET_RECIPE_INFORMATION,
} from '../../utils/queries';

function RecipeBuilder() {
  const [checked, setChecked] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [findRecipes, { data }] = useLazyQuery(FIND_RECIPES_BY_INGREDIENTS);

  const [getRecipeInformation] = useLazyQuery(GET_RECIPE_INFORMATION);

  const searchedRecipes = data?.findRecipesByIngredients || [];

  const handleClose = () => {
    setShow(false);
    setSelectedRecipe(null);
  };

  const handleCheck = async (event) => {
    const ingredient = event.target.value;

    let updatedList;

    if (event.target.checked) {
      updatedList = [...checked, ingredient];
    } else {
      updatedList = checked.filter((item) => item !== ingredient);
    }

    setChecked(updatedList);

    if (updatedList.length === 0) {
      return;
    }

    try {
      await findRecipes({
        variables: {
          ingredients: updatedList,
        },
      });
    } catch (err) {
      console.error('Recipe search failed:', err);
    }
  };

  const showDetails = async (recipeId) => {
    try {
      const { data: recipeData } = await getRecipeInformation({
        variables: {
          recipeId: String(recipeId),
        },
      });

      setSelectedRecipe(recipeData?.getRecipeInformation || null);
      setShow(true);
    } catch (err) {
      console.error('Unable to load recipe details:', err);
    }
  };

  const isChecked = (item) =>
    checked.includes(item) ? 'checked-item' : 'not-checked-item';

  return (
    <div className="app">
      <div className="imgReset">
        <img
          className="recipeSplashScreen"
          src="images/custom-splash.png"
          alt="Recipe builder"
        />

        <div className="centered">
          <div className="slogan">
            <span className="sloganText1">
              COMBINE YOUR INGREDIENTS BELOW TO GENERATE A MAD RECIPE
            </span>
          </div>
        </div>
      </div>

      <div className="title">Ingredients to build with:</div>

      <div className="list-container">
        {checkList.map((item, index) => (
          <div className="check-list" key={index}>
            <input
              value={item.item}
              type="checkbox"
              checked={checked.includes(item.item)}
              onChange={handleCheck}
            />

            <span className={isChecked(item.item)}>
              <img
                className="ingredients"
                src={process.env.PUBLIC_URL + item.image}
                alt={item.item}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="checkList">
        <h2 className="results">
          {searchedRecipes.length
            ? `Viewing ${searchedRecipes.length} results:`
            : 'Click your ingredients to generate a recipe!'}
        </h2>

        <Container>
          <CardColumns>
            {searchedRecipes.map((recipe) => (
              <Card
                className="recipe-card"
                key={recipe.recipeId}
                style={{ width: '18rem' }}
              >
                {recipe.image && (
                  <Card.Img
                    variant="top"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                )}

                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>

                  <Button
                    className="see-more-btn"
                    variant="dark"
                    onClick={() => showDetails(recipe.recipeId)}
                  >
                    See More
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </CardColumns>
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRecipe?.title || 'Recipe Details'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedRecipe?.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="img-fluid mb-3"
              />
            )}

            {selectedRecipe?.description ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: selectedRecipe.description,
                }}
              />
            ) : (
              <p>No recipe description available.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default RecipeBuilder;
