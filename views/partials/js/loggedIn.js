 var titles = ["Add an announcement", "Add general information"];
 var editTitles = ["Edit the announcement", "Edit general information"];
 var buttonTexts = ["Post announcement", "Add section"];
 var sectionHeaders = ["Title of announcement", "Information header"];
 var links = ["/announcement/item", "/generalinfo/item"];
 var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];


 function addNewItem(type, edit) {
     $('.back').hide();
     if (edit) {
         $('#add-announcement .finish').data('type', 'edit');
         $('#add-announcement .delete').show();
     } else {
         $('#add-announcement .finish').data('type', 'add');
         $('#add-announcement .delete').hide();
     }
     $('#add-announcement .modal-title').html("<p>" + (edit ? editTitles[$type] : titles[$type]) + "</p>");
     $('#add-announcement #section-header').html(sectionHeaders[$type]);
     $('#add-announcement .finish').html((edit ? "Edit" : buttonTexts[$type]));
     $('#add-announcement .edit').hide();
     $('#add-announcement .finish').show();
     $('#add-announcement .preview').show();
     $('#add-announcement form').attr('action', links[$type]);
     $('#add-announcement .modal-add-body').show();
     $('#add-announcement .modal-show-body').hide();
     if ($type == 1) {
         $('#add-announcement .target').hide();
     } else {
         $('#add-announcement .target').show();
     }
 };

 function displayItem(title, text, $type) {
     $('.back').hide();
     $('#add-announcement .target').hide();
     $('#add-announcement .modal-add-body').hide();
     $('#add-announcement .modal-show-body').show();
     $('#add-announcement .modal-title').html(title);
     $('#add-announcement .modal-show-body .jumbotron').html(text);
     $('#add-announcement').data("type", $type);
     $('#add-announcement .edit').show();
     $('#add-announcement .finish').hide();
     $('#add-announcement .preview').hide();
     $('#add-announcement .delete').hide();
 };


 $(function() {
 	 $today = days[new Date().getDay()-1];
 	 $('#' + $today).addClass('in'); // open the schedule corresponding to the current day
 	 
     $('.finish').click(function(event) {
         $type = $(this).data('type');
         if (confirm("Are you sure that you want to " + $type + "?")) {
             if (!$('#announcementDescription').val() || !$('#announcementTitle').val()) {
                 event.preventDefault();
                 alert("Please fill in a title and content");
             } else if ($type == "edit") {
                 event.preventDefault();
                 $.ajax({
                     url: links[$('#add-announcement').data('type')] + '?id=' + $('#add-announcement').data('id') + '&description=' + $('#announcementDescription').val() + '&title=' + $('#announcementTitle').val(),
                     type: 'PUT',
                     success: function(result) {
                         location.reload();
                     }
                 });
             }
         } else {
             event.preventDefault();
         }
     });
     $('.back').click(function() {
         addNewItem($('#add-announcement').data('type'), false);
     });
     $('#add-announcement .delete').click(function() {
         if (confirm("Are you sure you want to delete?")) {
             $.ajax({
                 url: links[$('#add-announcement').data('type')] + '?id=' + $('#add-announcement').data('id'),
                 type: 'DELETE',
                 success: function(result) {
                     location.reload();

                 }
             });
             event.preventDefault();
         } else {
             event.preventDefault();
         }

     });
     $('.edit').click(function() {
         var editTitleValue = $('#add-announcement .modal-title').text();
         var editTextValue = $('#add-announcement .modal-show-body .jumbotron').html();
         addNewItem($('#add-announcement').data('type'), true);
         $('#add-announcement form').attr('action', links[$('#add-announcement').data('type')]);
         $('#announcementTitle').val(editTitleValue);
         $('#announcementDescription').val(editTextValue);
     });
     $('.preview').click(function() {

         $add = $('#add-announcement').data('show');
         displayItem($('#announcementTitle').val(), $('#announcementDescription').val(), $('#add-announcement').data("type"));
         if ($add == 'new') {
             $('.back').show();
             $('.edit').hide();
         }

     });
     $('.open-modal').click(function() {
         $('#add-announcement').data('id', $(this).data('id'));
         $('#add-announcement .delete').hide();
         $type = $(this).data("type");

         if ($(this).data("show") != "overview") {
             addNewItem($type, false);
             $('#announcementTitle').val('');
             $('#announcementDescription').val('');
             $('#add-announcement').data('show', 'new');
         } else {
             $('#add-announcement').data('show', 'known');
             displayItem($(this).find('span.title').html(), $(this).find('.data-text').html(), $type);
         }
     });
 });