define([
	"dcl/dcl",
	"dojo/dom-class", // domClass.toggle
	"./Widget"
], function (dcl, domClass, Widget) {

	// module:
	//		dui/CssState

	return dcl(Widget, {
		// summary:
		//		Update the visual state of the widget by setting CSS classes on widget root node
		//		by combining this.baseClass with various suffixes that represent the current widget state(s).
		//		For example, it sets classes like duiToggleButtonChecked.
		//
		//		The widget may have one or more of the following states, determined
		//		by this.state, this.checked, this.valid, this.selected, this.focused, this.opened,
		//		this.disabled and this.readOnly:
		//
		//		- Error - ValidationTextBox sets this.state to "Error" if the current input value is invalid
		//		- Incomplete - ValidationTextBox sets this.state to "Incomplete" if the current input value
		//		  is not finished yet
		//		- Checked - ex: a checkmark or a ToggleButton in a checked state, will have this.checked==true
		//		- Selected - ex: currently selected tab will have this.selected==true
		//		- Disabled - if the widget is disabled
		//		- ReadOnly - if the widget is read only
		//		- Focused - if the widget root node or a descendant node has focus, or was recently clicked

		// cssProps: String[]
		//		List of properties to watch
		booleanCssProps: ["disabled", "readOnly", "selected", "focused", "opened"],

		postCreate: function () {
			var self = this, baseClasses = this.baseClass.split(" ");

			function toggleClasses(/*String*/ modifier, /*Boolean*/ condition) {
				if (!modifier) {
					return;
				}
				var classes = baseClasses.map(function (c) {
					return c + modifier[0].toUpperCase() + modifier.substr(1);
				});
				domClass.toggle(self, classes, condition);
			}

			// Monitoring changes to disabled, readonly, etc. state, and update CSS class of root node
			this.booleanCssProps.forEach(function (name) {
				this.watch(name, function (name, oval, nval) {
					toggleClasses(name, nval);
				});
			}, this);
			this.watch("checked", function (name, oval, nval) {
				toggleClasses(oval === "mixed" ? "mixed" : "checked", false);
				toggleClasses(nval === "mixed" ? "mixed" : "checked", nval);
			});
			this.watch("state", function (name, oval, nval) {
				toggleClasses(oval, false);
				toggleClasses(nval, true);
			});
		}
	});
});
