/*
 This script handles all UI manipulations for the modal. It dynamically changes
 the input fields, buttons and texts of the modal depending on where is clicked.
 */

var titles         = ["Add an announcement", "Add general information", "Add a new event"];
var editTitles     = ["Edit the announcement", "Edit general information", "Edit event"];
var buttonTexts    = ["Post announcement", "Add section", "Submit event"];
var sectionHeaders = ["Title of announcement", "Information header", "Event summary"];
var links          = ["/API/announcement", "/API/generalinfo", "/API/calendar/event"];
var days           = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

var modalSelector         = '#add-announcement ';
var titleSelector         = '#announcementTitle ';
var descriptionSelector   = '#announcementDescription ';
var eventDetailsSelector  = '#details ';
var eventLocationSelector = '#location ';

function addNewItem(type, edit) {
	toggleButtons('bdeFP');

	getButton('f').data('type', edit ? 'edit' : 'add');

	$('.category-form').hide();

	$(modalSelector + '.modal-title').html("<p>" + (edit ? editTitles[$type] : titles[$type]) + "</p>");
	$('.description-form').show();
	$(modalSelector + '#section-header').html(sectionHeaders[$type]);
	getButton('f').html((edit ? "Save" : buttonTexts[$type]));
	$(modalSelector + 'form').attr('action', links[$type]);
	toggleShow(false);
	$('.datetime-form').hide();
	$(modalSelector + '.target').show();
	if ($type == 2) { // adding a schedule event
		toggleButtons('p'); // no preview button for scheduling
		$('.description-form').hide();
		$('.datetime-form').show();
	} else if ($type == 1) {
		$('.category-form').show();
	}
	toggleScheduleInput(false);

};

function displayItem(title, text, $type) {
	$(modalSelector + '.target').hide();
	$(modalSelector + '.modal-title').html(title);
	$(modalSelector + '.modal-show-body .jumbotron').html(text);
	$(modalSelector).data("type", $type);
	toggleShow(true);
	toggleButtons('bEfpD');
};

function openTodaysSchedule() {
	$today = days[new Date().getDay()]; // take the positive modulo
	$('#' + $today).addClass('in');
}

function initialiseScheduleDatePicker() {
	$("#scheduleStartDate").datepicker({
		dateFormat: 'yy-mm-dd'
	});

	$("#scheduleEndDate").datepicker({
		dateFormat: 'yy-mm-dd',
		onSelect: function (dateText, obj) {
			var valid = new Date($('#scheduleStartDate').val()) <= new Date($('#scheduleEndDate').val());
			alterInputStyling('#scheduleEndDate', 'The starting date seems to be later than the ending date.', valid);
		}
	});

	$('#endHour').change(function () {
		var valid = $('#startHour').val() <= $('#endHour').val();
		if (new Date($('#scheduleStartDate').val()) < new Date($('#scheduleEndDate').val()))
			valid = true;
		alterInputStyling('#endHour', 'The starting hour seems to be later than the ending hour.', valid);
	});

	$('#endMinute').change(function () {
		var valid = $('#startMinute').val() <= $('#endMinute').val();
		if (new Date($('#scheduleStartDate').val()) < new Date($('#scheduleEndDate').val()))
			valid = true;
		if (new Date($('#startHour').val()) < new Date($('#endHour').val()))
			valid = true;
		alterInputStyling('#endMinute', 'This starting time seems to be later than the ending time.', valid);
	});
}

function emptyContainer(selector) {
	$(selector).val('');
}

function toggleScheduleInput(disabled) {
	var sc = '.modal-add-body .form-group ';
	$(sc + 'input, ' + sc + 'textarea, ' + sc + 'select').attr("disabled", disabled);
}

function fillScheduleInput(clicked) {
	$(titleSelector).val(clicked.data('event-summary'));
	$(eventLocationSelector).val(clicked.data('event-location'));
	$(eventDetailsSelector).val(clicked.data('event-description'));
	$('#scheduleStartDate').val(clicked.data('event-start-date').substring(0, 10));
	$('#scheduleEndDate').val(clicked.data('event-end-date').substring(0, 10));
	$('#startHour').val(clicked.data('event-start-date').substring(11, 13));
	$('#startMinute').val(clicked.data('event-start-date').substring(14, 16));
	$('#endHour').val(clicked.data('event-end-date').substring(11, 13));
	$('#endMinute').val(clicked.data('event-end-date').substring(14, 16));
	$('#targetItem').val(clicked.data('event-ssid'));
}

function openModal(event) {
	var element = $(event);
	$(modalSelector).data('id', element.data('id'));
	toggleButtons('d');
	$type = element.data("type");

	if (element.data("show") != "overview") {
		emptyContainer(eventDetailsSelector);
		emptyContainer(eventLocationSelector);
		if (element.data("spec") != "schedule") {
			addNewItem($type, false);
			emptyContainer(titleSelector);
			emptyContainer(descriptionSelector);
			$(modalSelector).data('show', 'new');
		}
		else {
			addNewItem($type, true);
			$(modalSelector).data("type", $type);
			$(modalSelector).data('id', element.data('event-id'));
			toggleButtons('bEfpD');
			toggleScheduleInput(true);
			fillScheduleInput(element);
		}


	} else {
		$(modalSelector).data('show', 'known');
		var page  = element.data('page') == true;
		var title = page ? element.data('title') : element.find('span.title').html();
		var text  = page ? element.data('description') : element.find('.data-text').html();
		displayItem(title, text, $type);
		if ($type == 1) {
			$(modalSelector).data("category", element.data('category'));
		}
	}
}

function initialiseModalOpeners() {
	$('.open-modal').click(function () {
		openModal(this);
	});
}

$(function () {
	$('#announcementDescription').markItUp(mySettings);
	openTodaysSchedule();
	initialiseScheduleDatePicker();
	initialiseScheduleButtons();
	initialiseButtons();
	initialiseModalOpeners();
});
