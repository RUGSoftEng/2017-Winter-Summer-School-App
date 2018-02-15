"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;


const TokenSchema = new Schema({
	token: {
		type: String,
		required: "The token identifier is required.",
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model("token", TokenSchema);
