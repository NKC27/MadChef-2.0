# MadChef

Find a recipe from the ingredients you already have. Search by name, or check
off what's in your fridge and get matching dishes back — powered by the
Spoonacular API behind a GraphQL backend.

Originally built as a team project ([original repo](https://github.com/sikandersultan/MadChef)).
This version is a personal portfolio fork with the stack modernized end to end.

## Tech stack

**Client:** React 18, TypeScript, Vite, React Router v6, Apollo Client,
React Bootstrap 2 / Bootstrap 5, GSAP, React DnD

**Server:** Node/Express, TypeScript, Apollo Server 4, GraphQL, Mongoose 8,
JWT auth (bcryptjs for password hashing)

### What changed in the modernization

- **Build tooling:** Create React App (react-scripts 3.4, patched to run on
  modern Node via a legacy OpenSSL flag) → Vite.
- **Language:** JavaScript → TypeScript across both client and server, with
  shared domain types for recipes, ingredients, and users.
- **Routing:** react-router-dom v5 (`Switch`/`component=`) → v6
  (`Routes`/`element=`).
- **Backend framework:** `apollo-server-express` v2 (unmaintained) →
  `@apollo/server` v4 with the Express 4 integration.
- **UI library:** upgraded React Bootstrap v1 → v2 / Bootstrap 5, replacing
  the handful of components v2 dropped (`Jumbotron`, `CardColumns`). Swapped
  `@mui/material` + `@emotion/*` (pulled in only for 4 footer icons) for the
  much lighter `react-icons`.
- **Dependency cleanup:** removed dead/unused packages (`apollo-client` v2,
  `wipeclean`, MUI/Emotion), removed dead code that had a Spoonacular API key
  hardcoded client-side (superseded by the GraphQL backend, which already
  proxies Spoonacular server-side so the key is never exposed to the
  browser).
- **Password hashing:** `bcrypt` (native binary) → `bcryptjs` (pure JS, no
  native build step, more portable across environments).

## Project structure

```
madchef/
├─ client/          React + TypeScript + Vite app
│  └─ src/
│     ├─ components/
│     ├─ pages/
│     ├─ utils/      Apollo queries/mutations, auth helper, localStorage helpers
│     └─ types/       shared TS interfaces
└─ server/          Express + TypeScript GraphQL API
   ├─ config/        MongoDB connection
   ├─ models/        Mongoose schemas (User, Recipe)
   ├─ schemas/       GraphQL typeDefs + resolvers
   └─ utils/          auth (JWT) and Spoonacular API client
```

## Getting started

You'll need Node 18+ and a MongoDB instance (local or Atlas).

```bash
git clone <this-repo>
cd madchef
npm install
```

Then set up environment variables — copy the example file and fill in real
values:

```bash
cp server/.env.example server/.env
```

```
SPOONACULAR_API_KEY=your_spoonacular_api_key
JWT_SECRET=replace_with_a_long_random_string
MONGODB_URI=mongodb://127.0.0.1:27017/madchef
```

Run both the client and server in development:

```bash
npm run dev
```

This starts the Vite dev server (client) and the GraphQL API (server) side
by side, with the client proxying `/graphql` requests to the server.

Other useful scripts:

```bash
npm run build       # builds server (tsc) and client (vite build)
npm run typecheck   # type-checks both workspaces
npm start           # runs the compiled server (serves the built client too)
```

## Screenshots

### Home screen login
![image1](./client/src/assets/loginScreen.png)

### User logged in
![image2](./client/src/assets/homeScreenUserLoggedIn.png)

### Recipe builder
![image3](./client/src/assets/recipeBuilder.png)

### Searched recipes
![image4](./client/src/assets/searchRecipes.png)

### Saved recipes
![image5](./client/src/assets/savedRecipes.png)

## Credits

Original team: Ryan ([@Ryocon](https://github.com/Ryocon)),
Nick ([@NKC27](https://github.com/NKC27)),
Sikander ([@sikandersultan](https://github.com/sikandersultan)).

Modernization (Vite/TypeScript rewrite, dependency cleanup, backend
migration) by Nicholas Clarke.
