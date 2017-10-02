$('.delete-school').click(function () {
	$.ajax({
		url: '/school/?id=' + $(this).data('id'),
		type: 'DELETE',
		success: function (result) {
			window.location.href = window.location.href + '?_s=t';
		},
		error: function () {
			window.location.href = window.location.href + '?_s=f';
		}
	});

});

new InputValidator('#code', new CodeValidator());
