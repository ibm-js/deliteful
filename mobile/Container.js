define([
	"dojo/_base/declare",
	"dui/_Container",
	"./Pane"
], function(declare, Container, Pane){

	// module:
	//		dui/mobile/Container

	return declare("dui.mobile.Container", [Pane, Container], {
		// summary:
		//		A simple container-type widget.
		// description:
		//		Container is a simple general-purpose container widget.
		//		It is a widget, but can be regarded as a simple `<div>` element.

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiContainer"
	});
});
