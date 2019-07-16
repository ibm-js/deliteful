define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;

	function loadFile(remote, fileName) {
		return remote
			.get(require.toUrl("deliteful/tests/functional/" + fileName))
			.then(pollUntil("return ('ready' in window &&  ready) ? true : null", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	function checkCssClasses(classString /*,  expected_class ... */) {
		var nodeClasses = classString.split(" ");
		var expectedClasses = Array.prototype.slice.call(arguments, 1);
		expectedClasses.forEach(function (cls) {
			assert(nodeClasses.indexOf(cls) >= 0, "SidePane class " + classString + " should contain " + cls);
		});
	}

	function isVisible(remote, v) {
		var errMsg = "SidePane should be" + (v ? " " : " not ") + "visible";
		return remote.findById("sp")
			.getComputedStyle("display").then(function (value) {
				assert.strictEqual(value, (v ? "block" : "none"), errMsg);
			}).getComputedStyle("visibility").then(function (value) {
				assert.strictEqual(value, (v ? "visible" : "hidden"), errMsg);
			}).getAttribute("class").then(function (classString) {
				checkCssClasses(classString, v ? "-d-side-pane-visible" : "-d-side-pane-hidden");
			}).end();
	}

	registerSuite("SidePane", {
		before: function () {
			return loadFile(this.remote, "SidePane.html");
		},

		tests: {
			"test initial state": function () {
				var remote = this.remote;
				return this.remote.findById("sp").getAttribute("class").then(function (classString) {
					checkCssClasses(classString, "d-side-pane", "-d-side-pane-push", "-d-side-pane-start",
						"-d-side-pane-hidden", "-d-side-pane-animate");
				}).end()
				.then(function () {
					return isVisible(remote, false);
				});
			},

			"test opening": function () {
				if (/safari/i.test(this.remote.environmentType.browserName)
					|| this.remote.environmentType.safari) {
					return this.skip("Interactions tests are broken on Mac and iOS simulators. See #25");
				}

				var remote = this.remote;
				return this.remote.findById("showButton").click().end()
					.sleep(800)
					.then(function () {
						return isVisible(remote, true);
					}).end();
			},

			"test closing": function () {
				if (/safari/i.test(this.remote.environmentType.browserName)
					|| this.remote.environmentType.safari) {
					return this.skip("Interactions tests are broken on Mac and iOS simulators. See #25");
				}

				var remote = this.remote;
				return this.remote.findById("hideButton").click().end()
					.sleep(800)
					.then(function () {
						return isVisible(remote, false);
					}).end();
			}/*,

			"test swipe closing": function () {
				if (/safari/i.test(this.remote.environmentType.browserName)
					|| this.remote.environmentType.safari) {
					return this.skip("Interactions tests are broken on Mac and iOS simulators. See #25");
				}

				var remote = this.remote;
				return this.remote.findById("showButton").click().end().sleep(800)
					.findById("page").moveMouseTo(30, 300).pressMouseButton().moveMouseTo(10, 300)
					.sleep(800)
					.then(function () {
						return isVisible(remote, false);
					});
			}*/
		}
	});
});
