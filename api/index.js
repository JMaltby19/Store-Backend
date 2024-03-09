const app = require("../server"); // Adjust the path as necessary to where your Express app is defined
const { createServer } = require("http");
const { parse } = require("url");

module.exports = (req, res) => {
	const server = createServer(app);
	const parsedUrl = parse(req.url, true);
	req.query = parsedUrl.query;
	server.listen();
	server.emit("request", req, res);
};
