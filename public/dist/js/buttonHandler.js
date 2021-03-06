// This function takes in a string and for each character
// it will either hide or show a button; an uppercase
// letter shows the button, and lowercase hides it.
function toggleButtons (buttonToggles) {
	for (let i = 0; i < buttonToggles.length; ++i) {
		const firstChar = buttonToggles.charAt(i);
		const button = getButton(firstChar.toLowerCase());
		if (isLowerCase(firstChar))
			button.hide();
		else
			button.show();
	}
}

function getButton (letter) {
	switch (letter) {
	case "b":
		return $(modalSelector + ".back");
	case "d":
		return $(modalSelector + ".delete");
	case "e":
		return $(modalSelector + ".edit");
	case "f":
		return $(modalSelector + ".finish");
	case "p":
		return $(modalSelector + ".preview");
	}
}

function isLowerCase (letter) {
	return letter == letter.toLowerCase();
}

function isEmptyContainer (selector) {
	return !$(selector).val();
}

function validateScheduleInput () {
	let valid = $("#startMinute").val() <= $("#endMinute").val();
	const dayDiff = moment($("#scheduleStartDate input").val()).diff(moment($("#scheduleEndDate input").val()));
	const hourDiff = $("#startHour").val() - $("#endHour").val();
	if (hourDiff < 0)
		valid = true;
	else if (hourDiff > 0)
		valid = false;
	if (dayDiff < 0)
		valid = true;
	else if (dayDiff > 0)
		valid = false;
	return valid;
}

function isMissingScheduleFields () {
	return isEmptyContainer("#location ") ||
		isEmptyContainer("#details ") ||
		isEmptyContainer("#scheduleStartDate input") ||
		isEmptyContainer("#scheduleEndDate input");
}

function initialiseFinishButton () {
	getButton("f").click(function (event) {
		let cont = true;
		if (!validateScheduleInput()) {
			cont = confirm("It appears the selected time might be wrong. Are you sure you want to continue?");
		}
		const action = $(this).data("type");
		if (cont && confirm("Are you sure that you want to " + action + "?")) {
			// TODO: This is a nasty hack which I will remove soon
			$(".md-datepicker-input").each(function (index) {
				$(this).attr("name", (index ? "end" : "start") + "Date");
			});

			if (isEmptyContainer(titleSelector) || ($type == 2 && isMissingScheduleFields())) { // no title, prevent the POST request
				event.preventDefault();
				const alertMessage = ($type == 2) ? "Events require all fields be filled!" : "Please fill in a title and content!";
				alert(alertMessage);
			} else if (action == "edit") {
				// The description can contain \n, these need to be removed
				// because chrome rejects API calls with both \n and <
				// See https://www.chromestatus.com/feature/5735596811091968
				desc = $(descriptionSelector).val().replace(/(\r\n|\n|\r)/gm, "");
				event.preventDefault();
				// send a PUT request instead of POST if an existing item is edited.
				$.ajax({
					url: links[$(modalSelector).data("type")] +
					"?id=" + $(modalSelector).data("id") +
					"&description=" + desc +
					"&title=" + $(titleSelector).val() +
					"&location=" + $("#location ").val() +
					"&details=" + $("#details ").val() +
					"&startDate=" + $("#scheduleStartDate input").val() +
					"&startHour=" + $("#startHour ").val() +
					"&startMinute=" + $("#startMinute ").val() +
					"&endDate=" + $("#scheduleEndDate input").val() +
					"&endHour=" + $("#endHour ").val() +
					"&endMinute=" + $("#endMinute ").val() +
					"&category=" + $("#category ").val(),
					type: "PUT",
					success: function (result) {
						location.reload();
					}
				});

			}
		} else { // user is not sure, prevent the POST request
			event.preventDefault();
		}
	});
}

function initialiseBackButton () {
	getButton("b").click(function () {
		addNewItem($(modalSelector).data("type"), false);
	});
}

function initialiseDeleteButton () {
	getButton("d").click(function (event) {
		event.preventDefault();
		if (confirm("Are you sure you want to delete?")) {
			$.ajax({
				url: links[$(modalSelector).data("type")] + "?id=" + $(modalSelector).data("id"),
				type: "DELETE",
				success: function (result) {
					location.reload();
				}
			});
		}
	});
}

function initialiseEditButton () {
	getButton("e").click(function () {
		const editTitleValue = ($(modalSelector).data("type") == 2) ? $(titleSelector).val() : $(modalSelector + ".modal-title").text();
		const editTextValue = $.trim($(modalSelector + ".modal-show-body .jumbotron").html());
		addNewItem($(modalSelector).data("type"), true);
		$(modalSelector + "form").attr("action", links[$(modalSelector).data("type")]);
		$(titleSelector).val(editTitleValue);
		$(descriptionSelector).val(editTextValue);
		$("#category").val($(modalSelector).data("category"));
	});
}

function initialisePreviewButton () {
	getButton("p").click(function () {
		$addType = $(modalSelector).data("show");
		displayItem($(titleSelector).val(), $(descriptionSelector).val(), $(modalSelector).data("type"));
		if ($addType == "new") {
			toggleButtons("Be"); // if the content is not added yet, we can not edit it
		}
	});
}

function toggleShow (display) {
	if (display) {
		$(modalSelector + ".modal-add-body").hide();
		$(modalSelector + ".modal-show-body").show();
	} else {
		$(modalSelector + ".modal-add-body").show();
		$(modalSelector + ".modal-show-body").hide();
	}
}

function initialiseButtons () {
	initialiseFinishButton();
	initialiseBackButton();
	initialiseDeleteButton();
	initialiseEditButton();
	initialisePreviewButton();
}
