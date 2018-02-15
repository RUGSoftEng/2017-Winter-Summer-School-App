var modalSelector       = '#add-lecturer ';
var titleSelector       = '#lecturerTitle';
var descriptionSelector = '#lecturerDescription';

function emptyContainer(selector) {
	$(selector).val('');
}

function openModal($event) {
	$('#add-lecturer').data('id', $($event).data('id'));
	toggleButtons('d');
	if ($($event).data("show") != "overview") {
		addNewItem(false);
		emptyContainer(titleSelector);
		emptyContainer(descriptionSelector);
		emptyContainer('#lecturerWebsite');
		$('#add-lecturer').data('show', 'new');
	} else {
		$('#add-lecturer').data('show', 'known');
		displayItem($($event).find('h4.title').html(), $($event).find('.data-text').html(), $($event).find('.img-thumbnail').attr('src'), $($event).find('.website').html());
	}
}

function addNewItem(edit) {
	toggleButtons('bdeFP');
	getButton('f').data('type', edit ? 'edit' : 'add');
	$('#add-lecturer .modal-title').html("<p>" + (edit ? "Edit Lecturer" : "Add Lecturer") + "</p>");
	$('.description-form').show();
	$('#section-header').html("Lecturer Name");
	$(titleSelector).attr('placeholder', 'Name');
	$(descriptionSelector).attr('placeholder', 'General Info');
	$('#thumbnailDiv').show();
	$('#modal-thumbnail').attr('src', '/images/default/placeholder.png');
	getButton('f').html((edit ? "Save" : "Add Lecturer"));
	$('#add-lecturer form').attr('action', "API/lecturer");
	toggleShow(false);
};

function displayItem(title, text, img, website) {
	$('#add-lecturer #thumbnailDiv').show();
	$('#add-lecturer #modal-thumbnail').attr('src', img);
	$('#add-lecturer .modal-title').html(title);
	$('#modalDescription').html(text);
	$('#modalWebsite').html(website);
	toggleShow(true);
	toggleButtons('bEfpD');
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
	$('#lecturerDescription').markItUp(mySettings);
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
					url: 'API/lecturer' + '?id=' + $('#add-lecturer').data('id'),
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
					url: 'API/lecturer' + '?id=' + $('#add-lecturer').data('id') + '&description=' + $('#lecturerDescription').val() + '&title=' + $('#lecturerTitle').val() + '&imagepath=' + $('#modal-thumbnail').attr('src') + '&website=' + $('#lecturerWebsite').val(),
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
	$('.delete').click(function (event) {
		if (confirm("Are you sure you want to delete?")) {
			$.ajax({
				url: 'API/lecturer' + '?id=' + $('#add-lecturer').data('id'),
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
		$('#add-lecturer form').attr('action', 'API/lecturer');
		$('#lecturerTitle').val(editTitleValue);
		$('#lecturerDescription').val(editTextValue);
		$('#lecturerWebsite').val(editWebsiteValue);
		$('#modal-thumbnail').attr('src', editImgValue);
	});

	$('.preview').click(function () {
		$add = $('#add-lecturer').data('show');
		displayItem($('#lecturerTitle').val(), $('#lecturerDescription').val(), $('#modal-thumbnail').attr('src'), $('#lecturerWebsite').val());
		if ($add == 'new') {
			toggleButtons('Be');
		}

	});
	$('.open-modal').click(function () {
		openModal(this);
	});
});
