module.exports = {
	insertShippingAddress: function () {
		return `INSERT INTO shipping_address 
              (address_line, first_name, last_name, city, postcode) 
                VALUES (?, ?, ?, ?, ?);`;
	},

	createOrder: function () {
		return `INSERT INTO orders 
              (user_id, address_id, total_price) 
                 VALUES (?, ?, ?);`;
	},

	insertOrderDetails: function () {
		return `INSERT INTO order_details 
              (order_id, product_id, quantity) 
                VALUES ?;`;
	},

	// getOrders: function () {
	// 	return `SELECT * FROM orders
	//               JOIN users ON orders.user_id = users.id
	//                 WHERE user_id = ?;`;
	// },

	getOrders: function () {
		return `
    SELECT 
    orders.order_id as order_id,
    orders.order_date,
    orders.total_price,
    orders.payment_status,
    order_details.product_id,
    order_details.quantity as item_quantity,
    products.name as product_name,
    products.category,
    products.image_url,
    products.price as product_price
FROM 
    orders 
JOIN 
    order_details ON orders.order_id = order_details.order_id
JOIN 
    products ON order_details.product_id = products.id
WHERE 
    orders.user_id = ?;



    `;
	},

	getOrderDetails: function () {
		return `
    SELECT 
        orders.order_id as order_id,
        orders.order_date,
        orders.total_price,
        orders.payment_status,
        orders.address_id,
        order_details.product_id,
        order_details.quantity as item_quantity,
        products.name as product_name,
        products.category,
        products.image_url,
        products.price as product_price,
        products.price * order_details.quantity as total_product_price,
        shipping_address.address_line,
        shipping_address.first_name,
        shipping_address.last_name,
        shipping_address.city,
        shipping_address.postcode
    FROM 
        orders 
    JOIN 
        order_details ON orders.order_id = order_details.order_id
    JOIN 
        products ON order_details.product_id = products.id
    JOIN
        shipping_address ON orders.address_id = shipping_address.address_id
    WHERE 
        orders.user_id = ? AND orders.order_id = ?;
    `;
	},

	// 	getOrderDetails: function () {
	// 		return `
	//     SELECT
	//     orders.order_id as order_id,
	//     orders.order_date,
	//     orders.total_price,
	//     orders.payment_status,
	//     orders.address_id,
	//     order_details.product_id,
	//     order_details.quantity as item_quantity,
	//     products.name as product_name,
	//     products.category,
	//     products.image_url,
	//     products.price as product_price,
	//     shipping_address.address_line,
	//     shipping_address.first_name,
	//     shipping_address.last_name,
	//     shipping_address.city,
	//     shipping_address.postcode
	// FROM
	//     orders
	// JOIN
	//     order_details ON orders.order_id = order_details.order_id
	// JOIN
	//     products ON order_details.product_id = products.id
	// JOIN
	//     shipping_address ON orders.address_id = shipping_address.address_id
	// WHERE
	//     orders.user_id = ? AND orders.order_id = ?;
	//     `;
	// 	},
};
