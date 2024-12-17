const db = require("../config/dbConfig");

// Fetch all nutritional data
const getAllNutrition = (callback) => {
  const query = "SELECT * FROM nutrition";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Fetch nutritional data by nutrition_id
const getNutritionById = (nutrition_id, callback) => {
  const query = "SELECT * FROM nutrition WHERE nutrition_id = ?";

  db.query(query, [nutrition_id], (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results[0] || null); // Return single record
  });
};

// Fetch nutritional data by recipe ID (rec_id)
const getNutritionByRecipeId = (rec_id, callback) => {
  const query = "SELECT * FROM nutrition WHERE rec_id = ?";

  db.query(query, [rec_id], (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Fetch nutritional data with optional filters (e.g., limit, recipe ID)
const getNutritionWithFilters = (limit, rec_id, callback) => {
  let query = "SELECT * FROM nutrition";
  const params = [];

  // Case 1: Filter by recipe ID
  if (rec_id) {
    query += " WHERE rec_id = ?";
    params.push(rec_id);
  }

  // Case 2: Apply limit
  if (limit) {
    query += " LIMIT ?";
    params.push(parseInt(limit, 10));
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Paginate nutritional data
const getAllNutritionPaginated = (limit = 10, page = 1, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT SQL_CALC_FOUND_ROWS *
    FROM nutrition
    LIMIT ? OFFSET ?;
  `;

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }

    // Fetch total count for pagination
    db.query("SELECT FOUND_ROWS() AS total", (countErr, countResults) => {
      if (countErr) {
        console.error("Database query failed:", countErr.sqlMessage);
        return callback(countErr, null);
      }

      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);

      return callback(null, {
        data: results,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          perPage: limit,
        },
      });
    });
  });
};

module.exports = {
  getAllNutrition,
  getNutritionById,
  getNutritionByRecipeId,
  getNutritionWithFilters,
  getAllNutritionPaginated,
};
