app.directive('dateTime', function() {
	return {
		restrict: 'E',
		scope: {
			datetime: '=',
			range: '='
		},
		templateUrl: 'directives/dateTime.html'
	};
});
