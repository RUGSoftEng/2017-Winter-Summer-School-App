$('.deleteForumItem').click(function () {
	var type = $(this).data('type');
	var link;
	if (type === 'comment') {
		link = 'API/forum/comment?threadID=' + $(this).data('thread') + '&commentID=' + $(this).data('id');
	} else {
		link = 'API/forum/thread?threadID=' + $(this).data('id');
	}
	$.ajax({
		url: link,
		type: 'DELETE',
		success: function (result) {
			location.reload();
		},
		error: function () {
			alert('Error: could not delete forum item.');
		}
	});

});
