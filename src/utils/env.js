require("dotenv").config();

module.exports = {
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  PGPORT: process.env.PGPORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
  EMAIL_FROM: process.env.EMAIL_FROM,
  RUSTFS_ENDPOINT: process.env.RUSTFS_ENDPOINT,
  RUSTFS_ACCESS_KEY: process.env.RUSTFS_ACCESS_KEY,
  RUSTFS_SECRET_KEY: process.env.RUSTFS_SECRET_KEY,
};
