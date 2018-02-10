"use strict";

/**
 * Sets the date of req.body such that it incorporates the correct hour as well.
 *
 * @param {Object} obj - Either request or response
 * @param {"start"|"end"} property
 * @public
 */
exports.mergeDateAndTime = function (obj, property) {
	let date = new Date(obj[property + "Date"]);
	date.setHours(obj[property + "Hour"]);
	date.setMinutes(obj[property + "Minute"]);
	obj[property + "Date"] = new Date(date);
};

/**
 * Creates and returns a Date object with the date being the last saturday.
 * If it is Saturday, the last Saturday was this Saturday.
 *
 * @return {Date}
 * @private
 */
const getLastSaturday = function () {
	const d = new Date();
	const t = d.getDate() - (d.getDay() + 1);
	d.setDate(t);
	return d;
};

/**
 * Returns the number of elapsed milliseconds since the start of that day.
 *
 * @param {Date} date
 * @returns {number}
 * @private
 */
const getDayInMs = function (date) {
	date.setHours(0, 0, 0, 0);
	return date.getTime();
};

/**
 * Sets a specific interval in which we want to retrieve events. Useful for GET requests,
 * when we want to specify a parameter 'week', or 'day'.
 * This function sets the startDate to be equal to an interval corresponding to either the day
 * or the week.
 *
 * @param query
 * @param param
 * @param day
 * @returns {boolean}
 * @public
 */
exports.setInterval = function (query, param, day) {
	if (query[param]) {
		const oneDay = (1000 * 60 * 60 * 24);
		const dayOffset = query[param] * oneDay * day;
		const firstDay = param === "week" ? getLastSaturday() : new Date();
		const intervalStart = new Date(getDayInMs(firstDay) + dayOffset);
		const intervalEnd = new Date(getDayInMs(firstDay) +
			(oneDay * (day === 1 ? 1 : 8) + dayOffset));
		query.startDate = { "$gte": intervalStart, "$lt": intervalEnd };
		delete query[param];
		return true;
	}
	return false;
};

