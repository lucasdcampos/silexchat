import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  dbSource: 'silex.db',
};

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET must be defined in .env file');
}