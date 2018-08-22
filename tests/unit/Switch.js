define([
	"dcl/dcl",
	"dcl/advise",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"deliteful/Switch",
	"./resources/Checkbox-shared"
], function (dcl, advise, registerSuite, assert, register, $, Switch, commonSuite) {

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var container,
		html = "<d-switch id='sw1'></d-switch>" +
			"<d-switch id='sw2' checked='true' value='foo' name='sw2' disabled='true'" +
			"checkedLabel='ON' uncheckedLabel='OFF'></d-switch>" +
			"<d-switch id='sw3'></d-switch><label id='lbl4' for='sw3-input'>Foo</label>";

	var suite = {

		setup: function () {
			mix(commonSuite, {
				baseClass: "d-switch",
				defaultWidget: "sw1",
				labelForTarget: "sw3",
				inputType: "checkbox"
			});
		},

		"Default State (Switch)": function () {
			var sw1 = document.getElementById("sw1");
			assert.isTrue($(sw1).hasClass("d-switch-width"), "Missing d-switch-width class.");
			assert.isTrue($(sw1).hasClass("d-switch-rounded"), "Missing d-switch-rounded class.");
			assert.strictEqual(sw1.checkedLabel, "", "Unexpected default value for 'checkedLabel' property.");
			assert.strictEqual(sw1.uncheckedLabel, "", "Unexpected default value for 'uncheckedLabel' property.");
			var elt = sw1.querySelector("input[type='checkbox']");
			assert.ok(elt, "Missing wrapped input element.");
			// verify properties bounds in the template
			assert.notOk(elt.getAttribute("disabled"), sw1.disabled.toString(),
				"Unexpected 'disabled' attribute value for wrapped input.");
		},

		"Attach Point": function () {
			// verify attachPoint
			var sw1 = document.getElementById("sw1");
			assert.strictEqual(sw1.focusNode, sw1.querySelector("input[type='checkbox']"),
				"Unexpected value for 'focusNode' attach point.");
			assert.strictEqual(sw1.valueNode, sw1.querySelector("input[type='checkbox']"),
				"Unexpected value for 'valueNode' attach point.");
			assert.strictEqual(sw1._pushNode, sw1.querySelector(".-d-switch-push"),
				"Unexpected value for 'focusNode' attach point.");
			assert.strictEqual(sw1._knobGlassNode, sw1.querySelector(".-d-switch-knobglass"),
				"Unexpected value for '_knobGlassNode' attach point.");
			assert.strictEqual(sw1._innerWrapperNode, sw1.querySelector(".-d-switch-inner-wrapper"),
				"Unexpected value for '_innerWrapperNode' attach point.");
			assert.strictEqual(sw1._innerNode, sw1.querySelector(".-d-switch-inner"),
				"Unexpected value for '_innerNode' attach point.");
			assert.strictEqual(sw1._knobNode, sw1.querySelector(".-d-switch-knob"),
				"Unexpected value for '_knobNode' attach point.");
		},

		"Parameter init": function () {
			var sw2 = document.getElementById("sw2");
			assert.isTrue(sw2.checked, "Unexpected value for 'checked' property.");
			assert.isTrue(sw2.disabled, "Unexpected default value for 'disabled' property.");
			assert.strictEqual(sw2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");
			assert.strictEqual(sw2.name, "sw2",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");
			assert.strictEqual(sw2.checkedLabel, "ON", "Unexpected default value for 'checkedLabel' property.");
			assert.strictEqual(sw2.uncheckedLabel, "OFF",
				"Unexpected default value for 'uncheckedLabel' property.");

			// verify properties bounds in the template
			var elt = sw2.querySelector("input[type='checkbox']");
			assert.strictEqual(sw2.name, elt.getAttribute("name"),
				"Unexpected 'name' attribute value for wrapped input.");
			assert.strictEqual(sw2.value, elt.getAttribute("value"),
				"Unexpected 'value' attribute value for wrapped input.");
			assert.ok(sw2.disabled.toString(), elt.getAttribute("disabled"),
				"Unexpected 'disabled' attribute value for wrapped input.");
			assert.strictEqual(sw2._innerNode.firstChild.firstChild.textContent.trim(), "ON",
				"Unexpected text for 'checkedLabel' binding.");
			assert.strictEqual(sw2._innerNode.children[2].firstChild.textContent.trim(), "OFF",
				"Unexpected text for 'checkedLabel' binding.");
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};
	mix(suite, commonSuite.testCases);

	// Markup
	var markupSuite = {
		name: "deliteful/Switch: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		}
	};
	mix(markupSuite, suite);
	registerSuite(markupSuite);

	var progSuite = {
		name: "deliteful/Switch: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var cb = new Switch({id: "sw1"});
			cb.placeAt(container);
			cb = new Switch({
				id: "sw2",
				value: "foo",
				checked: true,
				disabled: true,
				name: "sw2",
				checkedLabel: "ON",
				uncheckedLabel: "OFF"
			});
			cb.placeAt(container);
			cb = new Switch({id: "sw3"});
			cb.placeAt(container);
			var lbl = document.createElement("label");
			lbl.setAttribute("for", "sw3-input");
			lbl.setAttribute("id", "lbl4");
			container.appendChild(lbl);
		}
	};
	mix(progSuite, suite);
	registerSuite(progSuite);

});
