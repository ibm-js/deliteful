define([
    "intern",
	"intern!object",
    "intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	function loadFile(remote, url) {
		return remote
			.get(require.toUrl(url))
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	registerSuite({
		name: "Switch - functional",

		"Switch behavior": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo() unsupported");
			}
			return loadFile(remote, "./Switch.html")
				.findById("sw1")
				.then(function (element) {
					return remote.moveMouseTo(element, 60, 9);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.releaseMouseButton()
				.then(function () {
					pollUntil("return document.getElementById('sw1').checked ? true : null;", [],
							2000, intern.config.POLL_INTERVAL);
				})
				.sleep(500)
				.findById("sw1")
				.then(function (element) {
					return remote.moveMouseTo(element, 10, 9);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.releaseMouseButton()
				.then(function () {
					pollUntil("return document.getElementById('sw1').checked ? null : false;", [],
							2000, intern.config.POLL_INTERVAL);
				})
				// click on disabled checkbox
				.then(function () {
					pollUntil("return document.getElementById('sw2').checked ? null : false;", [],
							2000, intern.config.POLL_INTERVAL);
				})
				.findById("sw2")
				.then(function (element) {
					return remote.moveMouseTo(element, 60, 9);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.releaseMouseButton()
				.then(function () {
					pollUntil("return document.getElementById('sw2').checked ? null : false;", [],
							2000, intern.config.POLL_INTERVAL);
				});
		},

		"Switch key nav": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return loadFile(remote, "./Switch.html")
				// keyb nav
				// give the focus to the button to have a ref starting point in the chain
				.execute("return document.getElementById('b1').focus();")
				.getActiveElement()
				.end()
				.sleep(400)
				.pressKeys(keys.TAB) // Press TAB -> cb1
				.sleep(400)
				.getActiveElement()
				.getAttribute("name")
				.then(function (v) {
					assert.equal(v, "sw1", "focused element after 1st TAB.");
				})
				.end()
				.pressKeys(keys.SPACE) // Press Space to check cb1
				.execute("return document.getElementById('sw1').checked;")
				.then(function (v) {
					assert.isTrue(v, "value for 'checked' property after pressing SPACE.");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.equal(v, "End", "focused element after 2nd TAB.");
				})
				;
		},

		"Switch Form tests": function () {
			var remote = this.remote;
			return loadFile(remote, "./Switch.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.execute("return document.getElementById('valueFor_sw3');")
				.then(function (value) {
					assert.isNull(value, "value for unchecked checkbox cb3.");
				})
				.end()
				.findById("valueFor_sw4")
				.getVisibleText()
				.then(function (value) {
					assert.equal(value, "2", "value for checkbox cb4");
				})
				.end()
				.execute("return document.getElementById('valueFor_sw5');")
				.then(function (value) {
					assert.isNull(value, "value for disabled checkbox cb5.");
				})
				.findById("valueFor_sw6")
				.getVisibleText()
				.then(function (value) {
					assert.equal(value, "4", "value for checkbox cb6");
				})
				.end()
				;
		},
		"Switch with disabled attribute": function () {
			var remote = this.remote;

			if (remote.environmentType.brokenMouseEvents) {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so Switch won't move");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so Switch won't move");
			}

			return loadFile(remote, "./Switch.html")
				
				// no disabled attribute
				.execute("return document.getElementById('sw71').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should be disabled");
				})
				.findByCssSelector("#sw71 .-d-switch-knobglass")
				.click()
				.sleep(500) // NOTE: waiting for the sliding to happen
				.execute("return document.getElementById('sw71').checked;")
				.then(function (value) {
					assert.isTrue(value, "the switch should be enabled this time");
				})
				.end()

				// disabled attribute
				.execute("return document.getElementById('sw72').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should be disabled");
				})
				.findByCssSelector("#sw72 .-d-switch-knobglass")
				.click()
				.sleep(500) // NOTE: waiting for the sliding to happen
				.execute("return document.getElementById('sw72').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should still be disabled");
				})
				.end()

				// disabled=true attribute
				.execute("return document.getElementById('sw73').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should be disabled");
				})
				.findByCssSelector("#sw73 .-d-switch-knobglass")
				.click()
				.sleep(500) // NOTE: waiting for the sliding to happen
				.execute("return document.getElementById('sw73').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should still be disabled");
				})
				.end()

				// disabled=false attribute
				.execute("return document.getElementById('sw74').checked;")
				.then(function (value) {
					assert.isFalse(value, "the switch should be disabled");
				})
				.findByCssSelector("#sw74 .-d-switch-knobglass")
				.click()
				.sleep(500) // NOTE: waiting for the sliding to happen
				.execute("return document.getElementById('sw74').checked;")
				.then(function (value) {
					assert.isTrue(value, "the switch should be enabled this time");
				})
				.end()
				;
		}
	});
});
