function addNewItem(edit) {
    $('.back').hide();
    if (edit) {
        $('#add-announcement .finish').data('type', 'edit');
        $('#add-announcement .delete').show();
    } else {
        $('#add-announcement .finish').data('type', 'add');
        $('#add-announcement .delete').hide();
    }
    $('#add-announcement .modal-title').html("<p>" + (edit ? "Edit Lecturer" : "Add Lecturer") + "</p>");
    $('.description-form').show();
    $('#add-announcement #section-header').html("Lecturer Name");
    $('#add-announcement #announcementTitle').attr('placeholder','Name')
    $('#add-announcement #announcementDescription').attr('placeholder','General Info')
    $('#add-announcement #thumbnailDiv').show();
    $('#modal-thumbnail').attr('src', '/images/default/placeholder.jpeg');
    $('#add-announcement .finish').html((edit ? "Edit" : "Add Lecturer"));
    $('#add-announcement .edit').hide();
    $('#add-announcement .finish').show();
    $('#add-announcement .preview').show();
    $('#add-announcement form').attr('action', "lecturer/item");
    $('#add-announcement .modal-add-body').show();
    $('#add-announcement .modal-show-body').hide();
    $('.datetime-form').hide();
    $('#add-announcement .target').hide();
};

function displayItem(title, text,img) {
    $('.back').hide();
    $('#add-announcement .target').hide();
    $('#add-announcement .modal-add-body').hide();
    $('#add-announcement .modal-show-body').show();
    $('#add-announcement #thumbnailDiv').show();
    $('#add-announcement #modal-thumbnail').attr('src',img);
    $('#add-announcement .modal-title').html(title);
    $('#add-announcement .modal-show-body .jumbotron').html(text);
    $('#add-announcement .edit').show();
    $('#add-announcement .finish').hide();
    $('#add-announcement .preview').hide();
    $('#add-announcement .delete').hide();
};

function readURL(input) {
if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#modal-thumbnail').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
}
}
$(function() {
    $('.browse').click(function(){
      var file = $(this).parent().parent().parent().find('.file');
      file.trigger('click');
    });
    $('#files').change(function(){
      readURL(this);
    });

    $('.finish').click(function(event) {
        $type = $(this).data('type');
        if (confirm("Are you sure that you want to " + $type + "?")) {
            if (!$('#announcementDescription').val() || !$('#announcementTitle').val()) {
                event.preventDefault();
                alert("Please fill in a Name and content");
            }
            //if the avatar was modified delete old lecturer and create new one
            //as files can only be passed through a post and not a put
            else if (($type == "edit") && ($('#files').val())) {
              $.ajax({
                  url: 'lecturer/item' + '?id=' + $('#add-announcement').data('id'),
                  type: 'DELETE',
                  success: function(result) {
                      location.reload();

                  }
              });
            }
            //if the avatar was not modified just update the db document.
            else if (($type == "edit") && !($('#files').val())){
              event.preventDefault();
              $.ajax({
                  url: 'lecturer/item' + '?id=' + $('#add-announcement').data('id') + '&description=' + $('#announcementDescription').val() + '&title=' + $('#announcementTitle').val()+'&imagepath=' + $('#modal-thumbnail').attr('src'),
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
        addNewItem(false);
    });
    $('#add-announcement .delete').click(function() {
        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                url: 'lecturer/item' + '?id=' + $('#add-announcement').data('id'),
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
        var editImgValue = $('#add-announcement #modal-thumbnail').attr('src');
        addNewItem(true);
        $('#add-announcement form').attr('action', 'lecturer/item');
        $('#announcementTitle').val(editTitleValue);
        $('#announcementDescription').val(editTextValue);
        $('#modal-thumbnail').attr('src',editImgValue);
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
        if ($(this).data("show") != "overview") {
            addNewItem(false);
            $('#announcementTitle').val('');
            $('#announcementDescription').val('');
            $('#add-announcement').data('show', 'new');
        } else {
            $('#add-announcement').data('show', 'known');
            displayItem($(this).find('h4.title').html(), $(this).find('.data-text').html(),$(this).find('.img-thumbnail').attr('src'));
        }
    });
});
