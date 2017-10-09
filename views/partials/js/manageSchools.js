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

$('[data-toggle=\'tooltip\']').tooltip({
	container: 'body',
	template: '<div class=\'tooltip\' role=\'tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>'
});
