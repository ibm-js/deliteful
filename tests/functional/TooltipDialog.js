define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	registerSuite({
		name: "TooltipDialog - functional",

		setup: function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return remote.get(require.toUrl("./TooltipDialog.html")).then(pollUntil("return ready || null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		accessibility: function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				// For some reason looping around on firefox works in real life but not via webdriver.
				return this.skip("keyboard support problems");
			}
			return remote
				.findById("top").click().end()
				.execute("return document.activeElement.id").then(function (id) {
					assert.strictEqual(id, "name", "focus moved to first field on open");
				}).pressKeys(keys.TAB).pressKeys(keys.TAB).pressKeys(keys.TAB)
				.execute("return document.activeElement.tagName").then(function (tag) {
					assert.strictEqual(tag.toLowerCase(), "button");
				}).pressKeys(keys.TAB)
				.execute("return document.activeElement.id || document.activeElement.tagName").then(function (id) {
					assert.strictEqual(id, "name", "focus looped back to first field");
				});
		}
	});
});
