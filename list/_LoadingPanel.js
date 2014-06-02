define(["dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars",
	"requirejs-text/text!./List/_LoadingPanel.html",
	"../ProgressIndicator"
], function (dcl, register, Widget, handlebars, template) {

	// module:
	//		deliteful/list/_LoadingPanel

	var _LoadingPanel = dcl([Widget], {
		// summary:
		//		A widget that renders a panel masking a list and displaying a progress indicator and a message.

		// message: String
		//		The message to display
		message: "",

		buildRendering: handlebars.compile(template)

	});

	return register("d-list-loading-panel", [HTMLElement, _LoadingPanel]);

});