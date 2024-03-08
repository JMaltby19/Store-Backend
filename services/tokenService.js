const db = require("../mysql/connection.js");
const sqlQueries = require("../mysql/queriesUser.js");
const utils = require("../utils.js");

async function generateAndStoreToken(userId, db) {
	const token = utils.getUniqueId(64);
	await db.query(sqlQueries.insertNewtoken(), [userId, token]);
	return token;
}

module.exports = { generateAndStoreToken };
