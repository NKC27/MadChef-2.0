import { useMemo, useState } from 'react';
import { Container, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';
import { FiCheck, FiSearch, FiPlus, FiX } from 'react-icons/fi';

import './RecipeBuilder.scss';

import { ingredientLibrary } from '../../utils/ingredientLibrary';
import { hideBrokenImage } from '../../utils/hideBrokenImage';
import {
  FIND_RECIPES_BY_INGREDIENTS,
  GET_RECIPE_INFORMATION,
} from '../../utils/queries';
import type { RecipeDetail, SearchResult } from '../../types';

function RecipeBuilder() {
  const [checked, setChecked] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
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

  const customIngredients = checked.filter(
    (name) => !ingredientLibrary.some((item) => item.name === name),
  );

  const filteredLibrary = useMemo(() => {
    const query = filterText.trim().toLowerCase();

    if (!query) return ingredientLibrary;

    return ingredientLibrary.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [filterText]);

  const runSearch = async (ingredients: string[]) => {
    if (ingredients.length === 0) return;

    try {
      await findRecipes({ variables: { ingredients } });
    } catch (err) {
      console.error('Recipe search failed:', err);
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedRecipe(null);
  };

  const handleCheck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ingredient = event.target.value;

    const updatedList = event.target.checked
      ? [...checked, ingredient]
      : checked.filter((item) => item !== ingredient);

    setChecked(updatedList);
    await runSearch(updatedList);
  };

  const handleAddCustomIngredient = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = filterText.trim();
    if (!value) return;

    const alreadyAdded = checked.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (!alreadyAdded) {
      const updatedList = [...checked, value];
      setChecked(updatedList);
      await runSearch(updatedList);
    }

    setFilterText('');
  };

  const removeCustomIngredient = async (name: string) => {
    const updatedList = checked.filter((item) => item !== name);
    setChecked(updatedList);
    await runSearch(updatedList);
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

  return (
    <div className="recipe-builder">
      <section className="builder-hero">
        <Container>
          <p className="mc-eyebrow justify-content-center">Recipe builder</p>
          <h1>Combine your ingredients into a recipe</h1>
          <p className="builder-hero__subcopy">
            Tap everything you&rsquo;ve got in the kitchen and we&rsquo;ll
            match it against real recipes as you go.
          </p>
        </Container>
      </section>

      <Container className="builder-body">
        <h2 className="builder-section-title">Ingredients to build with</h2>

        <form className="ingredient-search" onSubmit={handleAddCustomIngredient}>
          <div className="ingredient-search__field">
            <FiSearch className="ingredient-search__icon" aria-hidden="true" />
            <input
              type="text"
              className="ingredient-search__input"
              placeholder="Search ingredients or add your own…"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
          </div>

          {filterText.trim() && filteredLibrary.length === 0 && (
            <button type="submit" className="ingredient-search__add">
              <FiPlus aria-hidden="true" />
              Add &ldquo;{filterText.trim()}&rdquo;
            </button>
          )}
        </form>

        {customIngredients.length > 0 && (
          <div className="custom-ingredient-list">
            {customIngredients.map((name) => (
              <span className="custom-ingredient-pill" key={name}>
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => removeCustomIngredient(name)}
                >
                  <FiX aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        {filterText.trim() && filteredLibrary.length === 0 && (
          <p className="ingredient-grid__empty">
            No preset ingredient matches &ldquo;{filterText.trim()}&rdquo; —
            add it as your own above.
          </p>
        )}

        <div className="ingredient-grid">
          {filteredLibrary.map((item) => {
            const active = checked.includes(item.name);
            const Icon = item.icon;

            return (
              <label
                className={`ingredient-chip${active ? ' ingredient-chip--active' : ''}`}
                key={item.name}
              >
                <input
                  className="ingredient-chip__input"
                  value={item.name}
                  type="checkbox"
                  checked={active}
                  onChange={handleCheck}
                />

                <span className="ingredient-chip__check">
                  <FiCheck aria-hidden="true" />
                </span>

                {Icon ? (
                  <Icon className="ingredient-chip__icon" aria-hidden="true" />
                ) : (
                  <span className="ingredient-chip__monogram" aria-hidden="true">
                    {item.name.charAt(0)}
                  </span>
                )}

                <span className="ingredient-chip__label">{item.name}</span>
              </label>
            );
          })}
        </div>

        <h2 className="builder-results-title">
          {searchedRecipes.length
            ? `Viewing ${searchedRecipes.length} results`
            : checked.length
              ? 'No recipes matched yet — try adding another ingredient'
              : 'Select ingredients above to generate a recipe'}
        </h2>

        <Row xs={1} md={2} lg={3} className="g-4">
          {searchedRecipes.map((recipe) => (
            <Col key={recipe.recipeId}>
              <Card className="recipe-card h-100">
                {recipe.image && (
                  <Card.Img
                    variant="top"
                    src={recipe.image}
                    alt={recipe.title}
                    onError={hideBrokenImage}
                  />
                )}

                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>

                  <Button
                    className="see-more-btn w-100"
                    variant="outline-light"
                    onClick={() => showDetails(recipe.recipeId)}
                  >
                    See More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

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
                onError={hideBrokenImage}
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
      </Container>
    </div>
  );
}

export default RecipeBuilder;
