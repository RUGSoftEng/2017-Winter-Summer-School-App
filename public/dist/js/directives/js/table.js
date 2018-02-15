app.directive('sable', function() {
	return {
		restrict: 'E',
		scope: {
			table: '='
		},
		templateUrl: 'directives/table.html'
	};
});