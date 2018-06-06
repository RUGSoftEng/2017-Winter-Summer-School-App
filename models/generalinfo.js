"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const GeneralinfoSchema = new Schema({
	title: {
		type: String,
		required: "General information requires a title",
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		required: "General information requires a description",
		trim: true
	},
	category: {
		type: String,
		enum: require("../public/dist/js/categories").categories,
		required: "General information requires a category"
	},
	school: {
		type: Schema.Types.ObjectId,
		required: "General information requires a school or to be null"
	}
});

GeneralinfoSchema.pre("validate", function (next) {
	const generalinfo = this;
	if (!generalinfo.school) {
		generalinfo.school = require("mongoose").Types.ObjectId("000000000000000000000001");
	}

	next();
});
mongoose.model("generalinfo", GeneralinfoSchema);
