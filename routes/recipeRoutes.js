const express = require("express");
const { fetchRecipesByIngredients } = require("../api");

const router = express.Router();

/**
 * Route to search recipes by ingredients.
 * URL: /api/recipes/findByIngredients
 */
router.get("/findByIngredients", async (req, res) => {
    const { ingredients, number, ranking, ignorePantry } = req.query;

    // Check if ingredients are provided
    if (!ingredients) {
        return res.status(400).json({
            message: "Please provide a list of ingredients.",
        });
    }

    try {
        const recipes = await fetchRecipesByIngredients(ingredients, number, ranking, ignorePantry);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch recipes. Please try again later.",
        });
    }
});

module.exports = router;
