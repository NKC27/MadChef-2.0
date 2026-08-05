import { Link } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FiSearch, FiBookmark, FiCheck } from 'react-icons/fi';

import Auth from '../utils/auth';
import { saveRecipeIds, getSavedRecipesIds } from '../utils/localStorage';
import { hideBrokenImage } from '../utils/hideBrokenImage';

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
      <section className="search-hero">
        <Container className="searchLayout">
          <p className="mc-eyebrow justify-content-center">Find a recipe</p>
          <h1>What are you working with?</h1>
          <p className="search-hero__subcopy">
            Enter an ingredient you have on hand and we&rsquo;ll surface
            recipes built around it.
          </p>

          <Form onSubmit={handleFormSubmit} className="search-form">
            <Row className="g-2 justify-content-center">
              <Col xs={12} md={7}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="e.g. chicken, chickpeas, spinach…"
                />
              </Col>

              <Col xs={12} md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <FiSearch aria-hidden="true" />
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      <Container className="search-body">
        <Row xs={1} md={2} lg={3} className="g-4">
          {searchedRecipes.map((recipe) => {
            const isSaved = savedRecipeIds.some(
              (savedRecipeId) => savedRecipeId === Number(recipe.recipeId),
            );

            return (
              <Col key={recipe.recipeId}>
                <Card className="search-card h-100">
                  {recipe.image ? (
                    <Card.Img
                      src={recipe.image}
                      alt={`The cover for ${recipe.title}`}
                      variant="top"
                      onError={hideBrokenImage}
                    />
                  ) : null}

                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>

                    {recipe.description && (
                      <Card.Text>{recipe.description}</Card.Text>
                    )}

                    <Link
                      to={`/recipe/${recipe.recipeId}`}
                      className="btn btn-outline-light d-block mb-2 mt-2"
                    >
                      See More
                    </Link>

                    {Auth.loggedIn() && (
                      <Button
                        disabled={isSaved}
                        className="d-flex align-items-center justify-content-center gap-2 w-100"
                        variant={isSaved ? 'secondary' : 'primary'}
                        onClick={() =>
                          handleSaveRecipe(Number(recipe.recipeId))
                        }
                      >
                        {isSaved ? (
                          <>
                            <FiCheck aria-hidden="true" />
                            Recipe Saved
                          </>
                        ) : (
                          <>
                            <FiBookmark aria-hidden="true" />
                            Save Recipe
                          </>
                        )}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchRecipes;
