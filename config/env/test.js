"use strict";

module.exports = {
	db : {
		host: process.env.DB_HOST || "localhost",
		name: process.env.DB_NAME || "summer-schools-test"
	}
};
