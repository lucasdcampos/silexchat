import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  dbSource: 'silex.db',
};

if (!config.jwtSecret || !config.refreshTokenSecret) {
  throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in .env file');
}