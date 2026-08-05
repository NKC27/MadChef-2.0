import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import recipeSchema, { IRecipe } from './Recipe';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  savedRecipes: Types.DocumentArray<IRecipe>;
  recipeCount: number;
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedRecipes: [recipeSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('recipeCount').get(function (this: IUser) {
  return this.savedRecipes.length;
});

const User = model<IUser>('User', userSchema);

export default User;
