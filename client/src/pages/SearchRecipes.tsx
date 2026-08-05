import { Link } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

import Auth from '../utils/auth';
import { saveRecipeIds, getSavedRecipesIds } from '../utils/localStorage';

import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_RECIPES_BY_INGREDIENTS } from '../utils/queries';
import { SAVE_RECIPE } from '../utils/mutations';
import type { SearchResult } from '../types';

import './searchRecipes.scss';

const SearchRecipes = () => {
  const [searchInput, setSearchInput] = useState('');
  const [savedRecipeIds, setSavedRecipeIds] = useState<number[]>(
    getSavedRecipesIds(),
  );

  const [saveRecipe] = useMutation(SAVE_RECIPE);

  const [findRecipes, { data }] = useLazyQuery<{
    findRecipesByIngredients: SearchResult[];
  }>(FIND_RECIPES_BY_INGREDIENTS);

  const searchedRecipes = data?.findRecipesByIngredients || [];

  useEffect(() => {
    saveRecipeIds(savedRecipeIds);
  }, [savedRecipeIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      console.error('Search failed:', err);
    }
  };

  const handleSaveRecipe = async (recipeId: number) => {
    const recipeToSave = searchedRecipes.find(
      (recipe) => Number(recipe.recipeId) === Number(recipeId),
    );

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !recipeToSave) {
      return;
    }

    try {
      await saveRecipe({
        variables: {
          newRecipe: {
            recipeId: String(recipeToSave.recipeId),
            title: recipeToSave.title,
            description: recipeToSave.description || '',
            image: recipeToSave.image || '',
            link: recipeToSave.link || '',
          },
        },
      });

      setSavedRecipeIds([...savedRecipeIds, Number(recipeId)]);
    } catch (err) {
      console.error('Save mutation failed:', err);
    }
  };

  return (
    <>
      <section className="search-hero text-light bg-dark">
        <Container className="searchLayout">
          <h1>SEARCH FOR RECIPES</h1>

          <Form onSubmit={handleFormSubmit}>
            <Row className="g-2">
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
            </Row>
          </Form>
        </Container>
      </section>

      <Container className="search-body">
        <Row xs={1} md={2} lg={3} className="g-4">
          {searchedRecipes.map((recipe) => (
            <Col key={recipe.recipeId}>
              <Card className="search-card mt-4 h-100" border="dark">
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

                  <Link
                    to={`/recipe/${recipe.recipeId}`}
                    className="btn btn-primary d-block mb-2"
                  >
                    SEE MORE
                  </Link>

                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRecipeIds.some(
                        (savedRecipeId) =>
                          savedRecipeId === Number(recipe.recipeId),
                      )}
                      className="d-block w-100 btn-info"
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
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchRecipes;
