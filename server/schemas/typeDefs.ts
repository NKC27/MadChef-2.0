const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    recipeCount: Int
    savedRecipes: [Recipe]
  }

  type Auth {
    token: String!
    user: User
  }

  type Recipe {
    recipeId: ID!
    description: String
    title: String
    image: String
    link: String
    readyInMinutes: Int
    servings: Int
  }

  type Ingredient {
    name: String
    amount: Float
    unit: String
  }

  type SpoonacularRecipe {
    recipeId: ID!
    title: String!
    description: String
    image: String
    link: String
    readyInMinutes: Int
    servings: Int
    instructions: String
    ingredients: [Ingredient]
  }

  input RecipeInput {
    recipeId: ID!
    title: String
    description: String
    image: String
    link: String
    readyInMinutes: Int
    servings: Int
  }

  type Query {
    me: User
    findRecipesByIngredients(ingredients: [String!]!): [SpoonacularRecipe]
    getRecipeInformation(recipeId: ID!): SpoonacularRecipe
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRecipe(newRecipe: RecipeInput!): User
    removeRecipe(recipeId: ID!): User
  }
`;

export default typeDefs;
