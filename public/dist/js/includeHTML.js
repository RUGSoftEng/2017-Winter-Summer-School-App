$(function(){
	var includes = $('[data-html-file]');
	jQuery.each(includes, function(){
		var file = 'views/' + $(this).data('html-file') + '.html';
		$(this).load(file);
	});
});