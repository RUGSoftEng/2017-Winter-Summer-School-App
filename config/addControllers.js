var requireDir = require('require-dir');
var controllerLocation = './../controllers';


module.exports = function(app) {
	var module = {};
	
	module.addControllers = function() {
		recursiveAdd = function(dir) {
			var controllers = requireDir(dir, {recurse: true}); 
			for (var i in controllers) {
				if(i != '404') {
					if(typeof controllers[i] !== 'function') 
						recursiveAdd(dir + '/' + i);
					else
						app.use('/', controllers[i]);
				}
			}
		}
		recursiveAdd(controllerLocation);
		app.use('/', require(controllerLocation + '/404'))
	};
	
	return module;
};