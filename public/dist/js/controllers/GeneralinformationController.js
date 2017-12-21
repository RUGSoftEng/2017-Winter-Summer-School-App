app.controller('GeneralinfoController', ['$scope', '$http', function($scope, $http) {
	$http.get('/API/generalinfo')
		.then(function(data) {
			$scope.generalinfo = data.data;
			console.log()
		}, function(err) {
			console.log(err);
		});
}]);