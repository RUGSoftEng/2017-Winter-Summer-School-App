$('.deleteAccount').click(function () {
    var type = $(this).data('type');
    var link;
    if(type === 'comment')
        link = '/forum/comment/item?id=';
    else
        link = '/forum/thread/item?id=';
    $.ajax({
        url: link + $(this).data('id'),
        type: 'DELETE',
        success: function (result) {
            location.reload();
        },
        error: function () {
            alert('Error: could not delete login code.');
        }
    });

});
