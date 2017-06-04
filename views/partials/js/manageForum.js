$('.deleteAccount').click(function () {
    var type = $(this).data('type');
    var link;
    if(type === 'comment'){
        link = '/forum/comment/item?threadID='+ $(this).data('thread')+'&arrayPos='+$(this).data('comment');
    }
    else{
        link = '/forum/thread/item?threadID='+$(this).data('id');
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
