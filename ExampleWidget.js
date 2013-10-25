define([
	"./register",
	"./Widget",
	"./CssState",
	"./handlebars!./templates/ExampleWidget.html",
	"./themes/load!ExampleWidget"	// inserts the CSS for this widget for page's theme
], function (register, Widget, _CssStateMixin, renderer) {

	return register("d-example", [Widget, CssState], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "duiExampleWidget"
	});
});