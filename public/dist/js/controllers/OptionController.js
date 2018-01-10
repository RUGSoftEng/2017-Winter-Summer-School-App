app.controller('OptionController', ['$scope', '$http', function($scope, $http) {
	$http.get('/API/school')
		.then(function(data) {
			$scope.schools = data.data;
			$scope.selectedSchool = $scope.schools[0]._id;

			$http.get('/API/user')
				.then(function(data) {
					$scope.users = data.data;
				}, function(err) {
					console.log(err);
				});

			$http.get('/API/loginCode')
				.then(function(data) {
					$scope.codes = data.data;
				}, function(err) {
					console.log(err);
				});
		}, function(err) {
			console.log(err);
		});

	$scope.roles = exports.roles;
	$scope.selectedRole = $scope.roles[0];

	$scope.findSchoolById = function (id) {
		const ret = $.grep($scope.schools, function (e) { return e._id === id });
		return ret.length ? ret[0] : {};
	};

	$scope.getSchoolName = function (id) {
		return id ? ($scope.findSchoolById(id).name || "") : ""

	};

	$scope.newTable = function (dataArray, cols) {
		if(!cols) {
			cols = [];
			Object.keys(dataArray).forEach(function(key) {
				cols.push(key);
			});
		}
		return {
			rows: dataArray,
			columns: cols
		};
	};
}]);