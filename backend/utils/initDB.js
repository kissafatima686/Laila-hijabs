// utils/initDB.js

const mysql = require('mysql2/promise');
require('dotenv').config();
const { createTables, seedData } = require('../models/schema');

async function initializeDatabase() {
  let connection;
  try {
    // 1. Connect without selecting database to ensure database exists
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'laila_hijabs';
    const port = parseInt(process.env.DB_PORT, 10) || 3306;

    connection = await mysql.createConnection({ host, user, password, port });
    console.log(' Connected to MySQL server.');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(` Database '${dbName}' ready.`);

    // Switch to database
    await connection.changeUser({ database: dbName });

    // 2. Run CREATE TABLE queries
    console.log(' Building schema...');
    for (const sql of createTables) {
      await connection.query(sql);
      const tableNameMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      if (tableNameMatch) {
        console.log(` Table verified/created: ${tableNameMatch[1]}`);
      }
    }

    // 3. Insert Seed Data
    console.log(' Seeding initial data...');
    for (const sql of seedData) {
      await connection.query(sql);
    }
    console.log(' Seeding complete.');

    console.log(' Database initialization completed successfully!');
  } catch (err) {
    console.error(' Database initialization failed:', err.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log(' Connection closed.');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;