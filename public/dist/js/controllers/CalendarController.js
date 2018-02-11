app.controller('CalendarController', ['$scope', '$http', function ($scope, $http) {
	$scope.isToday = function (eventDay) {
		return moment().isSame(eventDay, 'day');
	};

	/**
	 * Splits an array of events into an array of days, where each day is an array of events.
	 * The days are based on the starting and ending date of a school.
	 *
	 * @param {Array} events
	 * @returns {Array}
	 */
	$scope.splitInDays = function (events) {
		let days = [];
		let currentDay = new Date($scope.school.startDate);
		const lastDay = new Date($scope.school.endDate);

		let dateToIndexMap = [];
		let i = 0;
		while (currentDay <= lastDay) {
			days[i] = [];
			days[i]["date"] = currentDay;
			dateToIndexMap[moment(currentDay).format("dd, MM, YY")] = i;
			currentDay = new Date(currentDay.valueOf() + 864E5); // Increment by a single day.
			++i;
		}

		for (let i = 0; i < events.length; ++i) {
			const day = events[i].startDate;
			const arrIndex = dateToIndexMap[moment(day).format("dd, MM, YY")];
			days[arrIndex].push(events[i]);
		}
		return days;
	};

	$http.get('/API/school?_id=' + $scope.schoolid)
		.then(function(data) {
			$scope.school = data.data[0];
			const filterBySchoolTimeframe = jQuery.param({
				startDate: {
					$gte: $scope.school.startDate,
					$lt: $scope.school.endDate
				}
			});
			$http.get('/API/event?school=' + $scope.schoolid + "&" + filterBySchoolTimeframe)
				.then(function (res) {
					$scope.calendar = $scope.splitInDays(res.data);
				}, function (err) {
					console.log(err);
				});
		}, function(err) {
			console.log(err);
		});
}]);
