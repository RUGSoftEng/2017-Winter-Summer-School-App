app.controller('RootController', ['$scope', '$http', function ($scope, $http) {
	$scope.username = userProfile.username;
	$scope.role = userProfile.rank;
	$scope.schoolid = userProfile.school;
	$scope.status = {
		name: 'Error',
		message: '',
		className: 'danger'
	};

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

	$scope.ID = function () {
		return '_' + Math.random().toString(36).substr(2, 9);
	};

	$scope.setStatus = function (msg, name) {
		$scope.status.name = name;
		$scope.status.message = msg;
		$scope.status.className = name === 'Error' ? 'danger' : 'success';
	};

	$scope.successStatus = function (msg) {
		$scope.setStatus(msg, 'Success');
	};

	$scope.failureStatus = function (msg) {
		$scope.setStatus(msg, 'Error');
	};

	$scope.openModal = function($event) {
		openModal($event.currentTarget);
	};


}]);
