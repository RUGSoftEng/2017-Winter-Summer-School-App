"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
	title: {
		type: String,
		required: "Announcements require a title",
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		required: "Announcements require a description",
		trim: true
	},
	poster: {
		type: String,
		trim: true
	},
	school: {
		type: Schema.ObjectId,
		required: "An announcement needs to be associated with some school."
	}
});

mongoose.model("announcement", AnnouncementSchema);
