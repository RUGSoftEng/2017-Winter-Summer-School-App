var UserRights = {
	admin: ["ACCESS_MAIN_OVERVIEW"],
	coordinator: []
}

exports.userHasRights = function(user, name) {
	return user.rank ? UserRights[user.rank].indexOf(name) > -1 : false;
};


