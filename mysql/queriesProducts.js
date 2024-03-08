module.exports = {
	selectAllProducts: function () {
		return `SELECT *
                    FROM products
                          WHERE 1;`;
	},

	selectProductDetails: function () {
		return `SELECT * 
                    FROM products 
                            WHERE id = ?`;
	},
};
