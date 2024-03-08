const mysql = require("mysql2/promise");

const pool = mysql.createPool(
	// {
	// 	database: "store",
	// 	user: "root",
	// 	password: "root",
	// 	host: "localhost",
	// 	port: 8889,
	// }
  {
	database: process.env.MYSQLDATABASE,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASSWORD,
	host: process.env.MYSQLHOST,
	port: process.env.MYSQLPORT,
	}

	// async function asyncMySQL(query, params) {
	// 	const connection = await createConnection();

	// 	try {
	// 		const [results] = await connection.execute(query, params);
	// 		return results;
	// 	} catch (error) {
	// 		console.error("Error executing query:", error);
	// 		throw error;
	// 	} finally {
	// 		await connection.end(); // Close the connection when done
	// 	}
	// }
);

module.exports = pool;
