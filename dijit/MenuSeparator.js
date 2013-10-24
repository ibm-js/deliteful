define([
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"../Widget",
	"../_TemplatedMixin",
	"../Contained",
	"dojo/text!./templates/MenuSeparator.html"
], function(declare, dom, Widget, _TemplatedMixin, Contained, template){

	// module:
	//		dui/MenuSeparator

	return declare("dui.MenuSeparator", [Widget, _TemplatedMixin, Contained], {
		// summary:
		//		A line between two menu items

		templateString: template,

		buildRendering: function(){
			this.inherited(arguments);
			dom.setSelectable(this.domNode, false);
		},

		isFocusable: function(){
			// summary:
			//		Override to always return false
			// tags:
			//		protected

			return false; // Boolean
		}
	});
});
