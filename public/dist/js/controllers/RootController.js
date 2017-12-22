app.controller('RootController', ['$scope', function ($scope) {
	$scope.username = userProfile.name;
	$scope.role = userProfile.rank;
	$scope.school = userProfile.school;

	$scope.isAuthorised = function (name) {
		return exports.userHasRights({rank: $scope.role}, name);
	}

	if(!$scope.school) {
		window.location.href = "/options";
	}
}]);