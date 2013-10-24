define([
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"../Widget",
	"../_TemplatedMixin"
], function(declare, dom, Widget, _TemplatedMixin){

	// module:
	//		dui/ToolbarSeparator


	return declare("dui.ToolbarSeparator", [Widget, _TemplatedMixin], {
		// summary:
		//		A spacer between two `dui.Toolbar` items

		templateString: '<div class="duiToolbarSeparator duiInline" role="presentation"></div>',

		buildRendering: function(){
			this.inherited(arguments);
			dom.setSelectable(this.domNode, false);
		},

		isFocusable: function(){
			// summary:
			//		This widget isn't focusable, so pass along that fact.
			// tags:
			//		protected
			return false;
		}
	});
});
