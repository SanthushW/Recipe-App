const request = require('supertest');
const express = require('express');
const nutritionRoutes = require('../routes/recipeRoutes');
const NutritionModel = require('../models/nutritionsModel');

// Mock database methods
jest.mock('../models/nutritionsModel');

// Set up an express app with the nutrition routes
const app = express();
app.use(express.json());
app.use(nutritionRoutes);

describe('Nutrition Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('GET /nutrition', () => {
    it('should fetch all nutrition data successfully', async () => {
      const mockData = [{ id: 1, name: 'Test Data', calories: 100 }];
      NutritionModel.getAllNutrition.mockImplementation((callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get('/nutrition');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockData);
    });

    it('should return 500 on database error', async () => {
      NutritionModel.getAllNutrition.mockImplementation((callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/nutrition');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /nutrition/recipe/:rec_id', () => {
    it('should fetch nutrition data by recipe ID', async () => {
      const rec_id = 1;
      const mockData = [{ id: 1, rec_id: rec_id, name: 'Sample Nutrition' }];
      NutritionModel.getNutritionByRecipeId.mockImplementation((rec_id, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get(`/nutrition/recipe/${rec_id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockData);
    });

    it('should return 500 on database error', async () => {
      NutritionModel.getNutritionByRecipeId.mockImplementation((rec_id, callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/nutrition/recipe/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /nutrition/paginated', () => {
    it('should fetch paginated nutrition data', async () => {
      const mockData = {
        data: [{ id: 1, name: 'Sample Nutrition' }],
        pagination: { total: 1, totalPages: 1, currentPage: 1, perPage: 10 },
      };
      NutritionModel.getAllNutritionPaginated.mockImplementation((limit, page, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get('/nutrition/paginated?limit=10&page=1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockData.data);
      expect(response.body.pagination).toEqual(mockData.pagination);
    });

    it('should return 500 on database error', async () => {
      NutritionModel.getAllNutritionPaginated.mockImplementation((limit, page, callback) =>
        callback(new Error('Database error'), null)
      );

      const response = await request(app).get('/nutrition/paginated?limit=10&page=1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });
});
