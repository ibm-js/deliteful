define([
	"dojo/_base/declare",
	"./_WidgetBase",
	"./_CssStateMixin",
	"./handlebars!./templates/ExampleWidget.html",
	"./themes/load!ExampleWidget"	// inserts the CSS for this widget for page's theme
], function(declare, _WidgetBase, _CssStateMixin, renderer){

	return declare([_WidgetBase, _CssStateMixin], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "duiExampleWidget"
	});
});