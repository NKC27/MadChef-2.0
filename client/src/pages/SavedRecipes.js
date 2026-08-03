import React from 'react';
import { Link } from 'react-router-dom';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeRecipeId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';

const SavedRecipes = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeRecipe] = useMutation(REMOVE_RECIPE);

  const userData = data?.me || { savedRecipes: [] };

  console.log('User Data:', userData);

  const handleDeleteRecipe = async (recipeId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeRecipe({
        variables: { recipeId },
      });

      removeRecipeId(recipeId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      {' '}
      <Jumbotron fluid className="text-light bg-dark">
        {' '}
        <Container>
          {' '}
          <h1>SAVED RECIPES</h1>{' '}
        </Container>{' '}
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedRecipes.length
            ? `Viewing ${userData.savedRecipes.length} saved ${
                userData.savedRecipes.length === 1 ? 'recipe' : 'recipes'
              }:`
            : 'You have no saved recipes'}
        </h2>

        <CardColumns>
          {userData.savedRecipes.map((recipe) => (
            <Card className="mt-4" key={recipe.recipeId} border="dark">
              {recipe.image ? (
                <Card.Img
                  src={recipe.image}
                  alt={`The picture for ${recipe.title}`}
                  variant="top"
                />
              ) : null}

              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>

                <Card.Text>{recipe.description}</Card.Text>

                <Link
                  to={`/recipe/${recipe.recipeId}`}
                  className="btn btn-primary btn-block mb-2"
                >
                  SEE RECIPE
                </Link>

                <Button
                  className="btn-block btn-danger"
                  onClick={() => handleDeleteRecipe(recipe.recipeId)}
                >
                  DELETE
                </Button>
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedRecipes;
