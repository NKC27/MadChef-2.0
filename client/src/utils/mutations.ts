import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        recipeCount
        savedRecipes {
          recipeId
          title
          description
          image
          link
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        recipeCount
        savedRecipes {
          recipeId
          title
          description
          image
          link
        }
      }
    }
  }
`;

export const SAVE_RECIPE = gql`
  mutation saveRecipe($newRecipe: RecipeInput!) {
    saveRecipe(newRecipe: $newRecipe) {
      _id
      username
      email
      recipeCount
      savedRecipes {
        recipeId
        title
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_RECIPE = gql`
  mutation removeRecipe($recipeId: ID!) {
    removeRecipe(recipeId: $recipeId) {
      _id
      username
      email
      recipeCount
      savedRecipes {
        recipeId
        title
        description
        image
        link
      }
    }
  }
`;
