$('.deleteAccount').click(function () {
    $.ajax({
        url: '/loginCode/?id=' + $(this).data('id'),
        type: 'DELETE',
        success: function (result) {
            location.reload();
        },
        error: function () {
            alert('Error: could not delete login code.');
        }
    });

});

$('#code').focusout(function() {

})
