app.controller('CalendarController', ['$scope', '$http', function ($scope, $http) {
	$scope.week = 0;
	$scope.days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	$scope.months = ["January", "February", "March", "April", "May", "June", "July",
		"August", "September", "October", "November", "December"];




	$scope.printDay = function (eventDay) {
		var day = new Date(eventDay[0]);
		return $scope.days[day.getDay()].charAt(0).toUpperCase()
			+ $scope.days[day.getDay()].slice(1);
	};

	$scope.isToday = function (eventDay) {
		var today = new Date();
		var day = new Date(eventDay[0]);
		return day.getDate() === today.getDate() &&
			  day.getMonth() === today.getMonth() &&
			  day.getFullYear() === today.getFullYear();
	};

	$scope.printDate = function (eventDay) {
		var day = new Date(eventDay[0]);
		return ' (' + $scope.months[day.getMonth()] + ' ' + day.getDate() + ')';
	};

	$scope.printTime = function (date) {
		var d = new Date(date);
		return d.getHours() + ":" + (d.getMinutes() <= '9' ? '0' + d.getMinutes() : d.getMinutes());
	};

	$scope.splitInDays = function (events) {
		return events;
	};

	$http.get('/API/event?week=' + $scope.week)
		.then(function (res) {
			$scope.calendar = $scope.splitInDays(res.data);
		}, function (err) {
			console.log(err);
		});
}]);
