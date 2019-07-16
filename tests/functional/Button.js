define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = require("@theintern/leadfoot/keys").default;

	registerSuite("Button - functional", {
		before: function () {
			return this.remote
				.get(require.toUrl("deliteful/tests/functional/Button.html"))
				.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			"Button behavior": function () {
				return this.remote
					.findById("b1").click().end()
					.then(pollUntil("return document.getElementById('b1')._test_clicked === 1;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
			},

			"Button Key nav": function () {
				// keyboard nav
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
				// give the focus to the button to have a ref starting point in the chain
					.findById("b0").click().end()
					.getActiveElement().getAttribute("id").then(function (v) {
						assert.strictEqual(v, "b0", "focused b0");
					}).end()
					.pressKeys(keys.TAB) // Press TAB -> b1
					.getActiveElement().getAttribute("name").then(function (v) {
						assert.strictEqual(v, "b1", "focused element after 1st TAB.");
					}).end()
					.pressKeys(keys.SPACE) // Press Space to click b1
					.execute("return document.getElementById('b1')._test_clicked;").then(function (value) {
						assert.strictEqual(value, 2);
					})
					.pressKeys(keys.TAB) // Press TAB -> skip b2 (disabled)
					.getActiveElement().getVisibleText().then(function (v) {
						assert.strictEqual(v, "End", "focused element after 2nd TAB.");
					});
			}
		}
	});
});
