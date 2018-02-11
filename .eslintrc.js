"use strict";

module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"strict": [2, "global"],
		"global-strict": [0, "always"],
		"prefer-const": "error",
		"no-var": "error",
		"no-const-assign": "error",
		"camelcase": "error",
		"space-before-function-paren": "error",
		"object-curly-newline": "error",
		"brace-style": "error",
		"comma-dangle": "error",
		"comma-spacing": ["error", {before: false, after: true}],
		"no-multi-spaces": "error",
		"no-unreachable": "error",
		"no-unused-expressions": "error",
		"space-infix-ops": "error",
		"keyword-spacing": "error",
		"key-spacing": "error",
		"space-unary-ops": "error",
		"max-len": ["error", 150], 			// max line width.
		"max-lines": ["error", 250],	// max lines per file.
		"spaced-comment": "error"
	}
};
