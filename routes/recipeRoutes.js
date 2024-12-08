const express = require("express");
const router = express.Router();
const {
  fetchRecipes,
  fetchAllRecipesPaginated,
  getAllCategories,
} = require("../controllers/recipeController");

// routes
router.get("/recipes", fetchRecipes);
router.get("/categories", getAllCategories);

// route for paginated recipes
router.get("/recipes/paginated", fetchAllRecipesPaginated);

module.exports = router;
