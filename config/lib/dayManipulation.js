const json = require('./getJSON.js');
const config = require('./../config');

exports.getWeekEvents = function (week, callback) {
	json.getJSON({
		type: 'GET',
		path: '/calendar/event?week=' + week + '&extended=true',
		host: config.host,
		port: config.port,
		async: false,
		dataType: 'json'
	}, function (statusCode, data) {
		let result = null;
		if (data && !data.error) {
			result = JSON.parse(data.data);
		}
		callback(result);
	});
};
