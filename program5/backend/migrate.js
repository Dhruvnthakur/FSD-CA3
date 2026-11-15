const { sequelize } = require('./db');
require('./models/Product');
require('./models/User');

const migrate = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized with PostgreSQL successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
