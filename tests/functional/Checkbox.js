define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;

	function loadFile(remote, fileName) {
		return remote
			.get("deliteful/tests/functional/" + fileName)
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	registerSuite("Checkbox - functional", {
		mouse: function () {
			var remote = this.remote;
			return loadFile(remote, "Checkbox.html")
				// default click action
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isFalse(checked, "cb1 initially unchecked");
				})
				.findByCssSelector("#cb1 input").click().end()
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isTrue(checked, "click of cb1");
				});
		},

		keyboard: function () {
			// keyboard nav
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return loadFile(remote, "Checkbox.html")
				.findById("b1").click().end()
				.getActiveElement().getAttribute("id").then(function (v) {
					assert.strictEqual(v, "b1", "focused b1");
				}).end()
				.pressKeys(keys.TAB) // Press TAB -> cb1
				.execute("return document.activeElement.getAttribute('name')").then(function (v) {
					assert.strictEqual(v, "cb1", "focused element after 1st TAB.");
				})
				.pressKeys(keys.SPACE) // Press Space to check cb1
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isTrue(checked, "keyboard click of cb1");
				})
				.pressKeys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.execute("return document.activeElement.textContent").then(function (v) {
					assert.strictEqual(v, "End", "focused element after 2nd TAB.");
				});
		},

		form: function () {
			//
			// Form tests
			//
			var remote = this.remote;
			if (/selendroid/i.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return loadFile(remote, "Checkbox.html")
				.findById("form1").submit().end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters").end()	// TODO: shouldn't this be checking something?
				.execute("return document.getElementById('valueFor_cb3');").then(function (value) {
					assert.isNull(value, "value for unchecked checkbox cb3.");
				})
				.findById("valueFor_cb4").getVisibleText().then(function (value) {
					assert.strictEqual(value, "2", "value for checkbox cb4");
				}).end()
				.execute("return document.getElementById('valueFor_cb5');").then(function (value) {
					assert.isNull(value, "value for disabled checkbox cb5.");
				})
				.findById("valueFor_cb6").getVisibleText().then(function (value) {
					assert.strictEqual(value, "4", "value for checkbox cb6");
				}).end();
		}
	});
});
