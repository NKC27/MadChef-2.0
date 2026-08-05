import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Card, Spinner, Button, Row, Col } from 'react-bootstrap';

import { GET_RECIPE_INFORMATION } from '../utils/queries';
import type { RecipeDetail } from '../types';
import './RecipeDetails.scss';

const RecipeDetails = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  const { loading, error, data } = useQuery<{
    getRecipeInformation: RecipeDetail;
  }>(GET_RECIPE_INFORMATION, {
    variables: {
      recipeId,
    },
  });

  const recipe = data?.getRecipeInformation;

  useEffect(() => {
    if (!recipe) return;

    const ctx = gsap.context(() => {
      gsap.set(
        ['.recipe-hero', '.stat-card', '.ingredient-card', '.instruction-card'],
        {
          opacity: 1,
          x: 0,
          y: 0,
        },
      );

      gsap.from('.recipe-hero', {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.stat-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.ingredient-card', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out',
      });

      gsap.from('.instruction-card', {
        opacity: 0,
        x: 20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, [recipe]);

  if (loading) {
    return (
      <Container className="recipe-loading text-center mt-5">
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

  if (!recipe) {
    return (
      <Container className="mt-5">
        <h2>Recipe not found.</h2>
      </Container>
    );
  }

  const ingredients = recipe.ingredients || [];

  const steps = recipe.instructions
    ? recipe.instructions.split('\n').filter((step) => step.trim() !== '')
    : [];

  return (
    <Container ref={pageRef} className="recipe-details-page mt-5 mb-5">
      <Card className="recipe-card shadow-lg border-0">
        <div className="recipe-hero">
          <Card.Img src={recipe.image} alt={recipe.title} />

          <div className="hero-overlay">
            <h1>{recipe.title}</h1>

            <p>Fresh from the MadChef kitchen 🍳</p>
          </div>
        </div>

        <Card.Body>
          <Row className="recipe-stats mb-5">
            <Col md={6} className="mb-3">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>

                <h5>Cooking Time</h5>

                <h2>
                  {recipe.readyInMinutes}
                  <span>mins</span>
                </h2>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <div className="stat-card">
                <div className="stat-icon">👨‍👩‍👧‍👦</div>

                <h5>Servings</h5>

                <h2>
                  {recipe.servings}
                  <span>people</span>
                </h2>
              </div>
            </Col>
          </Row>

          <section className="ingredients-section">
            <h2>🥘 Ingredients</h2>

            <Row>
              {ingredients.map((ingredient, index) => (
                <Col md={6} key={index} className="mb-3">
                  <div className="ingredient-card">
                    <span className="ingredient-icon">✓</span>

                    <div>
                      <strong>
                        {ingredient.amount} {ingredient.unit}
                      </strong>

                      <p>{ingredient.name}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          <section className="instructions-section mt-5">
            <h2>👨‍🍳 Cooking Instructions</h2>

            <div className="timeline">
              {steps.map((step, index) => (
                <div className="instruction-card" key={index}>
                  <div className="step-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="step-content">
                    <h4>Step {index + 1}</h4>

                    <p>{step.replace(`${index + 1}.`, '')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="recipe-actions mt-5">
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
