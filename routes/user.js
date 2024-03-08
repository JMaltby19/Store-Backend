const express = require("express");
const app = express.Router();
const {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
} = require("../controllers/userController");
const db = require("../mysql/connection.js");
const sqlQueries = require("../mysql/queriesUser");

// check that the token exists for that particular user
// async function authenticate(req, res, next) {
// 	const { token } = req.headers;

// 	const results = await asyncMySQL(sqlQueries.selectIdFromToken(token));

// 	if (results.length === 0) {
// 		res.send({ status: 0, error: "Wrong token!" });
// 	} else {
// 		req.user_id = results[0].user_id;
// 		next();
// 	}
// }
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

app.post("/", registerUser);
app.post("/login", loginUser);
app.get("/me", authenticate, getUser);
app.delete("/logout", authenticate, logoutUser);

module.exports = app;
