"use strict";

const port = process.env.PORT || 8800;
const host = process.env.HOST || "localhost";
const dir = process.cwd();

module.exports = {
	port: port,
	host: host,
	domain: process.env.DOMAIN || ("http://" + host + ":" + port),
	sessionSecret: process.env.SESSION_SECRET || "default_secret",
	application: require(dir + "/package.json"),
	dir: dir,
	slack: {}
};
