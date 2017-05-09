$(function() {
	$('#manageModal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget); // Button that triggered the modal

	  var modal = $(this);
	  modal.find('.modal-title').text(button.data('title'));
	  modal.find('.finish').text(button.data('button'));
	});
	
	$('#manageModal').on('hide.bs.modal', function (event) {
	  var button = $(event.relatedTarget); // Button that triggered the modal

	  var modal = $(this);
	  modal.find('.modal-title').text(button.data('title'));
	  modal.find('.finish').text(button.data('button'));
	});
	
});


