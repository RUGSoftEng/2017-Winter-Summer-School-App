$(document).ready(function () {
    $('.change-announcement').click(function () {
        var description = $(this).data('description');
        var poster      = $(this).data('poster');
        var title       = $(this).data('title');
        $('#changingTitle').html(title);
        $('#changingDescription').html(description);
        $('#changingPoster').html("Posted by:" + poster);
    });
});
