"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

/**
 * Validation for the starting and ending date of a school
 * The ending date needs to be after the starting date for the timeframe to be valid.
 *
 * @param {Date} endingDate
 * @return {boolean}
 * @private
 */
const validateTimeFrame = function (endingDate) {
	return this.startDate <= endingDate;
};

const SchoolSchema = new Schema({
	name: {
		type: String,
		default: "Unknown",
		unique: "School already exist",
		trim: true,
		required: "Name can not be empty"
	},
	startDate: {
		type: Date,
		required: "A school needs a starting date"
	},
	endDate: {
		type: Date,
		required: "A school needs an ending date",
		validate: [validateTimeFrame, "The ending date needs to be after the starting date"]
	},
	created: {
		type: Date,
		default: Date.now
	}
});


mongoose.model("school", SchoolSchema);
