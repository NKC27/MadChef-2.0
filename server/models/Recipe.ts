import { Schema } from 'mongoose';

export interface IRecipe {
  recipeId: string;
  description: string;
  title: string;
  image?: string;
  link?: string;
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
});

export default recipeSchema;
