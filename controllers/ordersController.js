const express = require("express");
const db = require("../mysql/connection");
const sqlQueries = require("../mysql/queriesOrder");
const router = express();
const { calculateTotalPrice } = require("../services/calculatetotalPrice.js");

const createOrder = router.post("/", async (req, res) => {
	const {
		total_price: clientTotalPrice,
		address_line,
		first_name,
		last_name,
		city,
		postcode,
		items,
		user_id,
	} = req.body; // 'items' are the order details

	let connection;

	console.log(items);

	try {
		connection = await db.getConnection();
		await connection.beginTransaction();

		const serverCalculatedTotal = await calculateTotalPrice(items);

		// console.log(serverCalculatedTotal, typeof clientTotalPrice);
		// console.log(calculateTotalPrice, typeof clientTotalPrice);

		if (serverCalculatedTotal !== clientTotalPrice) {
			return res.status(400).json({ message: "Price mismatch error" });
		}

		// Insert into shipping_address
		const insertAddressQuery = sqlQueries.insertShippingAddress();
		const [addressResult] = await connection.query(insertAddressQuery, [
			address_line,
			first_name,
			last_name,
			city,
			postcode,
		]);
		const addressId = addressResult.insertId;

		// Insert into orders
		const createOrderQuery = sqlQueries.createOrder();

		const [orderResult] = await connection.query(createOrderQuery, [
			user_id,
			addressId,
			serverCalculatedTotal,
		]);
		const orderId = orderResult.insertId;

		console.log(orderResult);

		// Insert each item into order_details
		const insertOrderDetailsQuery = sqlQueries.insertOrderDetails();
		const orderDetailsData = items.map((item) => [orderId, item.id, item.qty]);

		console.log(orderDetailsData);

		await connection.query(insertOrderDetailsQuery, [orderDetailsData]);

		await connection.commit();
		res.status(201).json({
			success: true,
			message: "Order and order details created successfully",
			orderTotal: serverCalculatedTotal,
			payload: orderDetailsData[0],
		});
	} catch (error) {
		// catch (error) {
		// 	if (connection) await connection.rollback();
		// 	res.status(500).json({
		// 		success: false,
		// 		message: "Error processing order",
		// 		error: error,
		// 	});
		if (connection) await connection.rollback();
		console.error("Error in createOrder:", error);
		res.status(500).json({
			success: false,
			message: "Error processing order",
			error: error.message,
		});
	} finally {
		if (connection) await connection.release();
	}
});

// const getOrders = router.get("/orderDetails", async (req, res) => {
// 	try {
// 		// Use the user_id set by the authenticate middleware
// 		const ordersQuery = sqlQueries.getOrders(); // Assuming getOrders accepts user_id as a parameter
// 		const [orders] = await db.query(ordersQuery, [req.user_id]);
// 		res.json(orders);
// 	} catch (error) {
// 		console.error("Error fetching orders:", error);
// 		res.status(500).send("Server error");
// 	}
// });

const getOrders = router.get("/orders", async (req, res) => {
	try {
		const ordersQuery = sqlQueries.getOrders(); // The revised SQL query
		const [ordersData] = await db.query(ordersQuery, [req.user_id]);

		const orders = {};

		for (const data of ordersData) {
			if (!orders[data.order_id]) {
				orders[data.order_id] = {
					orderId: data.order_id,
					orderDate: data.order_date,
					totalPrice: data.total_price,
					paymentStatus: data.payment_status,
					products: [],
				};
			}

			orders[data.order_id].products.push({
				productId: data.product_id,
				quantity: data.item_quantity,
				name: data.product_name,
				category: data.category,
				imageUrl: data.image_url,
				price: data.product_price,
			});
		}

		res.json(Object.values(orders));
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).send("Server error");
	}
});

const getOrderDetails = router.get("/order-details/:id", async (req, res) => {
	const userId = req.user_id; // Set by your authentication middleware
	const orderId = req.params.id;

	try {
		const orderDetailsQuery = sqlQueries.getOrderDetails();
		const [data] = await db.query(orderDetailsQuery, [userId, orderId]);

		if (data.length === 0) {
			return res.status(404).json({ message: "Order not found" });
		}

		// Initialize an empty object for order details
		let orderDetails = {};

		// Process the query result using for...of loop
		for (const row of data) {
			// Check if the order detail is already in the orderDetails object
			if (!orderDetails[row.order_id]) {
				orderDetails[row.order_id] = {
					orderId: row.order_id,
					orderDate: row.order_date,
					totalPrice: row.total_price,
					paymentStatus: row.payment_status,
					shippingAddress: {
						addressLine: row.address_line,
						firstName: row.first_name,
						lastName: row.last_name,
						city: row.city,
						postcode: row.postcode,
					},
					products: [],
				};
			}

			// Add the product to the order's product array
			orderDetails[row.order_id].products.push({
				productId: row.product_id,
				quantity: row.item_quantity,
				name: row.product_name,
				category: row.category,
				imageUrl: row.image_url,
				price: row.product_price,
				totalProductPrice: row.total_product_price,
			});
		}

		// Send the formatted order details as an object
		res.json(orderDetails[orderId]);
	} catch (error) {
		console.error("Error fetching order details:", error);
		res.status(500).send("Server error");
	}
});

// const getOrderDetails = router.get("/order-details/:id", async (req, res) => {
// 	const userId = req.user_id; // Set by your authentication middleware
// 	const orderId = req.params.id;

// 	try {
// 		const orderDetailsQuery = sqlQueries.getOrderDetails();
// 		const [rows] = await db.query(orderDetailsQuery, [userId, orderId]);

// 		if (rows.length === 0) {
// 			return res.status(404).json({ message: "Order not found" });
// 		}

// 		// Process the query result to group products by order
// 		const orderDetails = rows.reduce((acc, row) => {
// 			// Check if the order is already in the accumulator
// 			if (!acc[row.order_id]) {
// 				acc[row.order_id] = {
// 					orderId: row.order_id,
// 					orderDate: row.order_date,
// 					totalPrice: row.total_price,
// 					paymentStatus: row.payment_status,
// 					shippingAddress: {
// 						addressLine: row.address_line,
// 						firstName: row.first_name,
// 						lastName: row.last_name,
// 						city: row.city,
// 						postcode: row.postcode,
// 					},
// 					products: [],
// 				};
// 			}

// 			// Add the product to the order's product array
// 			acc[row.order_id].products.push({
// 				productId: row.product_id,
// 				quantity: row.item_quantity,
// 				name: row.product_name,
// 				category: row.category,
// 				imageUrl: row.image_url,
// 				price: row.product_price,
// 				totalProductPrice: row.total_product_price,
// 			});

// 			return acc;
// 		}, {});

// 		// Send the formatted order details as an object
// 		res.json(orderDetails[orderId]);
// 	} catch (error) {
// 		console.error("Error fetching order details:", error);
// 		res.status(500).send("Server error");
// 	}
// });

module.exports = { createOrder, getOrders, getOrderDetails };
