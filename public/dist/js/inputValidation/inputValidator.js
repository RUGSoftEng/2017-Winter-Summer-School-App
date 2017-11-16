/*
 *  The inputValidator class is used to test input against certain constraints.
 *
 */

function InputValidator(selector, validator) {
	this.id     = selector;
	this.result = handleInput(selector, validator);
}

function handleInput(selector, validator) {
	$(selector).focusout(function () {
		var value   = $(selector).val();
		var isValid = validator.test(value);
		alterInputStyling(selector, validator.getDescription(), isValid);
		return isValid;
	});
}

function toggleAddButton(isValid) {
	/*if(isValid)
	 $('.finish').removeClass('disabledPop');
	 else
	 $('.finish').addClass('disabledPop');
	 */
}
function alterInputStyling(selector, text, isValid) {
	setHelpMessage(selector, text);
	toggleHelpBlock(selector, isValid);
	setInputColor(selector, isValid);
	toggleAddButton(isValid);
}

function setHelpMessage(selector, description) {
	$(selector).next().children('span:last-child').text(description);
}

function setInputColor(selector, isValid) {
	if (isValid) {
		$(selector).parent().removeClass('has-error');
		$(selector).parent().addClass('has-success');
	} else {
		$(selector).parent().addClass('has-error');
		$(selector).parent().removeClass('has-success');
	}
}

function toggleHelpBlock(selector, isValid) {
	var helpBlock = $(selector).next();
	if (isValid)
		helpBlock.hide();
	else
		helpBlock.show();
}
