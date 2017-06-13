function Validator(regExp, constraintDescription) {
    this.regExp                = regExp;
    this.constraintDescription = constraintDescription;
    this.getRegExp             = function () {
        return this.regExp;
    };
    this.getDescription        = function () {
        return this.constraintDescription;
    };
    this.test                  = function (val) {
        return this.regExp.test(val);
    }
}

function UsernameValidator() {
    this.regExp                = /^[a-z]{5,20}$/;
    this.constraintDescription = 'A username may only contain lowercase letters and should contain between 5 and 20 characters.';
}

function PasswordValidator() {
    this.regExp                = /^[a-zA-Z0-9!@#$]{8,16}$/;
    this.constraintDescription = 'A password should be between 8 and 16 characters and may only contain the characters: a-z A-Z 0-9 !@#$';
}

function CodeValidator() {
    this.regExp                = /^[a-z0-9]{8}$/;
    this.constraintDescription = 'A code needs to be 8 characters long and can only consist of numbers and lower case letters.';
}

UsernameValidator.prototype = new Validator();
PasswordValidator.prototype = new Validator();
CodeValidator.prototype     = new Validator();

