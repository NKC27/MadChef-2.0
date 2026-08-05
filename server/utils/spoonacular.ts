const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

const getApiKey = (): string => {
  if (!process.env.SPOONACULAR_API_KEY) {
    throw new Error('SPOONACULAR_API_KEY is not configured');
  }

  return process.env.SPOONACULAR_API_KEY;
};

export interface SpoonacularSearchResult {
  id: number;
  title: string;
  image?: string;
}

export interface SpoonacularRecipeDetail {
  id: number;
  title: string;
  summary?: string;
  image?: string;
  sourceUrl?: string;
  readyInMinutes?: number;
  servings?: number;
  analyzedInstructions?: Array<{
    steps: Array<{ number: number; step: string }>;
  }>;
  extendedIngredients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

export const findRecipesByIngredients = async (
  ingredients: string[],
): Promise<SpoonacularSearchResult[]> => {
  const apiKey = getApiKey();

  const url = new URL(`${SPOONACULAR_BASE_URL}/findByIngredients`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('ingredients', ingredients.join(','));
  url.searchParams.set('number', '9');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Spoonacular error: ${response.status}`);
  }

  return response.json() as Promise<SpoonacularSearchResult[]>;
};

export const getRecipeInformation = async (
  recipeId: string,
): Promise<SpoonacularRecipeDetail> => {
  const apiKey = getApiKey();

  const url = new URL(`${SPOONACULAR_BASE_URL}/${recipeId}/information`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('includeNutrition', 'false');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Spoonacular error: ${response.status}`);
  }

  return response.json() as Promise<SpoonacularRecipeDetail>;
};
