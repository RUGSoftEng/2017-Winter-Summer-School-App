app.controller('AnnouncementController', ['$scope', '$http', function($scope, $http) {
	let getAnnouncements = function(){
		$http.get('/API/announcement?school=' + $scope.schoolid)
			.then(function(data) {
				$scope.announcements = data.data;
			}, function(err) {
				console.log(err);
			});
	};
	let resetSelectedAnnouncement = function () {
		$scope.selectedAnnouncement = {
			title: "Click on an announcement to view",
			description: "Announcement description",
			author: " ",
		};
		$scope.deleteDisabled = true;
	};
	getAnnouncements();
	resetSelectedAnnouncement();
	$scope.pageSize = 5;
	$scope.currentPage = 1;

	$scope.deleteAnnouncement = function (id) {
		const ok = confirm(id);
		if (ok) {
			$http.delete("/API/announcement?id=" + id)
				.then(function () {
					getAnnouncements();
					resetSelectedAnnouncement();
				});
		}
	};
	$scope.announceClick = function (id) {
		$scope.selectedAnnouncement = $scope.announcements.find(t => t._id === id);
		$scope.deleteDisabled = false;
	};
	$scope.editInfo = function($event){
		openModal($event);
	}

}]);
