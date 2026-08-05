export const getSavedRecipesIds = (): number[] => {
  const raw = localStorage.getItem('saved_recipe');
  return raw ? JSON.parse(raw) : [];
};

export const saveRecipeIds = (recipeIdArr: number[]): void => {
  if (recipeIdArr.length) {
    localStorage.setItem('saved_recipe', JSON.stringify(recipeIdArr));
  } else {
    localStorage.removeItem('saved_recipe');
  }
};

export const removeRecipeId = (recipeId: string | number): boolean => {
  const raw = localStorage.getItem('saved_recipe');
  const savedRecipeIds: number[] | null = raw ? JSON.parse(raw) : null;

  if (!savedRecipeIds) {
    return false;
  }

  const updatedSavedRecipeIds = savedRecipeIds.filter(
    (savedId) => savedId !== recipeId,
  );
  localStorage.setItem('saved_recipe', JSON.stringify(updatedSavedRecipeIds));

  return true;
};
