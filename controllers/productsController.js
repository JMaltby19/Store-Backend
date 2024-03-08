// app.js
const express = require("express");
const db = require("../mysql/connection");
const sqlQueries = require("../mysql/queriesProducts");
const router = express();

const getProducts = router.get("/", async (req, res) => {
	try {
		const getProductsQuery = sqlQueries.selectAllProducts();
		const [products] = await db.query(getProductsQuery);
		res.json(products);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).send("Server error");
	}
});

const getProductDetails = router.get("/:id", async (req, res) => {
	try {
		console.log("Fetching product details for ID:", req.params.id); // Debugging log

		const getProductDetailsQuery = sqlQueries.selectProductDetails();
		const [productDetails] = await db.query(getProductDetailsQuery, [
			req.params.id,
		]);

		console.log(productDetails);

		if (!productDetails || productDetails.length === 0) {
			return res.status(404).send("Product not found");
		}

		res.json(productDetails[0]); // Assuming the first element is the product details
	} catch (error) {
		console.error("Error fetching product details:", error);
		res.status(500).send("Server error");
	}
});

module.exports = { getProducts, getProductDetails };
