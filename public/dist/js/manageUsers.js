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

$('[data-toggle=\'tooltip\']').tooltip({
	container: 'body',
	template: '<div class=\'tooltip\' role=\'tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>'
});
