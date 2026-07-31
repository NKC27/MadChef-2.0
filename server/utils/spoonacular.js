const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

const getApiKey = () => {
  if (!process.env.SPOONACULAR_API_KEY) {
    throw new Error('SPOONACULAR_API_KEY is not configured');
  }

  return process.env.SPOONACULAR_API_KEY;
};

const findRecipesByIngredients = async (ingredients) => {
  const apiKey = getApiKey();

  const url = new URL(`${SPOONACULAR_BASE_URL}/findByIngredients`);

  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('ingredients', ingredients.join(','));
  url.searchParams.set('number', '9');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Spoonacular error: ${response.status}`);
  }

  return response.json();
};

const getRecipeInformation = async (recipeId) => {
  const apiKey = getApiKey();

  const url = new URL(`${SPOONACULAR_BASE_URL}/${recipeId}/information`);

  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('includeNutrition', 'false');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Spoonacular error: ${response.status}`);
  }

  return response.json();
};

module.exports = {
  findRecipesByIngredients,
  getRecipeInformation,
};
