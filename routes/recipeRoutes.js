const express = require("express");
const router = express.Router();
const {
  fetchRecipes,
  fetchAllRecipesPaginated,
  getAllCategories,
} = require("../controllers/recipeController");
const {
  getAllNutritionData,
  getNutritionByRecipeId,
  getNutritionPaginated,
} = require("../controllers/nutritionController");

// routes
router.get("/recipes", fetchRecipes);
router.get("/categories", getAllCategories);

// route for paginated recipes
router.get("/recipes/paginated", fetchAllRecipesPaginated);

// Route to fetch all nutritional data
router.get("/nutrition", getAllNutritionData);

// Route to fetch nutrition by recipe ID
router.get("/nutrition/recipe/:rec_id", getNutritionByRecipeId);

// Route to fetch paginated nutrition data
router.get("/nutrition/paginated", getNutritionPaginated);

module.exports = router;
