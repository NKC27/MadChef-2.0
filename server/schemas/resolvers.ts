import { GraphQLError } from 'graphql';
import { User } from '../models';
import { signToken, GraphQLContext } from '../utils/auth';
import {
  findRecipesByIngredients,
  getRecipeInformation,
} from '../utils/spoonacular';

const authenticationError = () =>
  new GraphQLError('You need to be logged in', {
    extensions: { code: 'UNAUTHENTICATED' },
  });

interface RecipeInput {
  recipeId: string;
  title?: string;
  description?: string;
  image?: string;
  link?: string;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).select(
          '-__v -password',
        );
      }

      throw authenticationError();
    },

    findRecipesByIngredients: async (
      _parent: unknown,
      { ingredients }: { ingredients: string[] },
    ) => {
      const recipes = await findRecipesByIngredients(ingredients);

      return recipes.map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title,
        description: '',
        image: recipe.image || '',
        link: '',
      }));
    },

    getRecipeInformation: async (
      _parent: unknown,
      { recipeId }: { recipeId: string },
    ) => {
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
    addUser: async (
      _parent: unknown,
      args: { username: string; email: string; password: string },
    ) => {
      const user = await User.create(args);
      const token = signToken({
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      });

      return { token, user };
    },

    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw authenticationError();
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw authenticationError();
      }

      const token = signToken({
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      });

      return { token, user };
    },

    saveRecipe: async (
      _parent: unknown,
      { newRecipe }: { newRecipe: RecipeInput },
      context: GraphQLContext,
    ) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedRecipes: newRecipe } },
          { new: true },
        );
      }

      throw authenticationError();
    },

    removeRecipe: async (
      _parent: unknown,
      { recipeId }: { recipeId: string },
      context: GraphQLContext,
    ) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedRecipes: { recipeId } } },
          { new: true },
        );
      }

      throw authenticationError();
    },
  },
};

export default resolvers;
