define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-class",
	"dui/register",
	"dui/CssState",
], function (registerSuite, assert, domClass, register, CssState) {
	registerSuite({
		name: "dui/CssState",
		"basic" : function () {
			// Workaround problem using dcl() on native DOMNodes on FF and IE,
			// see https://github.com/uhop/dcl/issues/9.
			// After that's fixed, this should be a single register() statement.
			var CssWidgetMixin = register.dcl(CssState, {
				baseClass: "duiCss foo",
				state: "",
				disabled: false,
				checked: false
			});
			var CssWidget = register("css-widget", [HTMLElement, CssWidgetMixin], { });

			var widget = new CssWidget({
				state: "Error",
				disabled: true,
				checked: true
			});

			assert.ok(domClass.contains(widget, "duiCssError"), "error state");
			assert.ok(domClass.contains(widget, "fooDisabled"), "disabled");
			assert.ok(domClass.contains(widget, "fooChecked"), "checked");

			widget.mix({
				state: "Incomplete",
				disabled: false,
				checked: "mixed"
			});

			assert.ok(!domClass.contains(widget, "duiCssError"), "not error state");
			assert.ok(domClass.contains(widget, "duiCssIncomplete"), "incomplete state");
			assert.ok(!domClass.contains(widget, "fooDisabled"), "not disabled");
			assert.ok(domClass.contains(widget, "fooMixed"), "half checked");
			assert.ok(!domClass.contains(widget, "fooChecked"), "original checked removed");
		}
	});
});
