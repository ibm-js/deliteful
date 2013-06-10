define([
	"require",
	"dojo/_base/declare", // declare
	"dojo/has",
	"dojo/keys", // keys.LEFT_ARROW keys.RIGHT_ARROW
	"./_WidgetBase",
	"./_KeyNavContainer",
	"./_TemplatedMixin"
], function(require, declare, has, keys, _WidgetBase, _KeyNavContainer, _TemplatedMixin){

	// module:
	//		dijit/Toolbar

	return declare("dijit.Toolbar", [_WidgetBase, _TemplatedMixin, _KeyNavContainer], {
		// summary:
		//		A Toolbar widget, used to hold things like `dijit/Editor` buttons

		templateString:
			'<div class="dijit" role="toolbar" tabIndex="${tabIndex}" data-dojo-attach-point="containerNode">' +
			'</div>',

		baseClass: "dijitToolbar",

		_onLeftArrow: function(){
			this.focusPrev();
		},

		_onRightArrow: function(){
			this.focusNext();
		}
	});
});
