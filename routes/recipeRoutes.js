const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  fetchRecipes,
  fetchAllRecipesPaginated,
  getAllCategories,
  createRecipe
} = require("../controllers/recipeController");
const {
  getAllNutritionData,
  getNutritionByRecipeId,
  getNutritionPaginated,
} = require("../controllers/nutritionController");

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/temp/', // temporary storage
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// routes
router.get("/recipes", fetchRecipes);
router.get("/categories", getAllCategories);

// route for paginated recipes
router.get("/recipes/paginated", fetchAllRecipesPaginated);

router.post("/recipes", upload.single('image'), createRecipe);

// Route to fetch all nutritional data
router.get("/nutrition", getAllNutritionData);

// Route to fetch nutrition by recipe ID
router.get("/nutrition/recipe/:rec_id", getNutritionByRecipeId);

// Route to fetch paginated nutrition data
router.get("/nutrition/paginated", getNutritionPaginated);

module.exports = router;
