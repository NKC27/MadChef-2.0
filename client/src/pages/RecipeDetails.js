import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Container,
  Card,
  Spinner,
  Button,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';

import { GET_RECIPE_INFORMATION } from '../utils/queries';
import './RecipeDetails.scss';

console.log('RecipeDetails SCSS loaded');

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
        <h3 className="mt-3">Cooking up your recipe...</h3>
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

  const steps = recipe.instructions ? recipe.instructions.split('\n') : [];

  return (
    <Container className="mt-5 mb-5 recipe-details">
      <Card className="shadow-lg border-0 overflow-hidden">
        {recipe.image && (
          <Card.Img
            variant="top"
            src={recipe.image}
            alt={recipe.title}
            style={{
              height: '420px',
              objectFit: 'cover',
            }}
          />
        )}

        <div className="p-4 text-center">
          <h1 className="display-4 fw-bold">{recipe.title}</h1>

          <p className="text-muted">A delicious recipe ready to cook</p>
        </div>

        <Card.Body className="p-4">
          <Row className="mb-5">
            <Col md={6} className="mb-3">
              <Card className="shadow-sm border-0 info-card">
                <Card.Body className="text-center">
                  <h4>Cooking Time</h4>

                  <h2 className="text-success">{recipe.readyInMinutes}</h2>

                  <p className="mb-0">minutes</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-3">
              <Card className="shadow-sm border-0 info-card">
                <Card.Body className="text-center">
                  <h4>Servings</h4>

                  <h2 className="text-primary">{recipe.servings}</h2>

                  <p className="mb-0">people</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <hr />

          <h2 className="section-title">🥘 Ingredients</h2>

          <Row>
            {recipe.ingredients.map((ingredient, index) => (
              <Col md={6} key={index} className="mb-2">
                <Card className="shadow-sm ingredient-card">
                  <Card.Body>
                    <strong>
                      {ingredient.amount} {ingredient.unit}
                    </strong>{' '}
                    {ingredient.name}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <hr className="mt-5" />

          <h2 className="section-title">👨‍🍳 Instructions</h2>

          <div className="mt-3">
            {steps.map((step, index) => (
              <Card key={index} className="mb-3 shadow-sm instruction-card">
                <Card.Body>
                  <h5>Step {index + 1}</h5>

                  <p className="mb-0">{step.replace(`${index + 1}.`, '')}</p>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="d-flex justify-content-between mt-5">
            <Link to="/saved" className="btn btn-secondary">
              ← Back To Saved Recipes
            </Link>

            {recipe.link && (
              <Button
                href={recipe.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="success"
              >
                View Original Recipe 🔗
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeDetails;
