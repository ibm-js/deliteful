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
				.execute("return document.getElementById('top-tooltip').hasAttribute('aria-describedby');")
				.then(function (val) {
					assert.isFalse(val, "no aria-describedby for TooltipDialog (only for Tooltip)");
				})
				.execute("var tooltipRootNode = document.getElementById('top-tooltip'); " +
					"var labelNode = document.getElementById(tooltipRootNode.getAttribute('aria-labelledby')); " +
					"return labelNode.textContent;")
				.then(function (val) {
					assert.strictEqual(val, "My Tooltip Dialog");
				})
				.execute("return document.activeElement.id").then(function (id) {
					assert.strictEqual(id, "name", "focus moved to first field on open");
				})
				.pressKeys(keys.TAB).pressKeys(keys.TAB).pressKeys(keys.TAB)
				.execute("return document.activeElement.tagName").then(function (tag) {
					assert.strictEqual(tag.toLowerCase(), "button");
				})
				.pressKeys(keys.TAB)
				.execute("return document.activeElement.id || document.activeElement.tagName").then(function (id) {
					assert.strictEqual(id, "name", "focus looped back to first field");
				});
			// TODO: test ESC key closes dialog and sends focus back to button
		},

		scrollbars: function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				// For some reason looping around on firefox works in real life but not via webdriver.
				return this.skip("keyboard support problems");
			}
			return remote
				.findById("bottomTall").click().end()
				.execute("var tooltip = document.getElementById('bottom-tall-tooltip');\n return {" +
					"winHeight: window.innerHeight, " +
					"tooltipOffsetHeight: tooltip.offsetHeight, " +
					"tooltipContainerOffsetHeight: tooltip.containerNode.offsetHeight, " +
					"tooltipContainerScrollHeight: tooltip.containerNode.scrollHeight }").then(function (heights) {
					assert.isBelow(heights.tooltipOffsetHeight, heights.winHeight,
						"tooltip shorter than window");
					assert.isBelow(heights.tooltipContainerOffsetHeight, heights.tooltipOffsetHeight,
						"tooltip container shorter than tooltip");
					assert.isBelow(heights.tooltipContainerOffsetHeight, heights.tooltipContainerScrollHeight,
						"tooltip container has scrollbar");
				});
		}
	});
});
