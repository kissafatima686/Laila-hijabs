const { pool } = require('./config/db');
const { createTables, seedData } = require('./models/schema');

async function resetDB() {
  try {
    console.log("Dropping tables...");
    // Disable foreign key checks so we can drop tables in any order
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const [tables] = await pool.query('SHOW TABLES');
    for (let row of tables) {
      const tableName = Object.values(row)[0];
      console.log(`Dropping ${tableName}`);
      await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
    }
    
    console.log("Recreating tables...");
    for (let query of createTables) {
      await pool.query(query);
    }
    
    console.log("Inserting seed data...");
    for (let query of seedData) {
      await pool.query(query);
    }
    
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("Database reset complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error resetting database:", err);
    process.exit(1);
  }
}

resetDB();
