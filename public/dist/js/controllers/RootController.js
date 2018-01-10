app.controller('RootController', ['$scope', function ($scope) {
	$scope.username = userProfile.username;
	$scope.role = userProfile.rank;
	$scope.school = userProfile.school;

	$scope.isAuthorised = function (name) {
		return exports.userHasRights({ rank: $scope.role }, name);
	};

	$scope.httpDelete = function ($event) {
		return httpRequest('delete', $event);
	};

	$scope.httpPost = function ($event) {
		return httpRequest('post', $event);
	};

	$scope.httpPut = function ($event) {
		return httpRequest('put', $event);
	};

	$scope.httpGet = function ($event) {
		return httpRequest('get', $event);
	};


}]);