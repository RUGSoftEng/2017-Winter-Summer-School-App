$(document).ready(function () {
	$('.change-announcement').click(function () {
		var description = $(this).data('description');
		var poster      = $(this).data('poster');
		var title       = $(this).data('title');
		$('#changingTitle').html(title);
		$('#changingDescription').html(description);
		$('#changingPoster').html("Posted by:" + poster);
		$('#editSection').data('title', title);
		$('#editSection').data('description', description);
		$('#editSection').data('id', $(this).data('id'));
		$('#editSection').show();
	});
	$('#announcementDescription').markItUp(mySettings);

});

function initialiseScheduleDatePicker() {
}
function initialiseScheduleButtons() {
}
