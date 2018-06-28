app.directive("manageButton", function () {
	return {
		restrict: "E",
		scope: { item: "=" },
		templateUrl: "directives/manageButton.html"
	};
});
