define([
	"dojo/_base/declare",
	"./_WidgetBase",
	"./_CssStateMixin",
	"./_TemplatedMixin",
	"./themes/load!ExampleWidget"	// inserts the CSS for this widget for page's theme
], function(declare, _WidgetBase, _CssStateMixin, _TemplatedMixin){

	return declare([_WidgetBase, _CssStateMixin, _TemplatedMixin], {
		// summary:
		//		Example widget for testing and as template for new widgets.

		baseClass: "duiExampleWidget",

		templateString: "<span>Example Widget</span>"
	});
});