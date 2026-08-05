import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Home from './pages/Home';
import SearchRecipes from './pages/SearchRecipes';
import SavedRecipes from './pages/SavedRecipes';
import Navbar from './components/Navbar';
import RecipeBuilder from './components/RecipeBuilder/RecipeBuilder';
import Footer from './components/Footer/Footer';
import RecipeDetails from './pages/RecipeDetails';
import Auth from './utils/auth';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Catches auth failures (expired/invalid token, secret rotated on a
// server restart, etc.) globally so they never fail silently again.
// Without this, an invalid token just makes queries quietly return
// null/empty data with no indication anything is wrong.
const errorLink = onError(({ graphQLErrors, networkError }) => {
  const isAuthError =
    graphQLErrors?.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        /not logged in|invalid token|unauthenticated|unauthorized/i.test(
          err.message || '',
        ),
    ) || (networkError as { statusCode?: number })?.statusCode === 401;

  if (graphQLErrors) {
    graphQLErrors.forEach((err) =>
      console.error('[GraphQL error]:', err.message, err.extensions),
    );
  }

  if (networkError) {
    console.error('[Network error]:', networkError);
  }

  if (isAuthError && Auth.loggedIn()) {
    // The token we're holding is no longer valid server-side.
    // Clear it and send the user back to log in cleanly, rather
    // than leaving them staring at a page that looks empty/broken.
    console.warn('Session expired or invalid — logging out.');
    Auth.logout();
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchRecipes />} />
          <Route path="/saved" element={<SavedRecipes />} />
          <Route path="/RecipeBuilder" element={<RecipeBuilder />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
          <Route
            path="*"
            element={<h1 className="display-2">Incorrect page</h1>}
          />
        </Routes>
      </Router>
      <Footer />
    </ApolloProvider>
  );
}

export default App;
