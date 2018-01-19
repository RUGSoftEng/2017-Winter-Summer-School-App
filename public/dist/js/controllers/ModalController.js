app.controller('ModalController', ['$scope', function ($scope) {
	$scope.mayView = function () {
		return $scope.$parent.isAuthorised('ALTER_ANNOUNCEMENTS')
			|| $scope.$parent.isAuthorised('ALTER_GENERAL_INFO')
			|| $scope.$parent.isAuthorised('ALTER_CALENDAR');
	};

	/**
	 * Creates an array with values 0 .. arraySize-1 and then multiplies it
	 * by a certain factor, after which it will be converted to strings
	 * with a 0 prepended to single digits.
	 *
	 * @param {int} arraySize
	 * @param {int} factor
	 */
	$scope.range = function (arraySize, factor) {
		factor = factor || 1;
		return Array.apply(null, {length: arraySize})
			.map(Number.call, Number)
			.map(x => x * factor)
			.map(x => x < 10 ? '0' + x : '' + x);
	};

	$scope.categories = exports.categories;

	$scope.newDateTime = function (str) {
		return {
			hour: '00',
			minute: '00',
			date: '',
			disabled: false,
			text: str,
			title: str.charAt(0).toUpperCase() + str.slice(1)
		};
	};

	$scope.start = $scope.newDateTime('start');
	$scope.end = $scope.newDateTime('end');

}]);

app.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
		return date ? moment(date).format('YYYY-MM-DD') : '';
	};
});
