/*
 This script handles all UI manipulations for the modal. It dynamically changes
 the input fields, buttons and texts of the modal depending on where is clicked.
 */

const titles = ["Add an announcement", "Add general information", "Add a new event"];
const editTitles = ["Edit the announcement", "Edit general information", "Edit event"];
const buttonTexts = ["Post announcement", "Add section", "Submit event"];
const sectionHeaders = ["Title of announcement", "Information header", "Event summary"];
const links = ["/API/announcement", "/API/generalinfo", "/API/event"];
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const modalSelector = "#add-announcement ";
const titleSelector = "#announcementTitle ";
const descriptionSelector = "#announcementDescription ";
const eventDetailsSelector = "#details ";
const eventLocationSelector = "#location ";

function addNewItem (type, edit) {
	toggleButtons("bdeFP");

	getButton("f").data("type", edit ? "edit" : "add");

	$(".category-form").hide();

	$(modalSelector + ".modal-title").html("<p>" + (edit ? editTitles[type] : titles[type]) + "</p>");
	$(".description-form").show();
	$(modalSelector + "#section-header").html(sectionHeaders[type]);
	getButton("f").html((edit ? "Save" : buttonTexts[type]));
	$(modalSelector + "form").attr("action", links[type]);
	toggleShow(false);
	$(".datetime-form").hide();
	$(modalSelector + ".target").show();
	if (type == 2) { // adding a schedule event
		toggleButtons("p"); // no preview button for scheduling
		$(".description-form").hide();
		$(".datetime-form").show();
	} else if (type == 1) {
		$(".category-form").show();
	}
	toggleScheduleInput(false);

}

function displayItem (title, text, $type) {
	$(modalSelector + ".target").hide();
	$(modalSelector + ".modal-title").html(title);
	$(modalSelector + ".modal-show-body .jumbotron").html(text);
	$(modalSelector).data("type", $type);
	toggleShow(true);
	toggleButtons("bEfpD");
}

function openTodaysSchedule () {
	$today = days[new Date().getDay()]; // take the positive modulo
	$("#" + $today).addClass("in");
}

function emptyContainer (selector) {
	$(selector).val("");
}

function toggleScheduleInput (disabled) {
	const sc = ".modal-add-body .form-group ";
	$(sc + "input, " + sc + "textarea, " + sc + "select").attr("disabled", disabled);
}

function fillScheduleInput (clicked) {
	$(titleSelector).val(clicked.data("event-summary"));
	$(eventLocationSelector).val(clicked.data("event-location"));
	$(eventDetailsSelector).val(clicked.data("event-description"));
	const startDate = moment(clicked.data("event-start-date"));
	const endDate = moment(clicked.data("event-end-date"));
	$("#scheduleStartDate input").val(startDate.format("YYYY-MM-DD"));
	$("#scheduleEndDate input").val(endDate.format("YYYY-MM-DD"));
	$("#startHour").val(startDate.format("HH"));
	$("#startMinute").val(startDate.format("mm"));
	$("#endHour").val(endDate.format("HH"));
	$("#endMinute").val(endDate.format("mm"));
}

function openModal (event) {
	const element = $(event);
	$(modalSelector).data("id", element.data("id"));
	toggleButtons("d");
	$type = element.data("type");

	if (element.data("show") != "overview") {
		emptyContainer(eventDetailsSelector);
		emptyContainer(eventLocationSelector);
		if (element.data("spec") != "schedule") {
			addNewItem($type, false);
			emptyContainer(titleSelector);
			emptyContainer(descriptionSelector);
			$(modalSelector).data("show", "new");
		} else {
			addNewItem($type, true);
			$(modalSelector).data("type", $type);
			$(modalSelector).data("id", element.data("event-id"));
			toggleButtons("bEfpD");
			toggleScheduleInput(true);
			fillScheduleInput(element);
		}


	} else {
		$(modalSelector).data("show", "known");
		const page = element.data("page") == true;
		const title = page ? element.data("title") : element.find("span.title").html();
		const text = page ? element.data("description") : element.find(".data-text").html();
		displayItem(title, text, $type);
		if ($type == 1) {
			$(modalSelector).data("category", element.data("category"));
		}
	}
}

function initialiseModalOpeners () {
	$(".open-modal").click(function () {
		openModal(this);
	});
}

$(function () {
	$("#announcementDescription").markItUp(mySettings);
	openTodaysSchedule();
	initialiseScheduleButtons();
	initialiseButtons();
	initialiseModalOpeners();
});
