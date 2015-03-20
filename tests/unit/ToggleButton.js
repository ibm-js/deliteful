define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"deliteful/ToggleButton"
], function (dcl, registerSuite, assert, register, $, ToggleButton) {

	var container,
		html = "<button is='d-toggle-button' id='tb1'>tb1</button>" +
			"<button is='d-toggle-button' id='tb2' value='foo'>tb2</button>" +
			"<button is='d-toggle-button' id='tb3' checked='true' iconClass='ic1'>tb3</button>" +
			"<button is='d-toggle-button' id='tb4' checked='true' checkedIconClass='ic2'" +
			" iconClass='ic1' checkedLabel='on'>off</button>";


	var commonSuite = {
		"Default State": function () {
			var tb = document.getElementById("tb1");
			assert.isTrue($(tb).hasClass("d-toggle-button"), "Unexpected baseClass.");
			assert.isFalse(tb.checked, "Unexpected default value for 'checked' property.");
			assert.isFalse(tb.disabled, "Unexpected default value for 'disabled' property");
			assert.strictEqual("tb1", tb.label, "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual("tb1", tb.textContent, "Unexpected default value for textContent.");

			tb = document.getElementById("tb3");
			assert.ok(tb.checked, "Unexpected default value for 'checked' property if 'checked' specified.");
			assert.strictEqual("tb3", tb.label, "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual("tb3", tb.textContent, "Unexpected default value for textContent [2].");
			assert.strictEqual("ic1", tb.iconClass, "Unexpected default value for iconClass.");
			assert.isTrue(/ic1/.test(tb.iconNode.className), "Missing icon css class on iconNode.");

			tb = document.getElementById("tb4");
			assert.strictEqual("on", tb.checkedLabel,
				"Unexpected default value for 'checkedlabel' (inherited) property.");
			assert.strictEqual("on", tb.textContent, "Unexpected default value for textContent [3].");
			assert.strictEqual("ic2", tb.checkedIconClass, "Unexpected default value for checkedIconClass.");
			assert.isTrue(/ic2/.test(tb.iconNode.className), "Missing icon css class on iconNode (checkedIconClass).");

			setTimeout(this.async().callback(function () {
				// on chrome, programmatic update of native property like value is async
				var tb2 = document.getElementById("tb2");
				assert.strictEqual(tb2._get("value"), "foo",
					"Unexpected default value for 'value' property if 'value' specified/unchecked");
			}), 10);
		},

		"checked": function () {
			var tb3 = document.getElementById("tb3");
			tb3.checked = false;
			tb3.deliver();
			assert.isFalse(tb3.checked, "Unexpected value for 'checked' property after set.");
			assert.strictEqual("tb3", tb3.textContent, "Unexpected value for textContent in checked state.");
			assert.isTrue(/ic1/.test(tb3.iconNode.className), "Unexpected value for css class on iconNode (tb3).");
			// test label is properly updated to default label when unchecked
			var tb4 = document.getElementById("tb4");
			tb4.checked = false;
			tb4.deliver();
			assert.strictEqual("off", tb4.textContent, "Unexpected value for textContent in unchecked state.");
			assert.isTrue(/ic1/.test(tb4.iconNode.className), "Unexpected value for css class on iconNode (tb4).");
		},

		"checkedLabel": function () {
			var tb3 = document.getElementById("tb3");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb3.checkedLabel = "on";
			tb3.deliver();
			assert.strictEqual("on", tb3.textContent, "Unexpected value for textContent after checkedLabel set.");
			tb3.checkedLabel = "";
			tb3.deliver();
			assert.strictEqual("tb3", tb3.textContent, "Unexpected value for textContent with empty checkedLabel.");
		},

		"label": function () {
			var tb4 = document.getElementById("tb4");
			tb4.label = "tb4";
			tb4.deliver();
			assert.strictEqual("on", tb4.textContent, "Unexpected value for textContent after label set and checked.");
			tb4.checked = false;
			tb4.deliver();
			assert.strictEqual("tb4", tb4.textContent,
				"Unexpected value for textContent after label set and unchecked.");
		},

		"checkedIconClass" : function () {
			var tb3 = document.getElementById("tb3");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb3.checkedIconClass = "ic2";
			tb3.deliver();
			assert.isTrue(/ic2/.test(tb3.iconNode.className), "Unexpected value for css class on iconNode (tb3) [1].");
			tb3.checkedIconClass = "";
			tb3.deliver();
			assert.isTrue(/ic1/.test(tb3.iconNode.className), "Unexpected value for css class on iconNode (tb3) [2].");
		},

		"iconClass" : function () {
			var tb4 = document.getElementById("tb4");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb4.iconClass = "ic3";
			tb4.deliver();
			assert.isTrue(/ic2/.test(tb4.iconNode.className), "Unexpected value for css class on iconNode (tb4) [1].");
			tb4.checked = false;
			tb4.deliver();
			assert.isTrue(/ic3/.test(tb4.iconNode.className), "Unexpected value for css class on iconNode (tb4) [2].");
		},

		"value": function () {
			var tb = document.getElementById("tb1");
			tb.value = "foo";
			setTimeout(this.async().callback(function () {
				// on chrome, update of native property (like value) is async, even if you call deliver()
				assert.strictEqual(tb._get("value"), "foo", "Unexpected value for 'value' attribute.");
			}), 10);
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	// Markup
	var suite = {
		name: "deliteful/ToggleButton: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.parse(container);
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);

	suite = {
		name: "deliteful/ToggleButton: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var tb = new ToggleButton({id: "tb1", label: "tb1"});
			container.appendChild(tb);
			tb.attachedCallback();
			tb = new ToggleButton({id: "tb2", value: "foo", label: "tb2"});
			container.appendChild(tb);
			tb.attachedCallback();
			tb = new ToggleButton({id: "tb3", checked: "checked", label: "tb3", iconClass: "ic1"});
			container.appendChild(tb);
			tb.attachedCallback();
			tb = new ToggleButton({id: "tb4", checked: "checked", label: "off", checkedLabel: "on",
				iconClass: "ic1", checkedIconClass: "ic2"});
			container.appendChild(tb);
			tb.attachedCallback();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);
});