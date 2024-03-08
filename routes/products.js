const express = require("express");
const app = express.Router();
const {
	getProducts,
	getProductDetails,
} = require("../controllers/productsController");

app.get("/", getProducts);
app.get("/:id", getProductDetails);

// app.post("/login", loginUser);
// app.get("/me", authenticate, getUser);
// app.delete("/logout", authenticate, logoutUser);

module.exports = app;
