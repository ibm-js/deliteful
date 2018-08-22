define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"deliteful/ToggleButton"
], function (dcl, registerSuite, assert, register, $, ToggleButton) {

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var container,
		html = "<d-toggle-button id='tb1'>tb1</d-toggle-button>" +
			"<d-toggle-button id='tb3' checked='true' iconClass='ic1'>tb3</d-toggle-button>" +
			"<d-toggle-button id='tb4' checked='true' checkedIconClass='ic2'" +
			" iconClass='ic1' checkedLabel='on'>off</d-toggle-button>" +
			"<d-toggle-button id='tb5' checkedIconClass='ic2'" +
			" iconClass='ic1' checkedLabel='on'>off</d-toggle-button>" +
			"<d-toggle-button id='tb6' checkedIconClass='ic2'" +
			" iconClass='ic1' checkedLabel='on' title='bt title'>off</d-toggle-button>";

	var commonSuite = {
		"Default State": function () {
			var tb = document.getElementById("tb1");
			assert.isTrue($(tb).hasClass("d-toggle-button"), "Unexpected baseClass.");
			assert.isFalse(tb.checked, "Unexpected default value for 'checked' property.");
			assert.strictEqual(tb.getAttribute("aria-pressed"), "false", "tb1 aria-pressed");
			assert.strictEqual(tb.getAttribute("role"), "button", "when aria-pressed set, role must be too");
			assert.isFalse(tb.disabled, "Unexpected default value for 'disabled' property");
			assert.strictEqual(tb.label, "tb1", "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual(tb.textContent.trim(), "tb1", "Unexpected default value for textContent.");


			tb = document.getElementById("tb3");
			assert.ok(tb.checked, "Unexpected default value for 'checked' property if 'checked' specified.");
			assert.strictEqual(tb.getAttribute("aria-pressed"), "true", "tb3 aria-pressed");
			assert.strictEqual(tb.getAttribute("role"), "button", "when aria-pressed set, role must be too");
			assert.strictEqual(tb.label, "tb3", "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual(tb.textContent.trim(), "tb3", "Unexpected default value for textContent [2].");
			assert.strictEqual(tb.iconClass, "ic1", "Unexpected default value for iconClass.");
			assert.isTrue(/ic1/.test(tb.iconNode.className), "Missing icon css class on iconNode.");

			tb = document.getElementById("tb4");
			assert.strictEqual(tb.checkedLabel, "on",
				"Unexpected default value for 'checkedlabel' (inherited) property.");
			assert.strictEqual(tb.textContent.trim(), "on", "Unexpected default value for textContent [3].");
			assert.strictEqual(tb.checkedIconClass, "ic2", "Unexpected default value for checkedIconClass.");
			assert.isTrue(/ic2/.test(tb.iconNode.className), "Missing icon css class on iconNode (checkedIconClass).");
		},

		"checked": function () {
			var tb3 = document.getElementById("tb3");
			tb3.checked = false;
			tb3.deliver();
			assert.isFalse(tb3.checked, "'checked' property after set.");
			assert.strictEqual(tb3.textContent.trim(), "tb3", "textContent in checked state.");
			assert.isTrue(/ic1/.test(tb3.iconNode.className), "css class on iconNode (tb3).");
			// test label is properly updated to default label when unchecked
			var tb4 = document.getElementById("tb4");
			tb4.checked = false;
			tb4.deliver();
			assert.strictEqual(tb4.textContent.trim(), "off", "textContent in unchecked state.");
			assert.isTrue(/ic1/.test(tb4.iconNode.className), "css class on iconNode (tb4).");
		},

		"checkedLabel": function () {
			var tb3 = document.getElementById("tb3");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb3.checkedLabel = "on";
			tb3.deliver();
			assert.strictEqual(tb3.textContent.trim(), "on", "textContent after checkedLabel set.");
			tb3.checkedLabel = "";
			tb3.deliver();
			assert.strictEqual(tb3.textContent.trim(), "tb3", "textContent with empty checkedLabel.");
		},

		"label": function () {
			var tb4 = document.getElementById("tb4");
			tb4.label = "tb4";
			tb4.deliver();
			assert.strictEqual(tb4.textContent.trim(), "on", "textContent after label set and checked.");
			tb4.checked = false;
			tb4.deliver();
			assert.strictEqual(tb4.textContent.trim(), "tb4", "textContent after label set and unchecked.");
		},

		"checkedIconClass" : function () {
			var tb3 = document.getElementById("tb3");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb3.checkedIconClass = "ic2";
			tb3.deliver();
			assert.isTrue(/ic2/.test(tb3.iconNode.className), "css class on iconNode (tb3) [1].");
			tb3.checkedIconClass = "";
			tb3.deliver();
			assert.isTrue(/ic1/.test(tb3.iconNode.className), "css class on iconNode (tb3) [2].");
		},

		"iconClass" : function () {
			var tb4 = document.getElementById("tb4");
			// test label is properly updated according to checked state when checkedLabel is set a value
			tb4.iconClass = "ic3";
			tb4.deliver();
			assert.isTrue(/ic2/.test(tb4.iconNode.className), "css class on iconNode (tb4) [1].");
			tb4.checked = false;
			tb4.deliver();
			assert.isTrue(/ic3/.test(tb4.iconNode.className), "css class on iconNode (tb4) [2].");
		},

		"value": function () {
			var tb = document.getElementById("tb1");
			tb.value = "foo";
			setTimeout(this.async().callback(function () {
				// on chrome, update of native property (like value) is async, even if you call deliver()
				assert.strictEqual(tb._get("value"), "foo", "'value' attribute.");
			}), 10);
		},

		"title on showLabel and checked values": function () {
			var tb5 = document.getElementById("tb5");
			// test title is empty since by default showLabel is equals to true.
			assert.strictEqual(tb5.title, "", "tb5.title");
			tb5.showLabel = false;
			tb5.deliver();
			assert.strictEqual(tb5.title, "off", "tb5.title on 'showLabel=false'");
			tb5.checked = true;
			tb5.deliver();
			assert.strictEqual(tb5.title, "on", "tb5.title on 'checked=true'");
			// reverting
			tb5.checked = false;
			tb5.deliver();
			assert.strictEqual(tb5.title, "off", "tb5.title on 'checked=false'");
			tb5.showLabel = false;
			tb5.deliver();
			assert.strictEqual(tb5.title, "off", "tb5.title on 'showLabel=true'");
		},

		"title on label/checkedLabel change": function () {
			var tb5 = document.getElementById("tb5");
			tb5.showLabel = false;
			tb5.deliver();
			tb5.label = "new label";
			tb5.deliver();
			assert.strictEqual(tb5.title, "new label", "tb5.title on 'label' change");
			tb5.checked = true;
			tb5.deliver();
			assert.strictEqual(tb5.title, "on", "tb5.title on 'checked' change");
			tb5.checkedLabel = "new checked label";
			tb5.deliver();
			assert.strictEqual(tb5.title, "new checked label", "tb5.title on 'checkedLabel' change");
		},

		"pre-set title on showLabel and checked values": function () {
			var tb6 = document.getElementById("tb6");
			// test title is empty since by default showLabel is equals to true.
			assert.strictEqual(tb6.title, "bt title", "tb6.title");
			tb6.showLabel = false;
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'showLabel=false'");
			tb6.checked = true;
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'checked=true'");
			// reverting
			tb6.checked = false;
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'checked=false'");
			tb6.showLabel = false;
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'showLabel=true'");
		},

		"pre-set title on label/checkedLabel change": function () {
			var tb6 = document.getElementById("tb6");
			tb6.showLabel = false;
			tb6.deliver();
			tb6.label = "new label";
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'label' change");
			tb6.checked = true;
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'checked' change");
			tb6.checkedLabel = "new checked label";
			tb6.deliver();
			assert.strictEqual(tb6.title, "bt title", "tb6.title on 'checkedLabel' change");
		},

		"aria-label": function () {
			var b = document.getElementById("tb5");
			assert.strictEqual(b.getAttribute("aria-label"), "off", "tb5.aria-label");
			b.checked = true;
			b.deliver();
			assert.strictEqual(b.getAttribute("aria-label"), "on", "tb5.aria-label on checked change");
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
			register.deliver();
		}
	};
	mix(suite, commonSuite);
	registerSuite(suite);

	suite = {
		name: "deliteful/ToggleButton: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var tb = new ToggleButton({id: "tb1", label: "tb1"});
			tb.placeAt(container);
			tb = new ToggleButton({id: "tb3", checked: "checked", label: "tb3", iconClass: "ic1"});
			tb.placeAt(container);
			tb = new ToggleButton({id: "tb4", checked: "checked", label: "off", checkedLabel: "on",
				iconClass: "ic1", checkedIconClass: "ic2"});
			tb.placeAt(container);
			tb = new ToggleButton({id: "tb5", label: "off", checkedLabel: "on",
				iconClass: "ic1", checkedIconClass: "ic2"});
			tb.placeAt(container);
			tb = new ToggleButton({id: "tb6", label: "off", checkedLabel: "on",
				iconClass: "ic1", checkedIconClass: "ic2", title: "bt title"});
			tb.placeAt(container);
		}
	};
	mix(suite, commonSuite);
	registerSuite(suite);
});
