"use strict";

const express = require("express");
const requireDir = require("require-dir");
const controllerLocation = process.cwd() + "/controllers";
const logger = require("./logger");

/*
 The following function adds every file in the directory controllerLocation
 and all its subdirectories as a controller. It excludes any file with
 the name '404', and instead adds the 404 file located in the controllerLocation,
 after all other controllers.
 */
module.exports = function (app) {
	const module = {};

	module.addControllers = function () {
		const isDirectory = function (file) {
			return (typeof file !== "function");
		};

		const recursiveAdd = function (dir) {
			const controllers = requireDir(dir, { recurse: true });
			for (const i in controllers) {
				if (i !== "404") {
					if (isDirectory(controllers[i]))
						recursiveAdd(dir + "/" + i);
					else
						app.use("/", controllers[i]);
				}
			}
		};
		recursiveAdd(controllerLocation);
		app.use(express.static("views/images/"));
		app.use("/public", express.static("public"));
		app.use("/directives", express.static("public/dist/js/directives/html"));
		app.use("/partials", express.static("views/partials"));

		app.use("/*", require(controllerLocation + "/404"));
		app.use(function (err, req, res, next) {
			if (err.status === 403) {
				res.render("403.ejs", { user: req.user });
			} else {
				next(err);
			}
		});

		app.use(function (err, req, res, next) {
			logger.error(err.stack);
			logger.debug(next);
			res.render("error.ejs", { user: {} });
		});
	};

	return module;
};
