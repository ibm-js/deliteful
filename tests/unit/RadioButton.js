define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"decor/sniff",
	"delite/register",
	"deliteful/RadioButton",
	"./resources/Checkbox-shared"
], function (dcl, registerSuite, assert, has, register, RadioButton, commonSuite) {

	var container,
		html = "<form id='form1'>" +
			"<d-radio-button id='rb1' value='rb1' name='choice'></d-radio-button>" +
			"<d-radio-button id='rb2' value='rb2' name='choice' checked='true'></d-radio-button>" +
			"<d-radio-button id='rb3' value='rb3' name='choice'></d-radio-button>" +
			"<label id='lbl4' for='rb3'></label></form>" +
			"<d-radio-button id='rb4'></d-radio-button>";

	var suite = {
		setup: function () {
			dcl.mix(commonSuite, {
				baseClass: "d-radio-button",
				defaultWidget: "rb4",
				labelForTarget: "rb3",
				inputType: "radio"
			});
		},

		"init state": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var rb = document.getElementById("rb4");
				var elt = rb.querySelector("input[type='radio']");
				assert.ok(elt, "Missing wrapped input element.");
				assert.strictEqual(rb.valueNode, rb.firstChild, "Unexpected value for 'valueNode' property.");
				assert.strictEqual(rb.valueNode, rb.focusNode, "Unexpected value for 'focusNode' property.");
				rb = document.getElementById("rb3");
				assert.strictEqual(rb.value, "rb3",
					"Unexpected default value for 'value' property if 'value' specified/unchecked");
				assert.strictEqual(rb.value, rb.valueNode.value,
					"Unexpected value for 'rb3' wrapped input 'value' property.");
				assert.strictEqual(rb.name, "choice",
					"Unexpected default value for 'value' property if 'value' specified/unchecked");
				assert.strictEqual(rb.name, rb.valueNode.name,
					"Unexpected value for 'rb3' wrapped input 'name' property.");
				rb = document.getElementById("rb2");
				assert.ok(rb.checked, "Unexpected default value for 'checked' property if 'checked' specified.");
			}), 300);
			return d;
		},

		"checked (RadioButton)": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var rb = document.getElementById("rb1"),
					inp = rb.valueNode;
				rb.checked = true;
				rb.deliver();
				rb = document.getElementById("rb1");
				assert.isTrue(rb.checked, "Unexpected value for 'checked' property after set.");
				assert.strictEqual(rb.checked, inp.checked,
					"Unexpected value for 'checked' property of wrapped input.");
				// check it's the only checked button in the form
				var rb2 = document.getElementById("rb2");
				assert.isFalse(rb2.checked, "Unexpected value for rb2 'checked' property after set.");
				assert.isFalse(rb2.valueNode.checked, "Unexpected value for rb2 'checked' property of wrapped input.");
				var rb3 = document.getElementById("rb3");
				assert.isFalse(rb3.checked, "Unexpected value for rb3 'checked' property after set.");
				assert.isFalse(rb3.valueNode.checked, "Unexpected value for rb3 'checked' property of wrapped input.");
			}), 100);
			return d;
		},

		"toggle": function () {
			// a checked radio button should not be unchecked by toggle
			var rb = document.getElementById("rb2");
			rb.toggle();
			rb.deliver();
			assert.isTrue(rb.checked, "Unexpected value for 'checked' property after toggle() on rb2");
			rb = document.getElementById("rb1");
			rb.toggle();
			rb.deliver();
			assert.isTrue(rb.checked, "Unexpected value for 'checked' property after toggle() on rb1");
		},

		// overrides shared impl.
		"changeEvent (RadioButton)": function () {
			var d = this.async(1000);
			setTimeout(d.callback(function () {
				var rb3 = document.getElementById("rb3"),
					lbl4 = document.getElementById("lbl4"),
					fired = false;
				rb3.on("change", function () {
					fired = true;
				});
				rb3.focusNode.click();
				assert.isTrue(fired, "Missing 'change' event when input node is clicked.");
				fired = false;
				var rb1 = document.getElementById("rb1");
				rb1.checked = true;
				rb1.deliver();
				lbl4.click();
				assert.isTrue(fired, "Missing 'change' event when labelFor is clicked.");
			}));
			return d;
		},

		"on-click": function () {
			// test issue raised in https://bugs.dojotoolkit.org/ticket/17613
			var d = this.async(1000),
				rb3 = document.getElementById("rb3");
			setTimeout(d.rejectOnError(function () {
				rb3.on("click", function () {
					assert.isTrue(rb3.checked, "Unexpected checked state for rb3 after in rb3 on-click handler");
					assert.isTrue(rb3.focusNode.checked,
						"Unexpected checked state for rb3's wrapped input in rb3 on-click handler");
					["rb1", "rb2"].forEach(function (rb) {
						rb = document.getElementById(rb);
						assert.isFalse(rb.checked,
								"Unexpected checked state for " + rb.id + " in rb3 on-click handler");
						assert.isFalse(rb.focusNode.checked,
								"Unexpected checked state for " + rb.id + "'s wrapped input in rb3 on-click handler");
					});
				});
				setTimeout(d.callback(function () {
					rb3.focusNode.click();
				}), 300);
			}), 300);
			return d;
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};
	dcl.mix(suite, commonSuite.testCases);

	// Markup
	var markupSuite = {
		name: "deliteful/RadioButton: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.parse();
		}
	};
	dcl.mix(markupSuite, suite);
	registerSuite(markupSuite);

	var progSuite = {
		name: "deliteful/RadioButton: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var form = document.createElement("form");
			form.id = "form1";
			container.appendChild(form);
			
			var rb = new RadioButton({id: "rb1", value: "rb1", name: "choice"});
			form.appendChild(rb);
			rb.attachedCallback();
			rb = new RadioButton({id: "rb2", value: "rb2", checked: true, name: "choice"});
			form.appendChild(rb);
			rb.attachedCallback();
			var lbl4 = document.createElement("label");
			lbl4.id = "lbl4";
			lbl4.setAttribute("for", "rb3");
			lbl4.textContent = "rb3";
			container.appendChild(lbl4);
			rb = new RadioButton({id: "rb3", value: "rb3", name: "choice"});
			form.appendChild(rb);
			rb.attachedCallback();
			rb = new RadioButton({id: "rb4"});
			container.appendChild(rb);
			rb.attachedCallback();
		}
	};
	dcl.mix(progSuite, suite);
	registerSuite(progSuite);
});