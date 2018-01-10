app.controller('ModalController', ['$scope', function ($scope) {
	$scope.mayView = function () {
		return $scope.$parent.isAuthorised('ALTER_ANNOUNCEMENTS')
			|| $scope.$parent.isAuthorised('ALTER_GENERAL_INFO')
			|| $scope.$parent.isAuthorised('ALTER_CALENDAR');
	};

	/**
	 * Creates an array with values 0 .. arraySize-1 and then multiplies it
	 * by a certain factor
	 *
	 * @param {int} arraySize
	 * @param {int} factor
	 */
	$scope.range = function (arraySize, factor) {
		factor = factor || 1;
		return Array.apply(null, {length: arraySize}).map(Number.call, Number).map(x => x * factor);
	};

	$scope.categories = exports.categories;

	$scope.hour = 0;
	$scope.minute = 0;
}]);