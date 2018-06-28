const app = angular.module("Overview", ["ui.bootstrap", "ngMaterial", "angularMoment", "ngSanitize"])
	.filter("startFrom", function (){
		return function (data, start){
			if (data) return data.slice(start);
		};
	});

