define([
	"./register",
	"./CssState",
	"./handlebars!./ExampleWidget/ExampleWidget.html",
	"./themes/load!./ExampleWidget/themes/{{theme}}/ExampleWidget_css",
	"dojo/has!dojo-bidi?./themes/load!./ExampleWidget/themes/{{theme}}/ExampleWidget_rtl_css"
], function (register, CssState, renderer) {

	return register("d-example", [HTMLElement, CssState], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		buildRendering: renderer,

		baseClass: "d-example-widget"
	});
});