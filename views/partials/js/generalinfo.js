$(document).ready(function () {
	$('.change-generalinfo').click(function () {
		var description = $(this).data('description');
		var poster      = $(this).data('poster');
		$('#changingDescription').html(description);
	});
});
