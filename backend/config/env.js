require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
  SecretKey: process.env.SECRET_KEY,
  STRIPE_KEY : process.env.STRIPE_KEY
};
