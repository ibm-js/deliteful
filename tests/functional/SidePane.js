/**
 * SidePane functional tests
 */
define(["intern!object",
	"intern/chai!assert",
	"require"
], function (registerSuite, assert, require) {
	registerSuite({
		name: "SidePane",
		"init": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./SidePane.html").wait(50);
		},
		"test initial state": function () {
			var remote = this.remote;
			var element = remote.elementById("sp");
			var test = element.getAttribute("class").then(function (classString) {
				checkCssClasses(classString, "d-side-pane", "-d-side-pane-push", "-d-side-pane-start",
					"-d-side-pane-hidden", "-d-side-pane-animate");
			});
			test = test.then(isVisible(element, false));

			return test;
		// Interactions tests are broken on Mac and iOS simulators. See #25
		},
		"test opening": function () {
			if (/safari|iPhone|iPad/.test(this.remote.environmentType.browserName)
				|| this.remote.environmentType.safari) {
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return this.remote.elementById("showButton").click().end()
				.wait(800)
				.then(isVisible(this.remote.elementById("sp"), true));
		},
		"test closing": function () {
			if (/safari|iPhone|iPad/.test(this.remote.environmentType.browserName)
				|| this.remote.environmentType.safari) {
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return this.remote.elementById("hideButton").click().end()
				.wait(800)
				.then(isVisible(this.remote.elementById("sp"), false));
		},
		"test swipe closing": function () {
			if (/safari|iPhone|iPad/.test(this.remote.environmentType.browserName)
				|| this.remote.environmentType.safari) {
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return this.remote.elementById("showButton").click().end().wait(800)
				.elementById("page").moveTo(30, 300).buttonDown().moveTo(10, 300)
				.wait(800)
				.then(isVisible(this.remote.elementById("sp"), false));
		}
	});

	function checkCssClasses(classString, args) {
		args = Array.prototype.slice.call(arguments);
		args.shift();
		var nodeClasses = classString.split(" ");
		var cls;
		while (args.length > 0) {
			cls = args.shift();
			assert.isTrue(nodeClasses.indexOf(cls) !== -1,
					"SidePane should contains the class " + cls);
		}
	}

	function isVisible(element, v) {
		var errMsg = "SidePane should be" + (v ? " ":" not ") + "visible";
		element.getComputedCss("display").then(function (value) {
			assert.isTrue(value === (v ? "block" : "none"), errMsg);
		});
		element.getComputedCss("visibility").then(function (value) {
			assert.isTrue(value === (v ? "visible" : "hidden"), errMsg);
		});
		element.getAttribute("class").then(function (classString) {
			checkCssClasses(classString, v ? "-d-side-pane-visible" : "-d-side-pane-hidden");
		});
	}

	function loadTestPage(remote, url) {
		return remote
			.get(require.toUrl(url))
			.waitForCondition("'ready' in window &&  ready", 10000, 1000)
			.then(function () {
				return remote.end();
			});
	}
});
