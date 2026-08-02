## 🚀 Project Status

MadChef 2.0 is currently undergoing a complete UI/UX transformation from a functional recipe application into a polished full-stack portfolio project.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# 🛠 Development Notes & Issues Resolved

This section documents key development decisions, bugs encountered, and solutions implemented during the development of MadChef 2.0.

Keeping a record of these issues helps track the evolution of the application and demonstrates the debugging and problem-solving process.

---

## GraphQL API Migration

### Issue

Recipe searching was originally handled directly from the frontend, exposing API concerns and making future expansion more difficult.

### Solution

- Created a GraphQL API layer using Apollo Server.
- Moved Spoonacular API communication into backend utilities.
- Secured the Spoonacular API key by removing it from frontend exposure.
- Updated frontend components to communicate through GraphQL queries.

### Result

The frontend now requests recipe data through our own API rather than directly communicating with Spoonacular.

---

# Recipe Search Improvements

## Issue

Recipe searching needed to be migrated from the previous implementation into the new GraphQL architecture.

## Solution

Implemented:

- `findRecipesByIngredients` GraphQL query
- Spoonacular recipe mapping inside resolvers
- Apollo Client `useLazyQuery` integration

### Result

Users can search recipes by ingredients and receive recipe cards dynamically.

---

# Recipe Details Feature

## Issue

The application only displayed basic recipe information.

## Solution

Expanded the GraphQL schema to include:

- Ready time
- Servings
- Ingredients
- Instructions

Updated:

`server/schemas/typeDefs.js`

Added:

```graphql
type Ingredient {
  name: String
  amount: Float
  unit: String
}

Expanded:

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

## React Router Recipe Details Bug
Issue

Clicking "See More" changed the URL correctly:

/recipe/:recipeId

However, the page displayed:

Incorrect page
Cause

The fallback route was placed before the RecipeDetails route.

React Router v5 evaluates routes from top to bottom inside <Switch>.

The catch-all route:

<Route
  render={() => <h1>Incorrect page</h1>}
/>

was matching before:

<Route
 exact
 path="/recipe/:recipeId"
 component={RecipeDetails}
/>
Solution

Moved the RecipeDetails route above the fallback route.

Result

Recipe details now load correctly.

GraphQL Recipe Details Debugging
Issue

RecipeDetails page was not displaying recipe information.

Investigation

Verified:

GraphQL query response
Spoonacular API response
Resolver output
Apollo Client connection

Test query returned:

{
  "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
  "image": "https://img.spoonacular.com/recipes/716429-556x370.jpg",
  "readyInMinutes": 45
}
Result

Backend confirmed working.

The issue was identified as frontend routing rather than API communication.

React Warnings Identified
ReactDOM.render Warning
Issue

React 18 warning:

ReactDOM.render is no longer supported in React 18
Status

Not yet fixed.

Planned Solution

Migrate:

ReactDOM.render()

to:

createRoot()

during React 18 modernisation sprint.

Accessibility Improvements Required

Warnings identified:

Missing alt attributes on images
Emoji accessibility warnings
Unused variables

Planned improvements:

Add meaningful image descriptions
Replace decorative emojis with accessible components
Remove unused imports and variables
Current Development Branch

Feature work is currently being developed on:

feature/recipe-details-page

Purpose:

Building a richer recipe experience including:

Recipe hero section
Improved UI layout
Ingredient cards
Instructions timeline
Animations
Nutrition information
Improved user experience
Future Improvements

Planned roadmap:

Premium recipe detail UI
GSAP animations
Dark mode
Favourite recipes
Nutrition information
Recipe categories
Improved mobile experience
React 18 migration
Performance optimisation
```
