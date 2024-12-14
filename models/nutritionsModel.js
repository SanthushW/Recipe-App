const db = require("../config/database");

const Nutrition = {
  findAll: async (filter = {}) => {
    let query = "SELECT * FROM Nutrition";
    const params = [];
    if (filter.rec_id) {
      query += " WHERE rec_id LIKE ?";
      params.push(`%${filter.rec_id}%`);
    }
    const [rows] = await db.execute(query, params);
    return rows;
  },
};

module.exports = Nutrition;
