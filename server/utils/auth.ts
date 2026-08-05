import jwt from 'jsonwebtoken';
import type { Request } from 'express';

const expiration = '2h';

export interface TokenPayload {
  _id: string;
  username: string;
  email: string;
}

export interface GraphQLContext {
  user: TokenPayload | null;
}

export const authMiddleware = async ({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ').pop()?.trim() || '';
  }

  let user: TokenPayload | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        data: TokenPayload;
      };
      user = decoded.data;
    } catch (err) {
      console.warn('Invalid token');
    }
  }

  return { user };
};

export const signToken = ({ username, email, _id }: TokenPayload): string => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, process.env.JWT_SECRET as string, {
    expiresIn: expiration,
  });
};
