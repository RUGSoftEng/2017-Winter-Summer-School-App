$('.nav-tabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})

$('.finish').click(function (e) {
    if ($('#cpassword').val() != $('#password').val()) {
        e.preventDefault();
        $('#cpassword').parent().addClass('has-error');
        $('#cpassword').next().show();
    }
})

$('#username').focusout(function () {
    if (!/^[a-z]{5,20}$/.test($(this).val())) { //only lower-case letters with at least 5 characters and no more than 20 characters
        $('#username').parent().addClass('has-error');
        $('#username').parent().removeClass('has-success');
        $('#username').next().show();
    } else {
        $('#username').parent().removeClass('has-error');
        $('#username').parent().addClass('has-success');
        $('#username').next().hide();
    }
});
$('#cpassword').focusout(function () {
    if ($('#cpassword').val() != $('#password').val()) {
        $('#cpassword').parent().removeClass('has-success');
        $('#cpassword').parent().addClass('has-error');
        $('#cpassword').next().show();
    } else {
        $('#cpassword').parent().removeClass('has-error');
        $('#username').parent().addClass('has-success');
        $('#cpassword').next().hide();
    }
});

$('.deleteAccount').click(function () {
    $.ajax({
        url: '/admin/?id=' + $(this).data('id'),
        type: 'DELETE',
        success: function (result) {
            location.reload();
        },
        error: function () {
            alert('Error: could not delete account.');
        }
    });

});

$(function () {
    $('[data-toggle=\'tooltip\']').tooltip({
        container: 'body',
        template: '<div class=\'tooltip\' role=\'tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>'
    })
})