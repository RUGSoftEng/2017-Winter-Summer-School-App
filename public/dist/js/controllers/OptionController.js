app.controller("OptionController", ["$scope", "$http", function ($scope, $http) {
	$http.get("/API/school")
		.then(function (data) {
			$scope.schools = data.data;
			$scope.selectedSchool = $scope.schools.length ? $scope.schools[0] : "";
			$http.get("/API/user")
				.then(function (data) {
					$scope.users = data.data;
				}, function (err) {
					console.log(err);
				});

			$http.get("/API/loginCode")
				.then(function (data) {
					$scope.codes = data.data;
				}, function (err) {
					console.log(err);
				});
		}, function (err) {
			console.log(err);
		});

	$scope.roles = exports.roles;
	$scope.selectedRole = $scope.roles[0];
	$scope.addUser = {};
	$scope.addLoginCode = {};
	$scope.addSchool = {};

	$scope.findSchoolById = function (id) {
		const ret = $.grep($scope.schools, function (e) {
			return e._id === id; 
		});
		return ret.length ? ret[0] : {};
	};

	$scope.getSchoolName = function (id) {
		return id ? ($scope.findSchoolById(id).name || "") : "";

	};

	$scope.newTable = function (dataArray, cols) {
		if (!cols) {
			cols = [];
			Object.keys(dataArray).forEach(function (key) {
				cols.push(key);
			});
		}
		return {
			rows: dataArray,
			columns: cols
		};
	};

	$scope.optionSubmit = function (category) {
		let path;
		let toAdd = {};

		switch (category) {
			case "user":
				path = "/API/user";
				$scope.addUser.rank = $("#rank")[0].value;
				$scope.addUser.school = $("#user_school")[0].value;
				toAdd = $scope.addUser;
				break;
			case "school":
				path = "/API/school";
				toAdd = $scope.addSchool;
				break;
			case "code":
				path = "/API/loginCode";
				toAdd = $scope.addLoginCode;
				break;
		}
		$http.post(path, toAdd).then( function (data){
			window.location.reload();
		}, function (error) {
			$scope.addAlert("danger", error.data);
		});
	};

	$scope.changeSection = function ($event) {
		const poster = $($event.currentTarget).data("poster");
		const title = $($event.currentTarget).data("title");
		$("#changingTitle").html(title);
		$("#changingPoster").html("Posted by:" + poster);
		$("#innerContent > div").hide();
		$($($event.target).data("selector")).show();
		$("#editSection").data("title", title);
		$("#editSection").data("id", $($event.target).data("id"));
		$("#editSection").data("category", $($event.target).data("category"));
		$("#editSection").show();
	};

	$scope.newSection = function (name) {
		return {
			name: name,
			selector: $scope.ID(),
			text: "Manage " + name,
			file: "manage_" + name.replace(/ /g, "_") + ".html"
		};
	};

	$scope.sections = [
		$scope.newSection("users"),
		$scope.newSection("login codes"),
		$scope.newSection("schools")
	];

}]);
