const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const {
  findRecipesByIngredients,
  getRecipeInformation,
} = require('../utils/spoonacular');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
        }).select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    findRecipesByIngredients: async (parent, { ingredients }) => {
      const recipes = await findRecipesByIngredients(ingredients);

      return recipes.map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title,
        description: '',
        image: recipe.image || '',
        link: '',
      }));
    },

    getRecipeInformation: async (parent, { recipeId }) => {
      const recipe = await getRecipeInformation(recipeId);

      return {
        recipeId: recipe.id,
        title: recipe.title,
        description: recipe.summary || '',
        image: recipe.image || '',
        link: recipe.sourceUrl || '',

        readyInMinutes: recipe.readyInMinutes || 0,
        servings: recipe.servings || 0,

        instructions:
          recipe.analyzedInstructions?.[0]?.steps
            ?.map((step) => `${step.number}. ${step.step}`)
            .join('\n') || '',

        ingredients:
          recipe.extendedIngredients?.map((ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })) || [],
      };
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveRecipe: async (parent, { newRecipe }, context) => {
      console.log('AUTH CONTEXT:', context);
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedRecipes: newRecipe } },
          { new: true },
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRecipes: { recipeId } } },
          { new: true },
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in');
    },
  },
}; //

module.exports = resolvers;
