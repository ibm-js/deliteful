define([
	"require",
	"dojo/_base/declare", // declare
	"dojo/has",
	"dojo/keys", // keys.LEFT_ARROW keys.RIGHT_ARROW
	"../Widget",
	"../Container",
	"../KeyNav",
	"../_TemplatedMixin"
], function(require, declare, has, keys, Widget, Container, _KeyNavMixin, _TemplatedMixin){

	// module:
	//		dui/Toolbar

	return declare("dui.Toolbar", [Widget, _TemplatedMixin, Container, KeyNav], {
		// summary:
		//		A Toolbar widget, used to hold things like `dui/Editor` buttons

		templateString:
			'<div class="dui" role="toolbar" tabIndex="${tabIndex}" data-dojo-attach-point="containerNode">' +
			'</div>',

		baseClass: "duiToolbar",

		_onLeftArrow: function(){
			this.focusPrev();
		},

		_onRightArrow: function(){
			this.focusNext();
		}
	});
});
