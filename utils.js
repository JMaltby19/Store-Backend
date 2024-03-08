const fs = require("fs");

module.exports = {
	getUniqueId: function () {
		let uniqueId = "";

		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		const charsLength = chars.length;

		for (let i = 0; i < 32; i++) {
			uniqueId += chars.charAt(Math.floor(Math.random() * charsLength));
		}

		return (uniqueId += Date.now());
	},

	addToLog: function (headers) {
		const str = `New request: ${new Date().toString()} ${JSON.stringify(
			headers
		)} 
			`;
		const fileName = new Date().getFullYear() + "_" + new Date().getMonth();
		fs.appendFile(fileName, str, () => {});
	},
};
