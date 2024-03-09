const express = require("express");
const router = express.Router();
const sqlQueries = require("../mysql/queriesUser");
const sha256 = require("sha256");
const bcrypt = require("bcryptjs");
const db = require("../mysql/connection.js");
const utils = require("../utils.js");
const { generateAndStoreToken } = require("../services/tokenService.js");

const registerUser = router.post("/", async (req, res) => {
	const { email, user_name, password } = req.body;
	let connection; // Declare connection here to access it in catch block

	try {
		const userCountQuery = sqlQueries.selectUserCount();
		const [userCountResult] = await db.query(userCountQuery, [email]);

		const { count } = userCountResult[0];

		// if there is a count, then the email already exists
		if (count) {
			return res.send({
				status: 0,
				error: "Sorry, that email already exists!",
			});
		}

		connection = await db.getConnection();
		await connection.beginTransaction();

		const insertUserQuery = sqlQueries.insertUser();
		const [userResult] = await connection.execute(insertUserQuery, [
			email,
			user_name,
		]);

		// const hashedPassword =  sha256(process.env.PASSWORD_SALT + password);
		const hashedPassword = await bcrypt.hash(password, 10);
		const insertPasswordQuery = sqlQueries.insertUserPassword();
		await connection.execute(insertPasswordQuery, [
			userResult.insertId,
			hashedPassword,
		]);
		// Assuming userResult.insertId is the ID of the newly created user
		const userToken = await generateAndStoreToken(userResult.insertId, db);

		await connection.commit();
		connection.release();
		res.send({ status: 1, userToken, payload: { user_name, email } });
	} catch (error) {
		console.error(error);
		if (connection) {
			await connection.rollback();
			connection.release();
		}
		res.status(500).send("Internal Server Error");
	}
});

const loginUser = router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const [users] = await db.query(sqlQueries.selectUserByEmail(), [email]);

		if (users.length === 0) {
			return res.status(400).json({ message: "Incorrect login details" });
		}

		const user = users[0];

		const isMatch = await bcrypt.compare(password, user.hashed_password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect login details" });
		}

		const userToken = await generateAndStoreToken(user.id, db);

		// Retrieving the user profile
		const [loginProfile] = await db.query(sqlQueries.selectUserProfile(), [
			user.id,
		]);
		res.send({ status: 1, userToken, payload: loginProfile[0] });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

const logoutUser = router.delete("/logout", async (req, res) => {
	try {
		await db.execute(sqlQueries.deleteAllTokens(), [req.user_id]);
		res.send({ status: 1 });
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).send({ status: 0, error: "Internal Server Error" });
	}
});

const getUser = router.get("/me", async (req, res) => {
	try {
		const [result] = await db.query(sqlQueries.selectUserProfile(), [
			req.user_id,
		]);

		if (result.length) {
			res.send({ status: 1, payload: result });
		} else {
			res.send({ status: 0, error: "User does not exist" });
		}
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).send({ status: 0, error: "Internal Server Error" });
	}
});

module.exports = { registerUser, loginUser, logoutUser, getUser };
