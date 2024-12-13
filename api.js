const axios = require("axios");


require("dotenv").config();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;


const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

/**
 * Fetch recipes by ingredients.
 * @param {string} ingredients - Comma-separated list of ingredients.
 * @param {number} number - The number of recipes to return (default: 10).
 * @param {number} ranking - Ranking preference (1: maximize ingredients used, 2: minimize missing ingredients).
 * @param {boolean} ignorePantry - Whether to ignore typical pantry items (default: true).
 * @returns {Promise<object[]>} - List of recipes with names and other details.
 */
async function fetchRecipesByIngredients(ingredients, number = 10, ranking = 1, ignorePantry = true) {
    try {
        
        const params = {
            apiKey: SPOONACULAR_API_KEY,
            ingredients: ingredients,
            number: number,
            ranking: ranking,
            ignorePantry: ignorePantry,
        };

        
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, { params });

        
        const recipes = response.data.map(recipe => ({
            name: recipe.title,  
            image: recipe.image,  
            usedIngredients: recipe.usedIngredients.map(ingredient => ingredient.name), 
            missedIngredients: recipe.missedIngredients.map(ingredient => ingredient.name)  
        }));

    
        return recipes;
    } catch (error) {
        console.error("Error fetching recipes from Spoonacular:", error.message);
        throw new Error("Failed to fetch recipes. Please try again later.");
    }
}

/**
 * Fetch recipes by name.
 * @param {string} name - Recipe name to search for.
 * @param {number} number - The number of recipes to return (default: 10).
 * @returns {Promise<object[]>} - List of recipes matching the name.
 */
async function fetchRecipesByName(name, number = 10) {
    try {
        // Prepare query parameters
        const params = {
            apiKey: SPOONACULAR_API_KEY,
            query: name,
            number: number,
        };

        // Make the API call
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, { params });

        // Extract and return relevant data (recipe name, image, and ingredients used)
        const recipes = response.data.results.map(recipe => ({
            name: recipe.title,  // Recipe name
            image: recipe.image,  // Recipe image
            ingredients: recipe.ingredients || [], // Ingredients used
        }));

        // Return the recipes with names
        return recipes;
    } catch (error) {
        console.error("Error fetching recipes from Spoonacular:", error.message);
        throw new Error("Failed to fetch recipes. Please try again later.");
    }
}

module.exports = { fetchRecipesByIngredients, fetchRecipesByName };
