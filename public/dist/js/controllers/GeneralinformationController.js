app.controller('GeneralinfoController', ['$scope', '$http', function ($scope, $http) {
	let getGeneralInfo = function () {
		$http.get('/API/generalinfo')
			.then(function (data) {
				$scope.generalinfo = data.data;
			}, function (err) {
				console.log(err);
			});
	};

	let resetSelectedInfo = function () {
		$scope.selectedAnnouncement = {
			title: "Click on a general info to view",
			description: "General information description",
			author: " ",
		};
		$scope.deleteDisabled = true;
	};

	getGeneralInfo();
	resetSelectedInfo();
	$scope.pageSize = 5;
	$scope.currentPage = 1;

	$scope.deleteInfo = function (id) {
		const ok = confirm(id);
		if (ok) {
			$http.delete("/API/generalinfo?id=" + id)
				.then(function () {
					getGeneralInfo();
					resetSelectedInfo();
				});
		}
	};
	$scope.infoClick = function (id) {
		$scope.selectedAnnouncement = $scope.generalinfo.find(t => t._id === id);
		$scope.deleteDisabled = false;
	};

	$scope.editInfo = function () {
		$type = 1;
		addNewItem($type, true);
		$(modalSelector + 'form').attr('action', links[$type]);
		$(modalSelector).data('id', $scope.selectedAnnouncement._id);
		$(modalSelector).data('type', $type);
		$(titleSelector).val($scope.selectedAnnouncement.title);
		$(descriptionSelector).val($scope.selectedAnnouncement.description);
		$('#category').val($scope.selectedAnnouncement.category);
	}
}]);
