import { Schema } from 'mongoose';

export interface IRecipe {
  recipeId: string;
  description: string;
  title: string;
  image?: string;
  link?: string;
  readyInMinutes?: number;
  servings?: number;
}

const recipeSchema = new Schema<IRecipe>({
  recipeId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  readyInMinutes: {
    type: Number,
  },
  servings: {
    type: Number,
  },
});

export default recipeSchema;
