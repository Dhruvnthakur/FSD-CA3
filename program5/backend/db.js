const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for development, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';
let sequelize;

if (isProduction) {
  const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/shopping_db';
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // SQLite for development (no external DB needed)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
  });
}

// Test Connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connected (${isProduction ? 'PostgreSQL' : 'SQLite'})`);
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
};

module.exports = { sequelize, testConnection };
