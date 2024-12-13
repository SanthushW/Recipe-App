const express = require("express");
const { fetchRecipesByIngredients, fetchRecipesByName } = require("../api");

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
        // Fetch recipes based on ingredients
        const recipes = await fetchRecipesByIngredients(ingredients, number, ranking, ignorePantry);

        // Check if recipes are returned
        if (recipes.length === 0) {
            return res.status(404).json({
                message: "No recipes found with the given ingredients.",
            });
        }

        // Return the list of recipes with names and other details
        res.json({
            message: "Recipes fetched successfully",
            recipes: recipes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch recipes. Please try again later.",
        });
    }
});

/**
 * Route to search recipes by name.
 * URL: /api/recipes/findByName
 */
router.get("/findByName", async (req, res) => {
    const { name, number } = req.query;

    // Check if name is provided
    if (!name) {
        return res.status(400).json({
            message: "Please provide a recipe name.",
        });
    }

    try {
        // Fetch recipes based on name
        const recipes = await fetchRecipesByName(name, number);

        // Check if recipes are returned
        if (recipes.length === 0) {
            return res.status(404).json({
                message: "No recipes found with the given name.",
            });
        }

        // Return the list of recipes with names and other details
        res.json({
            message: "Recipes fetched successfully",
            recipes: recipes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch recipes. Please try again later.",
        });
    }
});

module.exports = router;
