const express = require("express");
const {
	createOrder,
	getOrders,
	getOrderDetails,
} = require("../controllers/ordersController");
const app = express.Router();
const db = require("../mysql/connection.js");
const sqlQueries = require("../mysql/queriesUser");

// Authentication Middleware
async function authenticate(req, res, next) {
	const { token } = req.headers;

	try {
		const [results] = await db.query(sqlQueries.selectIdFromToken(token));

		if (results.length === 0) {
			return res.status(401).json({ status: 0, error: "Wrong token!" });
		}

		req.user_id = results[0].user_id;
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(500).json({ status: 0, error: "Internal Server Error" });
	}
}

app.post("/", createOrder);
app.get("/orders", authenticate, getOrders);
app.get("/order-details/:id", authenticate, getOrderDetails);

// app.post("/login", loginUser);
// app.get("/me", authenticate, getUser);
// app.delete("/logout", authenticate, logoutUser);

module.exports = app;
