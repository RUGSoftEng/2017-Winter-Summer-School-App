app.controller('OverviewController', ['$scope', function($scope) {
	$scope.isNew = function(itemDate) {
		let date = new Date();
		date.setDate(date.getDate() - 1);
		return new Date(itemDate) >= date;
	};

	if(!$scope.schoolid) {
		window.location.href = "/options";
	}

}]);
