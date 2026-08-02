const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.headers.authorization || '';

    if (token.startsWith('Bearer ')) {
      token = token.split(' ').pop().trim();
    }

    let user = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, secret);

        user = decoded.data;
      } catch (err) {
        console.log('Invalid token');
      }
    }

    return {
      user,
    };
  },

  signToken: function ({ username, email, _id }) {
    const payload = {
      username,
      email,
      _id,
    };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
