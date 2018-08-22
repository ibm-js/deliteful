define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/Toggle"
], function (dcl, registerSuite, assert, register, Toggle) {

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var container,
		widget,
		MyWidget = register("my-widget", [HTMLElement, Toggle], {
			preRender: function () { this.focusNode = this; }
		}),
		html = "<my-widget id='cb1'></my-widget><my-widget id='cb2' checked='true' value='foo'></my-widget>";


	var commonSuite = {

		"Default State": function () {
			var cb = document.getElementById("cb1");
			assert.isFalse(cb.checked, "Unexpected default value for 'checked' property.");
			assert.strictEqual(cb.value, "on", "Unexpected default value for 'value' property");

			var cb2 = document.getElementById("cb2");
			assert.isTrue(cb2.checked, "Unexpected default value of 'checked' if specified.");
			assert.strictEqual(cb2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");
		},

		"checked": function () {
			var cb1 = document.getElementById("cb1");
			var old = cb1.checked;
			cb1.checked = !old;
			assert.strictEqual(cb1.checked, !old, "Unexpected value for 'checked' property after set.");
		},

		toggle: function () {
			var cb1 = document.getElementById("cb1"),
				old = cb1.checked;
			cb1.toggle();
			assert.strictEqual(cb1.checked, !old, "Unexpected 'checked' value after toggle().");
			cb1.disabled = true;
			cb1.toggle();
			assert.strictEqual(cb1.checked, !old, "Unexpected 'checked' value after toggle() in disabled state.");
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	// Markup
	var suite = {
		name: "deliteful/Toggle: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		}
	};
	mix(suite, commonSuite);
	registerSuite(suite);

	// Prog
	suite = {
		name: "deliteful/Toggle: prog",

		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			widget = new MyWidget({id: "cb1"});
			widget.placeAt(container);
			widget = new MyWidget({id: "cb2", checked: true, value: "foo"});
			widget.placeAt(container);
		}
	};
	mix(suite, commonSuite);
	registerSuite(suite);

});
