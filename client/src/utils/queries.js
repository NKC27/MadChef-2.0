import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      recipeCount
      savedRecipes {
        recipeId
        description
        title
        image
        link
      }
    }
  }
`;

export const FIND_RECIPES_BY_INGREDIENTS = gql`
  query FindRecipesByIngredients($ingredients: [String!]!) {
    findRecipesByIngredients(ingredients: $ingredients) {
      recipeId
      title
      description
      image
      link
    }
  }
`;

export const GET_RECIPE_INFORMATION = gql`
  query GetRecipeInformation($recipeId: ID!) {
    getRecipeInformation(recipeId: $recipeId) {
      recipeId
      title
      description
      image
      link
      readyInMinutes
      servings
      instructions
      ingredients {
        name
        amount
        unit
      }
    }
  }
`;
