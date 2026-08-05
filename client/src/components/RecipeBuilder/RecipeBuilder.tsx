import { useState } from 'react';
import { Container, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';

import './RecipeBuilder.scss';

import checkList from '../../utils/checkList.json';
import {
  FIND_RECIPES_BY_INGREDIENTS,
  GET_RECIPE_INFORMATION,
} from '../../utils/queries';
import type { CheckListItem, RecipeDetail, SearchResult } from '../../types';

function RecipeBuilder() {
  const [checked, setChecked] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(
    null,
  );

  const [findRecipes, { data }] = useLazyQuery<{
    findRecipesByIngredients: SearchResult[];
  }>(FIND_RECIPES_BY_INGREDIENTS);

  const [getRecipeInformation] = useLazyQuery<{
    getRecipeInformation: RecipeDetail;
  }>(GET_RECIPE_INFORMATION);

  const searchedRecipes = data?.findRecipesByIngredients || [];

  const handleClose = () => {
    setShow(false);
    setSelectedRecipe(null);
  };

  const handleCheck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ingredient = event.target.value;

    let updatedList: string[];

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

  const showDetails = async (recipeId: string) => {
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

  const isChecked = (item: string) =>
    checked.includes(item) ? 'checked-item' : 'not-checked-item';

  return (
    <div className="app">
      <div className="imgReset">
        <img
          className="recipeSplashScreen"
          src="/images/custom-splash.png"
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
        {(checkList as CheckListItem[]).map((item, index) => (
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
                src={item.image}
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
          <Row xs={1} md={2} lg={3} className="g-4">
            {searchedRecipes.map((recipe) => (
              <Col key={recipe.recipeId}>
                <Card className="recipe-card h-100">
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
              </Col>
            ))}
          </Row>
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
