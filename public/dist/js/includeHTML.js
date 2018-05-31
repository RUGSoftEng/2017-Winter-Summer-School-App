$(function (){
	const includes = $("[data-html-file]");
	jQuery.each(includes, function (){
		const file = "views/" + $(this).data("html-file") + ".html";
		$(this).load(file);
	});
});