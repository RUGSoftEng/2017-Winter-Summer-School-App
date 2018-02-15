app.controller('AnnouncementController', ['$scope', '$http', function($scope, $http) {

	$http.get('/API/announcement?school=' + $scope.schoolid)
		.then(function(data) {
			$scope.announcements = data.data;
		}, function(err) {
			console.log(err);
		});
}]);
