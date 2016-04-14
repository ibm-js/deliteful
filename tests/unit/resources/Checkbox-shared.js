define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes"
], function (dcl, registerSuite, assert, register, $) {

	var commonSuite = {
		defaultWidget: "",
		baseClass: "",
		labelForTarget: "",
		inputType: ""
	};

	commonSuite.testCases = {
		"Default State": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var cb = document.getElementById(commonSuite.defaultWidget);
				assert.isTrue($(cb).hasClass(commonSuite.baseClass), "baseClass");
				assert.isFalse(cb.checked, "default value for 'checked' property");
				assert.isFalse(cb.disabled, "default value for 'disabled' property");
				assert.strictEqual(cb.value, "on", "default value for 'value' property");
				var elt = cb.querySelector("input[type='" + commonSuite.inputType + "']");
				assert.ok(elt, "Missing wrapped input element");

				// verify properties bounds in the template
				assert.strictEqual(cb.name, elt.name, "wrapped input 'name' property");
				assert.strictEqual(cb.value, elt.value, "wrapped input 'value' property");
			}), 300);
			return d;
		},

		"checked": function () {
			var cb1 = document.getElementById(commonSuite.defaultWidget),
				inp = cb1.querySelector("input"),
				old = cb1.checked;
			cb1.checked = !old;
			assert.strictEqual(cb1.checked, !old, "'checked' property after set");
			//sync template
			cb1.deliver();
			assert.strictEqual(cb1.checked, inp.checked, "'checked' property of wrapped input");
		},

		value: function () {
			var cb = document.getElementById(commonSuite.defaultWidget);
			cb.value = "foo";
			//sync template
			cb.deliver();
			assert.strictEqual(cb.querySelector("input").getAttribute("value"), "foo", "'value' attribute");
		},

		"labelFor": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var cb3 = document.getElementById(commonSuite.labelForTarget),
					lbl4 = document.getElementById("lbl4"),
					old = cb3.checked;
				// The following styling is needed for click to work on ios
				lbl4.style.cursor = "pointer";
				lbl4.click();
				cb3.deliver();
				assert.strictEqual(!old, cb3.checked, "'checked' property after labelFor click");
			}), 300);
			return d;
		},

		"changeEvent - input clicked": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var cb3 = document.getElementById(commonSuite.labelForTarget),
					fired = false,
					oldState = cb3.checked,
					newState;
				cb3.on("change", function () {
					fired = true;
					newState = cb3.checked;
				});
				cb3.focusNode.click();
				assert.isTrue(fired, "Missing 'change' event when input node is clicked");
				assert.notStrictEqual(oldState, newState,
					"'checked' property in 'change' handler");
			}), 300);
			return d;
		},

		"changeEvent - labelFor clicked": function () {
			var cb3 = document.getElementById(commonSuite.labelForTarget),
				lbl4 = document.getElementById("lbl4"),
				fired = false;
			cb3.on("change", function () {
				fired = true;
			});
			lbl4.click();
			assert.isTrue(fired, "Missing 'change' event when labelFor is clicked");
		}
	};

	return commonSuite;
});
