define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;

	function loadFile(remote, fileName) {
		return remote
			.get("deliteful/tests/functional/" + fileName)
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	registerSuite("SwapView - functional", {
		"SwapView load": function () {
			var remote = this.remote;
			return loadFile(remote, "SwapView.html").findById("sv").then(function () {
				pollUntil("return document.getElementById('sv').className == 'd-swap-view d-view-stack'", [], 2000,
					intern.config.POLL_INTERVAL);
			})
				.execute("return document.getElementById('sv').children.length;")
				.then(function (v) {
					assert.equal(v, 3, "Wrong number of children in SwapView");
				})
			;
		},

		"ViewIndicator click dot": function () {
			var remote = this.remote;
			if (this.remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("clicking dot on iOS works manually, but not via webdriver");
			}
			return remote
				.findByCssSelector("#vi > *:nth-child(3)")
				.click()
				.sleep(500)
				.execute("return document.getElementById('vi').children[0].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 0");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 0");
				})
				.execute("return document.getElementById('vi').children[1].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 1");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 1");
				})
				.execute("return document.getElementById('vi').children[2].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 2");
					assert.include(v, "-d-view-indicator-dot-selected", "Missing class for vi child 2");
				})
			;
		}
	});
});
