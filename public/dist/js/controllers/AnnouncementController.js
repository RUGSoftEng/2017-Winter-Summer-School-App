app.controller('AnnouncementController', ['$scope', '$http', function($scope, $http) {

	$http.get('/API/announcement')
		.then(function(data) {
			$scope.announcements = data.data;
		}, function(err) {
			console.log(err);
		});
}]);
