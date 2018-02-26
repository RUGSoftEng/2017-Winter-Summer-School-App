app.controller('RootController', ['$scope', function ($scope) {
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

	$scope.changeContent = function ($event) {
		var poster      = $($event.target).data('poster');
		var title       = $($event.target).data('title');
		var description       = $($event.target).data('description');
		$('#changingTitle').html(title);
		$('#changingPoster').html("Posted by:" + poster);
		$('#changingDescription').html(description);
		$('#innerContent > div').hide();
		$($($event.target).data('selector')).show();
		$('#editSection').data('title', title);
		$('#editSection').data('id', $($event.target).data('id'));
		$('#editSection').data('description', description);
		$('#editSection').data('category', $($event.target).data('category'));
		$('#editSection').show();
	};

}]);
