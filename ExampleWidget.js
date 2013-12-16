define([
	"./register",
	"./CssState",
	"./handlebars!./templates/ExampleWidget.html",
	"./themes/load!./themes/{{theme}}/ExampleWidget",	// inserts the CSS for this widget for page's theme
	"dojo/has!dojo-bidi?./themes/load!./themes/{{theme}}/ExampleWidget_rtl"
], function (register, CssState, renderer) {

	return register("d-example", [HTMLElement, CssState], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "d-example-widget"
	});
});