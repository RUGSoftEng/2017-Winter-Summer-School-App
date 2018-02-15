$(document).ready(function () {
	$('.change-announcement').click(function () {
		var poster      = $(this).data('poster');
		var title       = $(this).data('title');
		$('#changingTitle').html(title);
		$('#changingPoster').html("Posted by:" + poster);
		$('#innerContent > div').hide();
		$($(this).data('selector')).show();
		$('#editSection').data('title', title);
		$('#editSection').data('id', $(this).data('id'));
		$('#editSection').data('category', $(this).data('category'));
		$('#editSection').show();
	});
	$('#announcementDescription').markItUp(mySettings);

});

function initialiseScheduleDatePicker() {
}
function initialiseScheduleButtons() {
}
