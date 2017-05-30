// This function takes in a string and for each character
// it will either hide or show a button; an uppercase
// letter shows the button, and lowercase hides it.
function toggleButtons(buttonToggles) {
    for (var i = 0; i < buttonToggles.length; ++i) {
        var firstChar = buttonToggles.charAt(i);
        var button    = getButton(firstChar.toLowerCase());
        if (isLowerCase(firstChar))
            button.hide();
        else
            button.show();
    }
}

function getButton(letter) {
    switch (letter) {
        case 'b':
            return $(modalSelector + '.back');
        case 'd':
            return $(modalSelector + '.delete');
        case 'e':
            return $(modalSelector + '.edit');
        case 'f':
            return $(modalSelector + '.finish');
        case 'p':
            return $(modalSelector + '.preview');
    }
}

function isLowerCase(letter) {
    return letter == letter.toLowerCase();
}

function isEmptyContainer(selector) {
    return !$(selector).val();
}

 function initialiseFinishButton() {
	 getButton('f').click(function(event) {
         $type = $(this).data('type');
         if (confirm("Are you sure that you want to " + $type + "?")) {
             if (isEmptyContainer(titleSelector)) { // no title, prevent the POST request
                 event.preventDefault();
                 alert("Please fill in a title and content");
             } else if ($type == "edit") {
             	 // send a PUT request instead of POST if an existing item is edited.
                 $.ajax({
                     url: links[$(modalSelector).data('type')] +
                     '?id=' + $(modalSelector).data('id') +
                     '&description=' + $(descriptionSelector).val() +
                     '&title=' + $(titleSelector).val() +
                     '&location=' + $('#location ').val() +
                     '&details=' + $('#details ').val() +
                     '&startDate=' + $('#scheduleStartDate ').val() +
                     '&startHour=' + $('#startHour ').val() +
                     '&startMinute=' + $('#startMinute ').val() +
                     '&endDate=' + $('#scheduleEndDate ').val() +
                     '&endHour=' + $('#endHour ').val() +
                     '&endMinute=' + $('#endMinute ').val() +
                     '&ssid=' + $('#targetItem ').val(),
                     type: 'PUT',
                     success: function(result) {
                         location.reload();
                     }
                 });
                 event.preventDefault();
             }
         } else { // user is not sure, prevent the POST request
             event.preventDefault();
         }
     });
 }

function initialiseBackButton() {
    getButton('b').click(function () {
        addNewItem($(modalSelector).data('type'), false);
    });
}

 function initialiseDeleteButton() {
	 getButton('d').click(function(event) {
	     event.preventDefault();
         if (confirm("Are you sure you want to delete?")) {
             $.ajax({
                 url: links[$(modalSelector).data('type')] + '?id=' + $(modalSelector).data('id'),
                 type: 'DELETE',
                 success: function(result) {
                     location.reload();
                 }
             });
         }
     });
 }

 function initialiseEditButton() {
	 getButton('e').click(function() {
         var editTitleValue = ($(modalSelector).data('type') == 2) ? $(titleSelector).val() : $(modalSelector + '.modal-title').text();
         var editTextValue = $.trim($(modalSelector + '.modal-show-body .jumbotron').html());
         addNewItem($(modalSelector).data('type'), true);
         $(modalSelector + 'form').attr('action', links[$(modalSelector).data('type')]);
         $(titleSelector).val(editTitleValue);
         $(descriptionSelector).val(editTextValue);
     });
 }

function initialisePreviewButton() {
    getButton('p').click(function () {
        $addType = $(modalSelector).data('show');
        displayItem($(titleSelector).val(), $(descriptionSelector).val(), $(modalSelector).data("type"));
        if ($addType == 'new') {
            toggleButtons('Be') // if the content is not added yet, we can not edit it
        }
    });
}

function initialiseButtons() {
    initialiseFinishButton();
    initialiseBackButton();
    initialiseDeleteButton();
    initialiseEditButton();
    initialisePreviewButton();
}
