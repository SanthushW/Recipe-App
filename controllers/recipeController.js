const RecipeModel = require('../models/recipeModel');

const fetchRecipes = (req, res) => {
    const { limit, category } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit; // Default limit is 10

    RecipeModel.getRecipes(safeLimit, category, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve recipes.' });
        }
        res.json(data);
    });
};

const getAllCategories = (req, res) => {
    RecipeModel.getCategories((err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve categories.', details: err });
        }
        res.json(data);
    });
};

module.exports = { fetchRecipes,getAllCategories };