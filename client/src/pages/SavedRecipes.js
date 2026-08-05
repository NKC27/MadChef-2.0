import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeRecipeId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';

import './SavedRecipes.scss';

const SavedRecipes = () => {
  const pageRef = useRef(null);

  const {
    loading,
    data,
    error: getMeError,
    refetch,
  } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
  });

  const [removeRecipe] = useMutation(REMOVE_RECIPE);

  // Track which recipe is mid-delete (for the spinner) and which
  // recipe is queued up for the confirm modal.
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const userData = data?.me || { savedRecipes: [] };

  const confirmDelete = (recipe) => setPendingDelete(recipe);
  const cancelDelete = () => setPendingDelete(null);

  const handleDeleteRecipe = async () => {
    if (!pendingDelete) return;

    const recipeId = pendingDelete.recipeId;
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      setPendingDelete(null);
      return;
    }

    setDeletingId(recipeId);

    try {
      await removeRecipe({
        variables: {
          recipeId,
        },
      });

      removeRecipeId(recipeId);

      // Without this, the mutation succeeds on the server but the
      // list on screen never updates until a manual page reload.
      await refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.from('.saved-hero', {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.saved-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out',
      });

      gsap.from('.empty-state', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, [loading, userData.savedRecipes.length]);

  if (loading) {
    return (
      <Container className="saved-loading text-center">
        <Spinner animation="border" variant="success" />
        <h2 className="mt-3">Loading your recipe book...</h2>
      </Container>
    );
  }

  if (getMeError) {
    console.error('GET_ME failed:', getMeError);

    return (
      <Container className="saved-loading text-center">
        <h2>We couldn&apos;t load your saved recipes.</h2>
        <p className="text-muted">
          Your session may have expired. Please log in again.
        </p>
        <Link to="/" className="btn btn-success">
          Back to Home
        </Link>
      </Container>
    );
  }

  return (
    <div className="saved-recipes-page" ref={pageRef}>
      <section className="saved-hero">
        <Container>
          <h1>🍳 My Recipe Book</h1>

          <p>Your favourite MadChef creations</p>
        </Container>
      </section>

      <Container className="saved-container">
        <h2 className="saved-title">
          {userData.savedRecipes.length
            ? `Saved Recipes (${userData.savedRecipes.length})`
            : 'Your recipe book is empty'}
        </h2>

        {userData.savedRecipes.length === 0 ? (
          <div className="empty-state">
            <h3>👨‍🍳 No recipes yet</h3>

            <p>Search for recipes and save your favourites here.</p>

            <Link to="/search" className="btn btn-success">
              FIND RECIPES
            </Link>
          </div>
        ) : (
          <Row>
            {userData.savedRecipes.map((recipe) => (
              <Col md={6} lg={4} key={recipe.recipeId} className="mb-4">
                <Card className="saved-card">
                  {recipe.image && (
                    <Card.Img src={recipe.image} alt={recipe.title} />
                  )}

                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>

                    {(recipe.readyInMinutes || recipe.servings) && (
                      <div className="recipe-meta">
                        {recipe.readyInMinutes && (
                          <span>⏱️ {recipe.readyInMinutes} min</span>
                        )}

                        {recipe.servings && (
                          <span>👨‍👩‍👧 {recipe.servings} servings</span>
                        )}
                      </div>
                    )}

                    <Card.Text>
                      {recipe.description
                        ? recipe.description.substring(0, 150) + '...'
                        : 'A delicious MadChef recipe ready to cook.'}
                    </Card.Text>

                    <Link
                      to={`/recipe/${recipe.recipeId}`}
                      className="btn btn-success w-100 mb-2"
                    >
                      VIEW RECIPE 🍳
                    </Link>

                    <Button
                      className="w-100"
                      variant="danger"
                      disabled={deletingId === recipe.recipeId}
                      onClick={() => confirmDelete(recipe)}
                    >
                      {deletingId === recipe.recipeId ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          REMOVING...
                        </>
                      ) : (
                        'REMOVE 🗑️'
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal show={!!pendingDelete} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove recipe?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to remove{' '}
          <strong>{pendingDelete?.title}</strong> from your recipe book? This
          can&apos;t be undone.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteRecipe}
            disabled={deletingId === pendingDelete?.recipeId}
          >
            Yes, remove it
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SavedRecipes;
