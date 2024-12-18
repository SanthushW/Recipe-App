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

const createRecipe = (req, res) => {
  // Validate input
  const { 
    title, 
    description, 
    servings, 
    prepTimeHours, 
    prepTimeMinutes, 
    cookTimeHours, 
    cookTimeMinutes,
    ingredients,
    instructions,
    cooksTips,
    categories
  } = req.body;

  // Validate required fields
  if (!title || !description || !servings || !ingredients || !instructions) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Prepare recipe data
  const recipeData = {
    title,
    description,
    servings: Number(servings),
    prepTime: {
      hours: Number(prepTimeHours || 0),
      minutes: Number(prepTimeMinutes || 0)
    },
    cookTime: {
      hours: Number(cookTimeHours || 0),
      minutes: Number(cookTimeMinutes || 0)
    },
    ingredients: JSON.parse(ingredients),
    instructions: JSON.parse(instructions),
    cooksTips: cooksTips || null,
    categories: categories ? JSON.parse(categories) : null
  };

  // Handle image upload
  if (req.file) {
    const uploadDir = path.join(__dirname, '../uploads/recipes');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `recipe_${Date.now()}${path.extname(req.file.originalname)}`;
    const newPath = path.join(uploadDir, filename);

    // Move file
    fs.renameSync(req.file.path, newPath);

    // Set image URL (adjust based on your server setup)
    recipeData.imageUrl = `/uploads/recipes/${filename}`;
  }

  // Create recipe
  RecipeModel.createRecipe(recipeData, (err, result) => {
    if (err) {
      console.error('Recipe creation error:', err);
      return res.status(500).json({ 
        error: "Failed to create recipe", 
        details: err.message 
      });
    }

    res.status(201).json({
      message: "Recipe created successfully",
      recipe: result
    });
  });
};

module.exports = { fetchRecipes, getAllCategories, fetchAllRecipesPaginated };
