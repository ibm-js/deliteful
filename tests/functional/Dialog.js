define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;

	registerSuite("Dialog - functional", {
		before: function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			return remote.get("deliteful/tests/functional/Dialog.html")
				.then(pollUntil("return ready || null;", [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			accessibility: function () {
				return this.remote
					.findById("input").click().end()
					.pressKeys(keys.TAB).pressKeys(keys.SPACE)	// focus and click "short"
					.execute("var dialogRootNode = document.getElementById('short-dialog'); " +
						"var labelNode = document.getElementById(dialogRootNode.getAttribute('aria-labelledby')); " +
						"return labelNode.textContent;")
					.then(function (val) {
						assert.strictEqual(val, "My Dialog");
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
					.pressKeys(keys.ESCAPE);
			},

			nested: function () {
				return this.remote
					.findById("input").click().end()
					.pressKeys(keys.TAB).pressKeys(keys.TAB)
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "tall", "focus on button to open tall dialog");
					})
					.pressKeys(keys.SPACE)	// click "tall"
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "name2", "focus on open of tall dialog");
					})
					.pressKeys(keys.TAB).pressKeys(keys.TAB).pressKeys(keys.TAB)
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "nested", "tabbed to button to open nested dialog");
					})
					.pressKeys(keys.SPACE)	// open nested dialog
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "name3", "focus on open of nested dialog");
					})
					.pressKeys(keys.ESCAPE)	// close nested dialog
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "nested", "focus on close of tall dialog");
					})
					.pressKeys(keys.ESCAPE)   // close tall dialog
					.execute("return document.activeElement.id").then(function (id) {
						assert.strictEqual(id, "tall", "focus on close of tall dialog");
					});
			},

			scrollbars: function () {
				return this.remote
					.findById("tall").click().end()
					.execute("var dialog = document.getElementById('tall-dialog');\n return {" +
						"winHeight: window.innerHeight, " +
						"dialogOffsetHeight: dialog.offsetHeight, " +
						"dialogContainerOffsetHeight: dialog.containerNode.offsetHeight, " +
						"dialogContainerScrollHeight: dialog.containerNode.scrollHeight }").then(function (heights) {
						assert.isBelow(heights.dialogOffsetHeight, heights.winHeight,
							"dialog shorter than window");
						assert.isBelow(heights.dialogContainerOffsetHeight, heights.dialogOffsetHeight,
							"dialog container shorter than dialog");
						assert.isBelow(heights.dialogContainerOffsetHeight, heights.dialogContainerScrollHeight,
							"dialog container has scrollbar");
					})
					.pressKeys(keys.ESCAPE);
			}
		}
	});
});
