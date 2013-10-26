define([
	"./register",
	"./CssState",
	"./handlebars!./templates/ExampleWidget.html",
	"./themes/load!ExampleWidget"	// inserts the CSS for this widget for page's theme
], function (register, CssState, renderer) {

	return register("d-example", CssState, {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "duiExampleWidget"
	});
});