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

const createRecipe = (recipeData, callback) => {
  // Start a transaction to handle multiple table insertions
  db.beginTransaction((err) => {
    if (err) {
      return callback(err, null);
    }

    // Insert main recipe data
    const recipeQuery = `
      INSERT INTO recipes 
      (title, description, servings, prep_time, cook_time, instructions, cooks_tips, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const recipeValues = [
      recipeData.title,
      recipeData.description,
      recipeData.servings,
      `${recipeData.prepTime.hours} hours ${recipeData.prepTime.minutes} minutes`,
      `${recipeData.cookTime.hours} hours ${recipeData.cookTime.minutes} minutes`,
      JSON.stringify(recipeData.instructions),
      recipeData.cooksTips || null,
      recipeData.imageUrl || null
    ];

    db.query(recipeQuery, recipeValues, (recipeErr, recipeResult) => {
      if (recipeErr) {
        return db.rollback(() => {
          callback(recipeErr, null);
        });
      }

      const recipeId = recipeResult.insertId;

      // Insert ingredients
      const ingredientQueries = recipeData.ingredients.map(ingredient => {
        return new Promise((resolve, reject) => {
          const ingredientQuery = `
            INSERT INTO recipe_ingredients 
            (rec_id, quantity, measurement, ingredient_name) 
            VALUES (?, ?, ?, ?)
          `;
          
          db.query(
            ingredientQuery, 
            [recipeId, ingredient.quantity, ingredient.measurement, ingredient.item], 
            (ingredientErr) => {
              if (ingredientErr) reject(ingredientErr);
              else resolve();
            }
          );
        });
      });

      // Insert categories if provided
      const categoryQueries = recipeData.categories ? 
        recipeData.categories.map(category => {
          return new Promise((resolve, reject) => {
            const categoryQuery = `
              INSERT INTO recipe_categories 
              (rec_id, cat_id) 
              SELECT ?, cat_id 
              FROM categories 
              WHERE cname = ?
            `;
            
            db.query(
              categoryQuery, 
              [recipeId, category], 
              (categoryErr) => {
                if (categoryErr) reject(categoryErr);
                else resolve();
              }
            );
          });
        }) : 
        [];

      // Execute all queries
      Promise.all([...ingredientQueries, ...categoryQueries])
        .then(() => {
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                callback(commitErr, null);
              });
            }
            callback(null, { id: recipeId, ...recipeData });
          });
        })
        .catch((error) => {
          return db.rollback(() => {
            callback(error, null);
          });
        });
    });
  });
};


module.exports = { getRecipes, getCategories, getAllRecipesPaginated };
