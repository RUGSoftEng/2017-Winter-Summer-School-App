"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

/**
 * Validation for the starting and ending date of an event,
 * The ending date needs to be after the starting date for the timeframe to be valid.
 *
 * @param {Date} endingDate
 * @return {boolean}
 * @private
 */
const validateTimeFrame = function (endingDate) {
	return this.startDate <= endingDate;
};

const EventSchema = new Schema({
	title: {
		type: String,
		required: "Events require a title",
		trim: true
	},
	location: {
		type: String,
		required: "Events require a location",
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	startDate: {
		type: Date,
		required: "An event needs a starting date"
	},
	endDate: {
		type: Date,
		required: "An event needs an ending date",
		validate: [validateTimeFrame, "The ending date needs to be after the starting date"]
	},
	details: {
		type: String,
		required: "Events require details",
		trim: true
	},
	school: {
		type: Schema.ObjectId,
		required: "An event needs to be associated with some school"
	}
});

mongoose.model("event", EventSchema);
