define([
	"dcl/dcl", "intern!object", "intern/chai!assert", "delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"deliteful/Button"
], function (dcl, registerSuite, assert, register, $, Button) {

	var container, html = "<button is='d-button' id='b1'>b1</button>" +
		"<button is='d-button' id='b2' value='foo'>b2</button>" +
		"<button is='d-button' id='b3' iconClass='ic1'>b3</button>" +
		"<button is='d-button' id='b4' iconClass='ic1' label='on'>off</button>";


	var commonSuite = {

		"Default State": function () {
			var b = document.getElementById("b1");
			b.deliver();
			assert.isTrue($(b).hasClass("d-button"), "Unexpected baseClass.");
			assert.isFalse(b.disabled, "Unexpected default value for 'disabled' property");
			assert.strictEqual("b1", b.label, "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual("b1", b.textContent, "Unexpected default value for textContent.");

			var b2 = document.getElementById("b2");
			b2.deliver();
			assert.strictEqual(b2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");

			b = document.getElementById("b3");
			b.deliver();
			assert.strictEqual("b3", b.label, "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual("b3", b.textContent, "Unexpected default value for textContent [2].");
			assert.strictEqual("ic1", b.iconClass, "Unexpected default value for iconClass.");
			assert.isTrue(/ic1/.test(b.iconNode.className), "Missing icon css class on iconNode.");
		},

		"label": function () {
			var b4 = document.getElementById("b4");
			b4.deliver();
			assert.strictEqual("on", b4.label, "Unexpected value for textContent after label set.");
			assert.strictEqual("on", b4.textContent, "Unexpected value for textContent after label set.");
			b4.label = "b4";
			b4.deliver();
			assert.strictEqual("b4", b4.label, "Unexpected value for textContent after label set.");
			assert.strictEqual("b4", b4.textContent, "Unexpected value for textContent after label set.");
		},

		"iconClass": function () {
			var b4 = document.getElementById("b4");
			// test label is properly updated according to checked state when checkedLabel is set a value
			b4.iconClass = "ic3";
			b4.deliver();
			assert.isTrue(/ic3/.test(b4.iconNode.className), "Unexpected value for css class on iconNode (b4) [2].");
		},

		"value": function () {
			var b = document.getElementById("b1");
			b.value = "foo";
			assert.strictEqual(b.value, "foo", "Unexpected value for 'value' attribute.");
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	// Markup
	var suite = {
		name: "deliteful/Button: markup",
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
		name: "deliteful/Button: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var b = new Button({id: "b1", label: "b1"});
			container.appendChild(b);
			b.startup();
			b = new Button({id: "b2", value: "foo", label: "b2"});
			container.appendChild(b);
			b.startup();
			b = new Button({id: "b3", label: "b3", iconClass: "ic1"});
			container.appendChild(b);
			b.startup();
			b = new Button({id: "b4", label: "on", iconClass: "ic1"});
			container.appendChild(b);
			b.startup();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);
});