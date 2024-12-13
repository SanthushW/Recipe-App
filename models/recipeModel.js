const db = require('../config/dbConfig');

const getRecipes = (limit, categoryName,keyword, callback) => {
    let query;

    // Case 1: No limit or category
    if (!limit && !categoryName) {
        query = 'SELECT * FROM recipes';
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

    // Case 4: Keyword only
    else if (!limit && !categoryName && keyword) {
        query = `SELECT * FROM recipes WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;
    }

    // Case 5: Both limit and category
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
    // Case 6: Limit and Keyword
    else if (limit && !categoryName && keyword) {
        query = `SELECT * FROM recipes WHERE (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%') LIMIT ${parseInt(limit, 10)}`;
        console.log(query)
    }

    // Case 7: Category and Keyword
    else if (!limit && categoryName && keyword) {
        query = `
            SELECT recipes.* 
            FROM recipes
            INNER JOIN recipe_categories ON recipes.rec_id = recipe_categories.rec_id
            INNER JOIN categories ON recipe_categories.cat_id = categories.cat_id
            WHERE categories.cname = '${categoryName}' AND (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%')
        `;
    }

    // Case 8: Limit, Category, and Keyword
    else if (limit && categoryName && keyword) {
        query = `
            SELECT recipes.* 
            FROM recipes
            INNER JOIN recipe_categories ON recipes.rec_id = recipe_categories.rec_id
            INNER JOIN categories ON recipe_categories.cat_id = categories.cat_id
            WHERE categories.cname = '${categoryName}' AND (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%') 
            LIMIT ${parseInt(limit, 10)}
        `;
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.sqlMessage);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


// Fetch all categories
const getCategories = (callback) => {
    const query = 'SELECT * FROM categories';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.sqlMessage);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

module.exports = { getRecipes,getCategories };
