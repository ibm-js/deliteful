define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-class",
	"dui/register",
	"dui/CssState",
], function (registerSuite, assert, domClass, register, CssState) {
	registerSuite({
		name: "CssState",
		"basic" : function () {
			var CssWidget = register("css-widget", [HTMLElement, CssState], {
				baseClass: "duiCss foo",
				state: "",
				disabled: false,
				checked: false
			});

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
