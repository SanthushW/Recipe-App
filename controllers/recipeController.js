const RecipeModel = require("../models/recipeModel");

const fetchRecipes = (req, res) => {
  const { limit, category } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit; // Default limit is 10

  RecipeModel.getRecipes(safeLimit, category, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve recipes." });
    }
    res.json(data);
  });
};

const getAllCategories = (req, res) => {
  RecipeModel.getCategories((err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve categories.", details: err });
    }
    res.json(data);
  });
};

const fetchAllRecipesPaginated = (req, res) => {
  const limit = 21; // Default limit for pagination
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified

  // Validate page number
  if (page <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid page number. Page must be greater than 0." });
  }

  RecipeModel.getAllRecipesPaginated(limit, page, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve recipes." });
    }
    res.json(data);
  });
};
module.exports = { fetchRecipes, getAllCategories, fetchAllRecipesPaginated };
