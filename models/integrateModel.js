const db = require('../config/dbConfig');

const getRecipes = (limit, category, keyword, callback) => {
  let query = "SELECT * FROM recipes WHERE 1=1"; // Basic query

  // Add filters dynamically
  if (category) {
    query += ` AND category = '${category}'`;
  }
  if (keyword) {
    query += ` AND (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%')`;
  }
  query += ` LIMIT ${limit}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query failed:', err.sqlMessage);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = { getRecipes };
