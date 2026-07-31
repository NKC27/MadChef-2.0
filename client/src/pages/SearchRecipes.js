import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveRecipeIds, getSavedRecipesIds } from '../utils/localStorage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_RECIPES_BY_INGREDIENTS } from '../utils/queries';
import { SAVE_RECIPE } from '../utils/mutations';
import './searchRecipes.scss';

const SearchRecipes = () => {
  const [searchInput, setSearchInput] = useState('');
  const [savedRecipeIds, setSavedRecipeIds] = useState(getSavedRecipesIds());

  const [saveRecipe] = useMutation(SAVE_RECIPE);

  const [findRecipes, { data }] = useLazyQuery(FIND_RECIPES_BY_INGREDIENTS);

  const searchedRecipes = data?.findRecipesByIngredients || [];

  useEffect(() => {
    saveRecipeIds(savedRecipeIds);
  }, [savedRecipeIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      return;
    }

    try {
      await findRecipes({
        variables: {
          ingredients: [searchInput.trim()],
        },
      });

      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    const recipeToSave = searchedRecipes.find(
      (recipe) => recipe.recipeId === recipeId,
    );

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !recipeToSave) {
      return;
    }

    try {
      await saveRecipe({
        variables: {
          newRecipe: {
            recipeId: Number(recipeToSave.recipeId),
            title: recipeToSave.title,
            description: recipeToSave.description || '',
            image: recipeToSave.image || '',
            link: recipeToSave.link || '',
          },
        },
      });

      setSavedRecipeIds([...savedRecipeIds, recipeId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container className="searchLayout">
          <h1>SEARCH FOR RECIPES</h1>

          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Already have an idea?"
                />
              </Col>

              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container className="search-body">
        <CardColumns>
          {searchedRecipes.map((recipe) => (
            <Card
              className="search-card mt-4"
              key={recipe.recipeId}
              border="dark"
            >
              {recipe.image ? (
                <Card.Img
                  src={recipe.image}
                  alt={`The cover for ${recipe.title}`}
                  variant="top"
                />
              ) : null}

              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>

                <Card.Text>{recipe.description}</Card.Text>

                {Auth.loggedIn() && (
                  <Button
                    disabled={savedRecipeIds.some(
                      (savedRecipeId) =>
                        savedRecipeId === Number(recipe.recipeId),
                    )}
                    className="btn-block btn-info"
                    onClick={() => handleSaveRecipe(Number(recipe.recipeId))}
                  >
                    {savedRecipeIds.some(
                      (savedRecipeId) =>
                        savedRecipeId === Number(recipe.recipeId),
                    )
                      ? 'RECIPE SAVED'
                      : 'SAVE RECIPE'}
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchRecipes;
