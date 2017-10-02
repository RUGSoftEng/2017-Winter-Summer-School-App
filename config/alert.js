/* The Alert class is used to display messages on the webpage. These messages
 * can either indicate the error or success of an action.
 *
 * Usage:
 * Once an action has been performed that requires an alert object, then an
 * Alert object should be instantiated with an appropriate message and a boolean
 * indicating whether the action was succesful or not.
 *
 * Before redirecting to another page, the passToNextPage function should be called
 * on the Alert object.
 * For example:
 * 	var a = new Alert(false, "error");
 *	a.passToNextPage(req);
 *  res.redirect('/main');
 *
 * The controller belonging to the page to which you are redirected should create
 * an empty Alert object and initiate it. It should then pass it to the render function
 * as a variable under the name 'alert'. Note that the alert will only be displayed if
 * the file that is being rendered includes alertMessage.ejs at an appropriate place.
 * For example:
 * 	var alert = new Alert();
 * 	alert.initiate(req);
 * 	res.render('loggedIn.ejs', {
 *     alert: alert 	//this could cause issues due to asynchronous execution
 * 	});
 */


function Alert(success, message) {
	this.success = success;
	this.message = message;
}

Alert.prototype.passToNextPage = function (req) {
	req.session.success      = this.success;
	req.session.errorMessage = this.message;
};


Alert.prototype.initiate = function (req) {
	this.success             = req.session.success;
	this.message             = req.session.errorMessage;
	req.session.success      = null;
	req.session.errorMessage = null;
};


module.exports = Alert;
