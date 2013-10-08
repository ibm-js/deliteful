define([
	"./register",
	"./_WidgetBase",
	"./_CssStateMixin",
	"./handlebars!./templates/ExampleWidget.html",
	"./themes/load!ExampleWidget"	// inserts the CSS for this widget for page's theme
], function(register, _WidgetBase, _CssStateMixin, renderer){

	return register("dui-example", [_WidgetBase, _CssStateMixin], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "duiExampleWidget"
	});
});