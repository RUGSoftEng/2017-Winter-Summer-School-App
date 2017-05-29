var express = require('express');
var requireDir = require('require-dir');
var controllerLocation = './../controllers';

/*

 The following function adds every file in the directory controllerLocation
 and all its subdirectories as a controller. It excludes any file with
 the name '404', and instead adds the 404 file located in the controllerLocation,
 after all other controllers.
 */
module.exports = function (app) {
    var module = {};

    module.addControllers = function () {
        isDirectory = function (file) {
            return (typeof file !== 'function');
        }

        recursiveAdd = function (dir) {
            var controllers = requireDir(dir, {recurse: true});
            for (var i in controllers) {
                if (i != '404') {
                    if (isDirectory(controllers[i]))
                        recursiveAdd(dir + '/' + i);
                    else
                        app.use('/', controllers[i]);
                }
            }
        }
        recursiveAdd(controllerLocation);
        app.use(express.static('views/partials/js/jquery-ui-1.12.1.custom/'))
        app.use('/', require(controllerLocation + '/404'))
    };

    return module;
};