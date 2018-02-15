var app = angular.module('Overview', ['ui.bootstrap', 'ngMaterial', 'angularMoment', 'ngSanitize'])
		.filter('startFrom',function (){
			return function(data,start){
				return data.slice(start);
			}
		});
