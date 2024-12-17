const NutritionModel = require("../models/nutritionsModel");

const getAllNutritionData = (req, res) => {
  NutritionModel.getAllNutrition((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

const getNutritionByRecipeId = (req, res) => {
  const { rec_id } = req.params;

  NutritionModel.getNutritionByRecipeId(rec_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

const getNutritionPaginated = (req, res) => {
  const { limit, page } = req.query;

  NutritionModel.getAllNutritionPaginated(
    parseInt(limit),
    parseInt(page),
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, ...results });
    }
  );
};

module.exports = {
  getAllNutritionData,
  getNutritionByRecipeId,
  getNutritionPaginated,
};
