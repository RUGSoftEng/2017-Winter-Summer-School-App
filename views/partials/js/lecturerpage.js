function addNewItem(edit) {
    $('.back').hide();
    if (edit) {
        $('#add-lecturer .finish').data('type', 'edit');
        $('#add-lecturer .delete').show();
    } else {
        $('#add-lecturer .finish').data('type', 'add');
        $('#add-lecturer .delete').hide();
    }
    $('#add-lecturer .modal-title').html("<p>" + (edit ? "Edit Lecturer" : "Add Lecturer") + "</p>");
    $('.description-form').show();
    $('#add-lecturer #section-header').html("Lecturer Name");
    $('#add-lecturer #lecturerTitle').attr('placeholder', 'Name')
    $('#add-lecturer #lecturerDescription').attr('placeholder', 'General Info')
    $('#add-lecturer #thumbnailDiv').show();
    $('#modal-thumbnail').attr('src', '/images/default/placeholder.jpeg');
    $('#add-lecturer .finish').html((edit ? "Save" : "Add Lecturer"));
    $('#add-lecturer .edit').hide();
    $('#add-lecturer .finish').show();
    $('#add-lecturer .preview').show();
    $('#add-lecturer form').attr('action', "lecturer/item");
    $('#add-lecturer .modal-add-body').show();
    $('#add-lecturer .modal-show-body').hide();
};

function displayItem(title, text, img, website) {
    $('.back').hide();
    $('#add-lecturer .modal-add-body').hide();
    $('#add-lecturer .modal-show-body').show();
    $('#add-lecturer #thumbnailDiv').show();
    $('#add-lecturer #modal-thumbnail').attr('src', img);
    $('#add-lecturer .modal-title').html(title);
    $('#modalDescription').html(text);
    $('#modalWebsite').html(website);
    $('#add-lecturer .edit').show();
    $('#add-lecturer .finish').hide();
    $('#add-lecturer .preview').hide();
    $('#add-lecturer .delete').hide();
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader    = new FileReader();
        reader.onload = function (e) {
            $('#modal-thumbnail').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$(function () {
    $('.browse').click(function () {
        var file = $(this).parent().parent().parent().find('.file');
        file.trigger('click');
    });
    $('#files').change(function () {
        readURL(this);
    });

    $('.finish').click(function (event) {
        $type = $(this).data('type');
        if (confirm("Are you sure that you want to " + $type + "?")) {
            if (!$('#lecturerDescription').val() || !$('#lecturerTitle').val()) {
                event.preventDefault();
                alert("Please fill in a Name and content");
            }
            //if the avatar was modified delete old lecturer and create new one
            //as files can only be passed through a post and not a put
            else if (($type == "edit") && ($('#files').val())) {
                $.ajax({
                    url: 'lecturer/item' + '?id=' + $('#add-lecturer').data('id'),
                    type: 'DELETE',
                    success: function (result) {
                        location.reload();

                    }
                });
            }
            //if the avatar was not modified just update the db document.
            else if (($type == "edit") && !($('#files').val())) {
                event.preventDefault();
                $.ajax({
                    url: 'lecturer/item' + '?id=' + $('#add-lecturer').data('id') + '&description=' + $('#lecturerDescription').val() + '&title=' + $('#lecturerTitle').val() + '&imagepath=' + $('#modal-thumbnail').attr('src') + '&website=' + $('#lecturerWebsite').val(),
                    type: 'PUT',
                    success: function (result) {
                        location.reload();
                    }
                });
            }
        } else {
            event.preventDefault();
        }
    });
    $('.back').click(function () {
        $("#files").trigger("change");
        addNewItem(false);
    });
    $('#add-lecturer .delete').click(function () {
        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                url: 'lecturer/item' + '?id=' + $('#add-lecturer').data('id'),
                type: 'DELETE',
                success: function (result) {
                    location.reload();

                }
            });
            event.preventDefault();
        } else {
            event.preventDefault();
        }

    });

    $('.edit').click(function () {
        var editTitleValue   = $('#add-lecturer .modal-title').text();
        var editTextValue    = $('#modalDescription').html();
        var editWebsiteValue = $('#modalWebsite').html();
        var editImgValue     = $('#add-lecturer #modal-thumbnail').attr('src');
        addNewItem(true);
        $('#add-lecturer form').attr('action', 'lecturer/item');
        $('#lecturerTitle').val(editTitleValue);
        $('#lecturerDescription').val(editTextValue);
        $('#lecturerWebsite').val(editWebsiteValue);
        $('#modal-thumbnail').attr('src', editImgValue);
    });

    $('.preview').click(function () {

        $add = $('#add-lecturer').data('show');
        displayItem($('#lecturerTitle').val(), $('#lecturerDescription').val(), $('#modal-thumbnail').attr('src'), $('#lecturerWebsite').val());
        if ($add == 'new') {
            $('.back').show();
            $('.edit').hide();
        }

    });
    $('.open-modal').click(function () {
        $('#add-lecturer').data('id', $(this).data('id'));
        $('#add-lecturer .delete').hide();
        if ($(this).data("show") != "overview") {
            addNewItem(false);
            $('#lecturerTitle').val('');
            $('#lecturerDescription').val('');
            $('#lecturerWebsite').val('');
            $('#add-lecturer').data('show', 'new');
        } else {
            $('#add-lecturer').data('show', 'known');
            displayItem($(this).find('h4.title').html(), $(this).find('.data-text').html(), $(this).find('.img-thumbnail').attr('src'), $(this).find('.website').html());
        }
    });
});
