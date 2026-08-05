export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface SavedRecipe {
  recipeId: string;
  title: string;
  description: string;
  image: string;
  link: string;
  readyInMinutes?: number;
  servings?: number;
}

export interface SearchResult {
  recipeId: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface RecipeDetail {
  recipeId: string;
  title: string;
  description: string;
  image: string;
  link: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  ingredients: Ingredient[];
}

export interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  recipeCount: number;
  savedRecipes: SavedRecipe[];
}

export interface CheckListItem {
  item: string;
  image: string;
}
