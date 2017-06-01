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
});


new InputValidator('#username', new UsernameValidator());
new InputValidator('#password', new PasswordValidator());

$('#cpassword').focusout(function () {
    var valid = $('#cpassword').val() === $('#password').val();
    alterInputStyling('#cpassword', 'Passwords do not match.', valid);
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