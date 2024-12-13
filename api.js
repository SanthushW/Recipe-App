const axios = require("axios");

// Get the API key from environment variables
require("dotenv").config();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Define the base URL for Spoonacular API
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

/**
 * Fetch recipes by ingredients.
 * @param {string} ingredients - Comma-separated list of ingredients.
 * @param {number} number - The number of recipes to return (default: 10).
 * @param {number} ranking - Ranking preference (1: maximize ingredients used, 2: minimize missing ingredients).
 * @param {boolean} ignorePantry - Whether to ignore typical pantry items (default: true).
 * @returns {Promise<object[]>} - List of recipes.
 */
async function fetchRecipesByIngredients(ingredients, number = 10, ranking = 1, ignorePantry = true) {
    try {
        // Prepare query parameters
        const params = {
            apiKey: SPOONACULAR_API_KEY,
            ingredients: ingredients,
            number: number,
            ranking: ranking,
            ignorePantry: ignorePantry,
        };

        // Make the API call
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, { params });

        // Return the recipes or an empty array if no recipes found
        return response.data || [];
    } catch (error) {
        console.error("Error fetching recipes from Spoonacular:", error.message);
        throw new Error("Failed to fetch recipes. Please try again later.");
    }
}

module.exports = { fetchRecipesByIngredients };
