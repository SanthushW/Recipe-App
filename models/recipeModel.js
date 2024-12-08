const db = require("../config/dbConfig");

const getRecipes = (limit, categoryName, callback) => {
  let query;

  // Case 1: No limit or category
  if (!limit && !categoryName) {
    query = "SELECT * FROM recipes";
  }

  // Case 2: Limit only
  else if (limit && !categoryName) {
    query = `SELECT * FROM recipes LIMIT ${parseInt(limit, 10)}`;
  }

  // Case 3: Category only
  else if (!limit && categoryName) {
    query = `
            SELECT recipes.* 
            FROM recipes
            INNER JOIN recipe_categories ON recipes.rec_id = recipe_categories.rec_id
            INNER JOIN categories ON recipe_categories.cat_id = categories.cat_id
            WHERE categories.cname = '${categoryName}'
        `;
  }

  // Case 4: Both limit and category
  else if (limit && categoryName) {
    query = `
            SELECT recipes.* 
            FROM recipes
            INNER JOIN recipe_categories ON recipes.rec_id = recipe_categories.rec_id
            INNER JOIN categories ON recipe_categories.cat_id = categories.cat_id
            WHERE categories.cname = '${categoryName}' 
            LIMIT ${parseInt(limit, 10)}
        `;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Fetch all categories
const getCategories = (callback) => {
  const query = "SELECT * FROM categories";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Fetch all recipes with pagination
const getAllRecipesPaginated = (limit = 21, page = 1, callback) => {
  const offset = (page - 1) * limit; // Calculate offset for pagination

  const query = `
    SELECT SQL_CALC_FOUND_ROWS recipes.*, 
           COALESCE(AVG(rv.rating), 0) AS avg_rating, -- Calculate average rating
           COALESCE(COUNT(rv.review_id), 0) AS review_count -- Count number of reviews
    FROM recipes
    LEFT JOIN reviews rv ON recipes.rec_id = rv.rec_id -- Join with Reviews table to get ratings and reviews count
    GROUP BY recipes.rec_id
    LIMIT ? OFFSET ?;
  `;

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Database query failed:", err.sqlMessage);
      return callback(err, null);
    }

    // Get total row count for pagination metadata
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

module.exports = { getRecipes, getCategories, getAllRecipesPaginated };
