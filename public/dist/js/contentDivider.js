$(document).ready(function () {
	const items = $("#content > button");
	const numItems = items.length;
	const perPage = 5;
	let multiplier = 1;
	items.slice(perPage).hide();
	$(".next").click(function () {
		if ((multiplier + 1) * perPage <= numItems + perPage - 1) {
			items.hide();
			$("#list-header").show();
			items.slice(perPage * multiplier, perPage * (multiplier + 1)).show();
			multiplier++;
		}
	});
	$(".previous").click(function () {
		if (multiplier - 1 > 0) {
			multiplier--;
			items.hide();
			$("#list-header").show();
			items.slice(perPage * (multiplier - 1), perPage * multiplier).show();
		}
	});
});
