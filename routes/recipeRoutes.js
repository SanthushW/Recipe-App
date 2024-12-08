const express = require('express');
const router = express.Router();
const { fetchRecipes, getAllCategories } = require('../controllers/recipeController');

router.get('/recipes', fetchRecipes);
router.get('/categories', getAllCategories);

module.exports = router;