const db = require("../mysql/connection.js");

async function calculateTotalPrice(items) {
	let total = 0;
	for (const item of items) {
		const [productData] = await db.query(
			"SELECT price FROM products WHERE id = ?",
			[item.id]
		);
		// console.log(productData[0]); // Check what is returned from the query
		if (productData.length === 0) {
			throw new Error(`Product not found for ID: ${item.id}`);
		}
		// const price = parseFloat(productData[0].price);
		// if (isNaN(price)) {
		// 	throw new Error(`Invalid price for product ID: ${item.id}`);
		// }

		total += Number(productData[0].price) * item.qty;

		console.log(
			`Price: ${productData[0].price}, Type: ${typeof Number(
				productData[0].price
			)}`
		);
		console.log(`Quantity: ${item.qty}, Type: ${typeof item.qty}`);
	}

	console.log(total, typeof total);

	return total.toFixed(2);
}

module.exports = { calculateTotalPrice };
