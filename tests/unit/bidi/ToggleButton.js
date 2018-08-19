define([
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/ToggleButton"
], function (registerSuite, assert, register, ToggleButton) {
	var container, html = "<d-toggle-button id='b1' textDir='ltr' " +
		"checkedLabel='ABC \u05d0\u05d1\u05d2'>\u05d0\u05d1\u05d2 ABC</d-toggle-button>" +
		"<d-toggle-button id='b2' textDir='rtl' " +
		"checkedLabel = '\u05d0\u05d1\u05d2 ABC'>ABC \u05d0\u05d1\u05d2</d-toggle-button>" +
		"<d-toggle-button id='b3' title='ABC \u05d0\u05d1\u05d2' textDir='auto' " +
		"checkedLabel='ABC \u05d2\u05d1\u05d0'>\u05d0\u05d1\u05d2 ABC</d-toggle-button>" +
		"<d-toggle-button id='b4' label='ABC \u05d2\u05d1\u05d0' textDir='auto' " +
		"checkedLabel = '\u05d0\u05d1\u05d2 ABC' checked = 'true'></d-toggle-button>";

	registerSuite({
		name: "deliteful/ToggleButton (bidi)",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
		},
		markup: {
			beforeEach: function () {
				container.innerHTML = html;
			},
			"ltr": function () {
				register.deliver();
				var b1 = document.getElementById("b1");
				assert.strictEqual("\u202a\u05d0\u05d1\u05d2 ABC\u202c", b1.labelNode.textContent,
					"ltr: wrong displayed value for 'label'");
				assert.strictEqual("\u202a\u05d0\u05d1\u05d2 ABC\u202c", b1.title,
					"ltr: wrong default value for 'title'");
				b1.checked = true;
				b1.deliver();
				assert.strictEqual("\u202aABC \u05d0\u05d1\u05d2\u202c", b1.labelNode.textContent,
					"ltr: wrong displayed value for 'checkedLabel'");
			},
			"rtl": function () {
				register.deliver();
				var b2 = document.getElementById("b2");
				assert.strictEqual("\u202bABC \u05d0\u05d1\u05d2\u202c", b2.labelNode.textContent,
					"rtl: wrong displayed value for 'label'");
				assert.strictEqual("\u202bABC \u05d0\u05d1\u05d2\u202c", b2.title,
					"rtl: wrong default value for 'title'");
				b2.checked = true;
				b2.deliver();
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b2.labelNode.textContent,
					"rtl: wrong displayed value for 'checkedLabel'");
			},
			"auto": function () {
				register.deliver();
				var b3 = document.getElementById("b3");
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b3.labelNode.textContent,
					"auto: wrong displayed value for 'label'");
				assert.strictEqual("\u202aABC \u05d0\u05d1\u05d2\u202c", b3.title, "auto: wrong value for 'title'");
				b3.checked = true;
				b3.deliver();
				assert.strictEqual("\u202aABC \u05d2\u05d1\u05d0\u202c", b3.labelNode.textContent,
					"auto: wrong value for 'checkedLabel'");
			},
			"auto2": function () {
				register.deliver();
				var b4 = document.getElementById("b4");
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b4.labelNode.textContent,
					"auto2: wrong displayed value for 'checkedlabel'");
			},
			afterEach: function () {
				container.innerHTML = "";
			}
		},
		dynChanges: {
			beforeEach: function () {
				container.innerHTML = html;
			},
			"textDir": function () {
				var b1 = new ToggleButton({id: "b1", label: "\u05d0\u05d1\u05d2 ABC",
					title: "ABC \u05d0\u05d1\u05d2", checkedLabel: "ABC \u05d2\u05d1\u05d0"});
				container.appendChild(b1);
				b1.attachedCallback();
				b1.textDir = "ltr";
				b1.deliver();
				assert.strictEqual("\u202a\u05d0\u05d1\u05d2 ABC\u202c", b1.labelNode.textContent,
					"ltr: wrong displayed value for 'label'");
				assert.strictEqual("\u202aABC \u05d0\u05d1\u05d2\u202c", b1.title,
					"ltr: wrong default value for 'title'");
				b1.checked = true;
				b1.deliver();
				assert.strictEqual("\u202aABC \u05d2\u05d1\u05d0\u202c", b1.labelNode.textContent,
					"ltr: wrong default value for 'checkedLabel'");
				b1.textDir = "rtl";
				b1.deliver();
				assert.strictEqual("\u202bABC \u05d2\u05d1\u05d0\u202c", b1.labelNode.textContent,
					"rtl: wrong displayed value for 'checkedLabel'");
				assert.strictEqual("\u202bABC \u05d0\u05d1\u05d2\u202c", b1.title,
					"rtl: wrong default value for 'title'");
				b1.checked = false;
				b1.deliver();
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b1.labelNode.textContent,
					"rtl: wrong displayed value for 'label'");
				b1.textDir = "auto";
				b1.deliver();
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b1.labelNode.textContent,
					"auto: wrong displayed value for 'label'");
				assert.strictEqual("\u202aABC \u05d0\u05d1\u05d2\u202c", b1.title,
					"auto: wrong default value for 'title'");
				b1.checked = true;
				b1.deliver();
				assert.strictEqual("\u202aABC \u05d2\u05d1\u05d0\u202c", b1.labelNode.textContent,
					"auto: wrong default value for 'checkedLabel'");
			},
			"label": function () {
				var b2 = new ToggleButton({id: "b2"});
				container.appendChild(b2);
				b2.attachedCallback();
				b2.textDir = "rtl";
				b2.label = "ABC \u05d0\u05d1\u05d2";
				b2.deliver();
				assert.strictEqual("\u202bABC \u05d0\u05d1\u05d2\u202c", b2.labelNode.textContent,
					"label: wrong displayed rtl value");
				b2.textDir = "ltr";
				b2.label = "\u05d0\u05d1\u05d2 ABC";
				b2.deliver();
				assert.strictEqual("\u202a\u05d0\u05d1\u05d2 ABC\u202c", b2.labelNode.textContent,
					"label: wrong displayed ltr value");
			},
			"checkedLabel": function () {
				var b2 = new ToggleButton({id: "b2", checked: true});
				container.appendChild(b2);
				b2.attachedCallback();
				b2.textDir = "rtl";
				b2.checkedLabel = "ABC \u05d0\u05d1\u05d2";
				b2.deliver();
				assert.strictEqual("\u202bABC \u05d0\u05d1\u05d2\u202c", b2.labelNode.textContent,
					"checkedLabel: wrong displayed rtl value");
				b2.textDir = "ltr";
				b2.checkedLabel = "\u05d0\u05d1\u05d2 ABC";
				b2.deliver();
				assert.strictEqual("\u202a\u05d0\u05d1\u05d2 ABC\u202c", b2.labelNode.textContent,
					"checkedLabel: wrong displayed ltr value");
			},
			"title": function () {
				var b3 = new ToggleButton({id: "b3"});
				container.appendChild(b3);
				b3.attachedCallback();
				b3.textDir = "auto";
				b3.title = "\u05d0\u05d1\u05d2 ABC";
				b3.deliver();
				assert.strictEqual("\u202b\u05d0\u05d1\u05d2 ABC\u202c", b3.title,
					"title: wrong value for 'auto' (1)");
				b3.textDir = "ltr";
				b3.title = "ABC \u05d0\u05d1\u05d2";
				b3.deliver();
				assert.strictEqual("\u202aABC \u05d0\u05d1\u05d2\u202c", b3.title,
					"title: wrong value for 'auto' (2)");
			},
			afterEach: function () {
				container.innerHTML = "";
			}
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
