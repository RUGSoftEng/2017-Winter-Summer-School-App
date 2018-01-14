const http = require("http");
const logger = require('./logger');

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function (options, callback) {
	// protocol to be used
	const prot = options.port === 443 ? https : http;
	let req  = prot.request(options, function (res) {
		let output = '';
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
			output += chunk;
		});

		res.on('end', function () {
			let obj = JSON.parse(output);
			callback(res.statusCode, obj);
		});
	});

	req.on('error', function (err) {
		logger.warning(err.message);
	});

	req.end();

};
