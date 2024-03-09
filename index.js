const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 6001;
const products = require("./data/products");

// const asyncMySQL = require("./mysql/connection");
// const sqlQueries = require("./mysql/queriesUser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
// 	res.send("Hello there");
// });

// app.use((req, res, next) => {
// 	req.asyncMySQL = asyncMySQL;
// 	next();
// });

app.get("/", (req, res) => {
	res.send("Server is running");
});

// app.get("/api/products", (req, res) => {
// 	res.json(products);
// });

// app.get("/api/products/:id", (req, res) => {
// 	const product = products.find((p) => p._id === req.params.id);
// 	res.json(product);
// });

app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

// app.listen(PORT, () => {
// 	console.log(`server started on port ${PORT}`);
// });
