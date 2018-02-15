"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	Validator = require("validator");

/**
 * Validates if the url is either not set, or is a valid url.
 *
 * @param url
 * @returns {boolean}
 */
const validateUrl = function (url) {
	return !url || Validator.isURL(url);
};

const LecturerSchema = new Schema(
	{
		name: {
			type: String,
			required: "Lecturers require a name.",
			trim: true
		},
		created: {
			type: Date,
			default: Date.now
		},
		description: {
			type: String,
			required: "Lecturers require a description.",
			trim: true
		},
		website: {
			type: String,
			trim: true,
			validate: [validateUrl, "The given URL does not seem to be valid."]
		},
		imagepath: { type: String }
	});

mongoose.model("lecturer", LecturerSchema);
