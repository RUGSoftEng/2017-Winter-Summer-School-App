 /*
 	This script handles all UI manipulations for the modal. It dynamically changes
 	the input fields, buttons and texts of the modal depending on where is clicked.
  */

 var titles = ["Add an announcement", "Add general information", "Add a new event"];
 var editTitles = ["Edit the announcement", "Edit general information"];
 var buttonTexts = ["Post announcement", "Add section", "Add appointment"];
 var sectionHeaders = ["Title of announcement", "Information header", "Event summary"];
 var links = ["/announcement/item", "/generalinfo/item", "calendar/event"];
 var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

 var modalSelector = '#add-announcement ';
 var titleSelector = '#announcementTitle ';
 var descriptionSelector = '#announcementDescription ';



 function toggleShow(display) {
	 if(display) {
		 $(modalSelector + '.modal-add-body').hide();
		 $(modalSelector + '.modal-show-body').show();
	 } else {
		 $(modalSelector + '.modal-add-body').show();
		 $(modalSelector + '.modal-show-body').hide();
	 }
 }

 function addNewItem(type, edit) {
     toggleButtons('bDeFP');

     if (edit) {
         getButton('f').data('type', 'edit');
     } else {
         getButton('f').data('type', 'add');
         toggleButtons('d'); // hide delete if we're not editing
     }
     $(modalSelector + '.modal-title').html("<p>" + (edit ? editTitles[$type] : titles[$type]) + "</p>");
     $('.description-form').show();
     $(modalSelector + '#section-header').html(sectionHeaders[$type]);
     getButton('f').html((edit ? "Edit" : buttonTexts[$type]));
     $(modalSelector + 'form').attr('action', links[$type]);
     toggleShow(false);
     $('.datetime-form').hide();
     $(modalSelector + '.target').show();
     if($type == 2) { // adding a schedule event
     	 toggleButtons('p'); // no preview button for scheduling
	     $('.description-form').hide();
	     $('.datetime-form').show();
     }
 };

 function displayItem(title, text, $type) {
     $(modalSelector + '.target').hide();
     $(modalSelector + '.modal-title').html(title);
     $(modalSelector + '.modal-show-body .jumbotron').html(text);
     $(modalSelector).data("type", $type);
     toggleShow(true);
     toggleButtons('bEfpd');
 };

 function openTodaysSchedule() {
	 $today = days[new Date().getDay()]; // take the positive modulo
 	 $('#' + $today).addClass('in');
 }

 function initialiseScheduleDatePicker() {
	 $( "#scheduleStartDate, #scheduleEndDate" ).datepicker({
	     dateFormat: 'yy-mm-dd'
     });
 }

 function emptyContainer(selector) {
	 $(selector).val('');
 }

 function initialiseModalOpeners() {
	 $('.open-modal').click(function() {
         $(modalSelector).data('id', $(this).data('id'));
         toggleButtons('d');
         $type = $(this).data("type");

         if ($(this).data("show") != "overview") {
             addNewItem($type, false);
             emptyContainer(titleSelector);
             emptyContainer(descriptionSelector)
             $(modalSelector).data('show', 'new');
         } else {
             $(modalSelector).data('show', 'known');
             displayItem($(this).find('span.title').html(), $(this).find('.data-text').html(), $type);
         }
     });
 }

 $(function() {
 	 $('.img-thumbnail').hide();
 	 $('#thumbnailDiv').hide();
	 openTodaysSchedule();
	 initialiseScheduleDatePicker();
     initialiseScheduleButtons();
	 initialiseButtons();
	 initialiseModalOpeners();
 });
