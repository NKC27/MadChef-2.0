import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas';
import db from './config/connection';
import { authMiddleware, GraphQLContext } from './utils/auth';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: authMiddleware,
    }),
  );

  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`GraphQL server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
