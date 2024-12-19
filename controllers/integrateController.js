const RecipeModel = require('../models/recipeModel');

const fetchRecipes = (req, res) => {
  const { limit, category, keyword } = req.query;
  const parsedLimit = parseInt(limit, 10) || 10;

  RecipeModel.getRecipes(parsedLimit, category, keyword, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve recipes.' });
    }
    res.json(data);
  });
};

module.exports = { fetchRecipes };
