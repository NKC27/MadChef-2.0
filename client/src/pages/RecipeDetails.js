import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Card, Spinner, Button } from 'react-bootstrap';

import { GET_RECIPE_INFORMATION } from '../utils/queries';

const RecipeDetails = () => {
  const { recipeId } = useParams();

  const { loading, error, data } = useQuery(GET_RECIPE_INFORMATION, {
    variables: {
      recipeId,
    },
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <h3 className="mt-3">Loading recipe...</h3>
      </Container>
    );
  }

  if (error) {
    console.error(error);

    return (
      <Container className="mt-5">
        <h2>Something went wrong loading this recipe.</h2>
      </Container>
    );
  }

  const recipe = data?.getRecipeInformation;

  if (!recipe) {
    return (
      <Container className="mt-5">
        <h2>Recipe not found.</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        {recipe.image && (
          <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
        )}

        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>

          <Card.Text>⏱ Ready in: {recipe.readyInMinutes} minutes</Card.Text>

          <Card.Text>👥 Serves: {recipe.servings}</Card.Text>

          <hr />

          <h3>Ingredients</h3>

          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>

          <hr />

          <h3>Instructions</h3>

          <p>{recipe.instructions}</p>

          {recipe.link && (
            <Button
              href={recipe.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              View Original Recipe
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeDetails;
