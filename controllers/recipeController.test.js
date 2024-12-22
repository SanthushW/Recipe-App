const { fetchRecipes } = require('./recipeController');
const RecipeModel = require('../models/recipeModel');

jest.mock('../models/recipeModel');

describe('fetchRecipes', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return recipes with default limit when limit is not provided', () => {
    req.query = {};

    const mockData = [{ id: 1, name: 'Recipe 1' }];
    RecipeModel.getRecipes.mockImplementation((limit, category, callback) => {
      callback(null, mockData);
    });

    fetchRecipes(req, res);

    expect(RecipeModel.getRecipes).toHaveBeenCalledWith(10, undefined, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return recipes with provided limit', () => {
    req.query = { limit: '5' };

    const mockData = [{ id: 1, name: 'Recipe 1' }];
    RecipeModel.getRecipes.mockImplementation((limit, category, callback) => {
      callback(null, mockData);
    });

    fetchRecipes(req, res);

    expect(RecipeModel.getRecipes).toHaveBeenCalledWith(5, undefined, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should handle errors from RecipeModel.getRecipes', () => {
    req.query = {};

    RecipeModel.getRecipes.mockImplementation((limit, category, callback) => {
      callback(new Error('Failed to retrieve recipes'), null);
    });

    fetchRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve recipes.' });
  });
});