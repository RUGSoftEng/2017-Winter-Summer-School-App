app.controller("ForumController", ["$scope", "$http", function ($scope, $http) {
	const getComments = function (id) {
		$http.get("/API/forum/comment?parentThread=" + id)
			.then(function (data) {
				$scope.selectedThreadComments = data.data;
			}, function (err) {
				alert("Could not retrieve comments" + err);
			});
	};
	const getThreads = function () {
		$http.get("/API/forum/thread?school=" + $scope.schoolid)
			.then(function (data) {
				$scope.threads = data.data;
			}, function (err) {
				alert("Could not retrieve threads" + err);
			});
	};
	const resetSelectedThread = function () {
		$scope.selectedThread = {
			title: "Click on a thread to view",
			description: "Thread description",
			author: " "
		};
		$scope.deleteDisabled = true;
	};
	getThreads();
	resetSelectedThread();
	$scope.pageSize = 5;
	$scope.currentPage = 1;

	$scope.deleteComment = function (id) {
		const ok = confirm("Delete comment?");
		if (ok) {
			$http.delete("/API/forum/comment?id=" + id)
				.then(function () {
					getComments($scope.selectedThread._id);
				});
		}
	};
	$scope.deleteThread = function (id) {
		const ok = confirm("Delete thread?");
		if (ok) {
			$http.delete("/API/forum/thread?id=" + id)
				.then(function () {
					getThreads();
					resetSelectedThread();
				});
		}
	};

	$scope.threadClick = function (id) {
		$scope.selectedThread = $scope.threads.find(t => t._id === id);
		$scope.deleteDisabled = false;
		getComments(id);
	};
}]);
