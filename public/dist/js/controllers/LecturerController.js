app.controller('LecturerController', ['$scope', '$http', function($scope, $http) {

	$http.get('/API/lecturer')
		.then(function(data) {
			$scope.lecturers = data.data;
		}, function(err) {
			console.log(err);
		});
}]);
