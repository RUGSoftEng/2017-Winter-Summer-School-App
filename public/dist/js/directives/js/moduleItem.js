app.directive('moduleItem', function() {
	return {
		restrict: 'E',
		scope: {
			item: '='
		},
		templateUrl: 'directives/moduleItem.html',
		link: function(scope, element, attrs) {
			scope.openModal = function($event) {
				openModal($event.currentTarget);
			}
		}
	};
});