define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;

	registerSuite("TooltipDialog - functional", {
		before: function () {
			var remote = this.remote;

			return remote.get("deliteful/tests/functional/TooltipDialog.html")
				.then(pollUntil("return ready || null;", [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			accessibility: function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
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
					})
					.pressKeys(keys.ESCAPE)
					.execute("return document.activeElement.innerText.trim()").then(function (text) {
						assert.strictEqual(text, "show tooltip dialog", "escape returned focus to dropdown button");
					});
			},

			empty: function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("keyboard support problems");
				}

				return remote
					.findById("empty").click().end()
					.execute("return document.activeElement.getAttribute('aria-label');")
					.then(function (label) {
						assert.strictEqual(label, "Close", "when no interactive elements, focus goes to close button");
					})
					.pressKeys(keys.SPACE)
					.execute("return document.activeElement.innerText.trim()").then(function (text) {
						assert.strictEqual(text, "show tooltip dialog with no interactive elements",
							"space bar returned focus to dropdown button");
					});
			},

			scrollbars: function () {
				return this.remote
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
		}
	});
});
