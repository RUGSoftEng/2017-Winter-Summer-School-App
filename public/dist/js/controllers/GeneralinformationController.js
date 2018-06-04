app.controller('GeneralinfoController', ['$scope', '$http', function ($scope, $http) {
	var getGeneralInfo = function () {
		$http.get("/API/generalinfo?school=" + $scope.schoolid)
			.then(function (data) {
				$scope.generalinfo = data.data;
			}, function (err) {
				console.log(err);
			});
	};

	var resetSelectedInfo = function () {
		$scope.selectedInfo = {
			title: "Click on a general info to view",
			description: "General information description",
			author: " "
		};
		$scope.deleteDisabled = false;
	};

	getGeneralInfo();
	resetSelectedInfo();
	$scope.pageSize = 5;
	$scope.currentPage = 1;

	$scope.deleteInfo = function (id) {
		const ok = confirm("Are you sure you want to delete this general information?");
		if (ok) {
			$http.delete("/API/generalinfo?id=" + id)
				.then(function () {
					getGeneralInfo();
					resetSelectedInfo();
				});
		}
	};
	$scope.infoClick = function (id) {
		$scope.selectedInfo = $scope.generalinfo.find(t => t._id === id);
		$scope.deleteDisabled = true;
	};

	$scope.editInfo = function () {
		$type = 1;
		addNewItem($type, true);
		$(modalSelector + 'form').attr('action', links[$type]);
		$(modalSelector).data('id', $scope.selectedInfo._id);
		$(modalSelector).data('type', $type);
		$(titleSelector).val($scope.selectedInfo.title);
		$(descriptionSelector).val($scope.selectedInfo.description);
		$('#category').val($scope.selectedInfo.category);
	}
}]);
