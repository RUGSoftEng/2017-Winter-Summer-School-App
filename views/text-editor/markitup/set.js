// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Html tags
// http://en.wikipedia.org/wiki/html
// ----------------------------------------------------------------------------
// Basic set. Feel free to add more tags
// ----------------------------------------------------------------------------
var mySettings = {
	onShiftEnter: {keepDefault: false, replaceWith: '<br>\n'},
	onEnter: {keepDefault: false, replaceWith: '<br>\n'},
	onCtrlEnter: {keepDefault: false, openWith: '<p>', closeWith: '</p>'},
	onTab: {keepDefault: false, replaceWith: '    '},
	markupSet: [

		{name: 'header', key: 'H', openWith: '<h4>', closeWith: '</h4>'},
		{name: 'text-height', key: 'E', openWith: '<br>\n', closeWith: ''},
		{separator: '---------------'},
		{name: 'bold', key: 'B', openWith: '(!(<strong>|!|<b>)!)', closeWith: '(!(</strong>|!|</b>)!)'},
		{name: 'italic', key: 'I', openWith: '(!(<em>|!|<i>)!)', closeWith: '(!(</em>|!|</i>)!)'},
		{name: 'strikethrough', key: 'S', openWith: '<del>', closeWith: '</del>'},
		{name: 'underline', key: 'U', openWith: '<u>', closeWith: '</u>'},
		{separator: '---------------'},
		{
			name: 'list-ul',
			openWith: '    <li>',
			closeWith: '</li>',
			multiline: true,
			openBlockWith: '<ul>\n',
			closeBlockWith: '\n</ul>'
		},
		{
			name: 'list-ol',
			openWith: '    <li>',
			closeWith: '</li>',
			multiline: true,
			openBlockWith: '<ol>\n',
			closeBlockWith: '\n</ol>'
		},
		{name: 'minus', key: 'W', openWith: '	<li>', closeWith: '	</li>\n'},
		{separator: '---------------'},

		//{name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
		{
			name: 'link',
			key: 'L',
			openWith: '<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>',
			closeWith: '</a>',
			placeHolder: 'Your text to link...'
		}

		//{name:'Clean', className:'clean', replaceWith:function(markitup) { return markitup.selection.replace(/<(.*?)>/g, "") } },		
		//{name:'Preview', className:'preview',  call:'preview'}
	]
}
