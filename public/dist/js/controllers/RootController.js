app.controller("RootController", ["$scope", function ($scope) {
	$scope.username = userProfile.username;
	$scope.role = userProfile.rank;
	$scope.schoolid = userProfile.school;

	$scope.alerts = [
	];

	$scope.addAlert = function (type, msg) {
		$scope.alerts.push({ type: type, msg: msg });
	};

	$scope.closeAlert = function (index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.isAuthorised = function (name) {
		return exports.userHasRights({ rank: $scope.role }, name);
	};

	$scope.httpDelete = function ($event) {
		return httpRequest("delete", $event);
	};

	$scope.httpPost = function ($event) {
		return httpRequest("post", $event);
	};

	$scope.httpPut = function ($event) {
		return httpRequest("put", $event);
	};

	$scope.httpGet = function ($event) {
		return httpRequest("get", $event);
	};

	$scope.ID = function () {
		return "_" + Math.random().toString(36).substr(2, 9);
	};

	$scope.openModal = function ($event) {
		openModal($event.currentTarget);
	};

	$scope.changeContent = function ($event) {
		const poster = $($event.target).data("poster");
		const title = $($event.target).data("title");
		const description = $($event.target).data("description");
		$("#changingTitle").html(title);
		$("#changingPoster").html("Posted by:" + poster);
		$("#changingDescription").html(description);
		$("#innerContent > div").hide();
		$($($event.target).data("selector")).show();
		$("#editSection").data("title", title);
		$("#editSection").data("id", $($event.target).data("id"));
		$("#editSection").data("description", description);
		$("#editSection").data("category", $($event.target).data("category"));
		$("#editSection").show();
	};
}]);
