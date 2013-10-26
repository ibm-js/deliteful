define([
	"dojo/_base/declare",
	"../Contained",
	"../Widget"
], function(declare, Contained, Widget){

	// module:
	//		dui/mobile/Pane

	return declare("dui.mobile.Pane", [Widget, Contained], {
		// summary:
		//		A simple pane widget.
		// description:
		//		Pane is a simple general-purpose pane widget.
		//		It is a widget, but can be regarded as a simple `<div>` element.

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiPane",

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// set containerNode so that getChildren() works
				this.containerNode = this.domNode;
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.getChildren().forEach(function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});
