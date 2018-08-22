define([
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/Switch"
], function (registerSuite, assert, register, Switch) {
	var container, html = "<d-switch id='b1' checkedLabel='\u05d0\u05d1\u05d2' " +
		"uncheckedLabel='ABC' checked='true' textDir='ltr'></d-switch>" +
		"<d-switch id='b2' checkedLabel='\u05d0\u05d1\u05d2' uncheckedLabel='ABC'" +
		" checked='false' textDir='rtl'></d-switch>" +
		"<d-switch id='b3' checkedLabel='\u05d0\u05d1\u05d2' uncheckedLabel='ABC'" +
		" checked='true' title='ABC \u05d0\u05d1\u05d2' textDir='auto'></d-switch>";

	registerSuite({
		name: "deliteful/Switch (bidi)",
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
				var div1 = b1.querySelector(".d-switch-leading");
				var div2 = b1.querySelector(".d-switch-trailing");
				assert.strictEqual(b1.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202a\u05d0\u05d1\u05d2\u202c", "ltr: wrong displayed value for 'checkedLabel'");
			},
			"rtl": function () {
				register.deliver();
				var b2 = document.getElementById("b2");
				var div1 = b2.querySelector(".d-switch-leading");
				var div2 = b2.querySelector(".d-switch-trailing");
				assert.strictEqual(b2.effectiveDir === "ltr" ? div2.textContent : div1.textContent,
					"\u202bABC\u202c", "rtl: wrong displayed value for 'uncheckedLabel'");
			},
			"auto": function () {
				register.deliver();
				var b3 = document.getElementById("b3");
				var div1 = b3.querySelector(".d-switch-leading");
				var div2 = b3.querySelector(".d-switch-trailing");
				assert.strictEqual(b3.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202b\u05d0\u05d1\u05d2\u202c", "auto: wrong displayed value for 'uncheckedLabel'");
				assert.strictEqual(b3.title, "\u202aABC \u05d0\u05d1\u05d2\u202c",
					"auto: wrong value for 'title'");
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
				var b1 = new Switch({id: "b1", checkedLabel: "\u05d0\u05d1\u05d2",
					uncheckedLabel: "ABC", checked: true});
				b1.textDir = "ltr";
				b1.placeAt(container);
				var div1 = b1.querySelector(".d-switch-leading");
				var div2 = b1.querySelector(".d-switch-trailing");
				assert.strictEqual(b1.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202a\u05d0\u05d1\u05d2\u202c", "ltr: wrong displayed value for 'checkedLabel'");
				b1.checked = false;
				b1.deliver();
				assert.strictEqual(b1.effectiveDir === "ltr" ? div2.textContent : div1.textContent,
					"\u202aABC\u202c", "ltr: wrong displayed value for 'uncheckedLabel'");
				b1.textDir = "rtl";
				b1.deliver();
				assert.strictEqual(b1.effectiveDir === "ltr" ? div2.textContent : div1.textContent,
					"\u202bABC\u202c", "rtl: wrong displayed value for 'uncheckedLabel'");
				b1.checked = true;
				b1.deliver();
				assert.strictEqual(b1.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202b\u05d0\u05d1\u05d2\u202c", "rtl: wrong displayed value for 'checkedLabel'");
				b1.textDir = "auto";
				b1.deliver();
				assert.strictEqual(b1.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202b\u05d0\u05d1\u05d2\u202c", "auto: wrong displayed value for 'checkedLabel'");
				b1.checked = false;
				b1.deliver();
				assert.strictEqual(b1.effectiveDir === "ltr" ? div2.textContent : div1.textContent,
					"\u202aABC\u202c", "auto: wrong displayed value for 'uncheckedLabel'");
			},
			"labels": function () {
				var b2 = new Switch({id: "b2"});
				b2.textDir = "rtl";
				b2.uncheckedLabel = "ABC";
				b2.placeAt(container);
				var div1 = b2.querySelector(".d-switch-leading");
				var div2 = b2.querySelector(".d-switch-trailing");
				assert.strictEqual(b2.effectiveDir === "ltr" ? div2.textContent : div1.textContent,
					"\u202bABC\u202c", "unchekedLabel: wrong displayed rtl value");
				b2.checkedLabel = "\u05d0\u05d1\u05d2";
				b2.textDir = "ltr";
				b2.checked = true;
				b2.deliver();
				assert.strictEqual(b2.effectiveDir === "ltr" ? div1.textContent : div2.textContent,
					"\u202a\u05d0\u05d1\u05d2\u202c", "checkdLabel: wrong displayed ltr value");
			},
			"title": function () {
				var b3 = new Switch({id: "b3"});
				b3.textDir = "auto";
				b3.title = "\u05d0\u05d1\u05d2 ABC";
				b3.placeAt(container);
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
