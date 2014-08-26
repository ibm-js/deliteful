define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"dojo/dom-class",
	"deliteful/CheckBox"
], function (dcl, registerSuite, assert, register, domClass, CheckBox) {

	var container,
		html = "<d-checkbox id='cb1'></d-checkbox><d-checkbox id='cb2' value='foo'>" +
			"</d-checkbox><d-checkbox id='cb3' checked></d-checkbox><label id='lbl4' for='cb3'>cb3</label>";

	var commonSuite = {

		"Default State": function () {
			var cb = document.getElementById("cb1");
			assert.isTrue(domClass.contains(cb, "d-checkbox"), "Unexpected baseClass.");
			assert.isFalse(cb.checked, "Unexpected default value for 'checked' property.");
			assert.isFalse(cb.disabled, "Unexpected default value for 'disabled' property");
			assert.strictEqual(cb.value, "on", "Unexpected default value for 'value' property");
			var elt = cb.querySelector("input[type='checkbox']");
			assert.ok(elt, "Missing wrapped input element.");

			// verify properties bounds in the template
			assert.strictEqual(cb.name, elt.getAttribute("name"), "Unexpected 'name' attribute value for wrapped input.");
			assert.strictEqual(cb.value, elt.getAttribute("value"), "Unexpected 'value' attribute value for wrapped input.");

			var cb2 = document.getElementById("cb2");
			assert.strictEqual(cb2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");
			cb = document.getElementById("cb3");
			assert.ok(cb.checked, "Unexpected default value for 'checked' property if 'checked' specified.");
		},

		"checked": function () {
			var cb1 = document.getElementById("cb1"),
				inp = cb1.firstChild,
				old = cb1.checked;
			cb1.checked = !old;
			assert.strictEqual(cb1.checked, !old, "Unexpected value for 'checked' property after set.");
			//sync template
			cb1.deliver();
			assert.strictEqual(cb1.checked, inp.checked, "Unexpected value for 'checked' property of wrapped input.");
		},

		value: function () {
			var cb = document.getElementById("cb1");
			cb.value = "foo";
			//sync template
			cb.deliver();
			assert.strictEqual(cb.firstChild.getAttribute("value"), "foo", "Unexpected value for 'value' attribute.");
		},

		"labelFor": function () {
			var cb3 = document.getElementById("cb3"),
				lbl4 = document.getElementById("lbl4");
			assert.strictEqual(cb3._lbl4, lbl4, "Unexpected labelFor elt associated with cb3.");
			lbl4.click();
			cb3.deliver();
			assert.isFalse(cb3.checked, "Unexpected value for 'checked' property after labelFor click.");
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	// Markup
	var suite = {
		name: "deliteful/CheckBox: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.parse();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);

	suite = {
		name: "deliteful/CheckBox: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var cb = new CheckBox({id: "cb1"});
			container.appendChild(cb);
			cb.startup();
			cb = new CheckBox({id: "cb2", value: "foo"});
			container.appendChild(cb);
			cb.startup();
			var lbl4 = document.createElement("label");
			lbl4.id = "lbl4";
			lbl4.setAttribute("for", "cb3");
			lbl4.textContent = "cb3";
			container.appendChild(lbl4);
			cb = new CheckBox({id: "cb3", checked: "checked"});
			container.appendChild(cb);
			cb.startup();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);
});