define([
	"intern", "intern!object", "intern/dojo/node!leadfoot/helpers/pollUntil", "intern/chai!assert",
	"intern/dojo/node!leadfoot/keys", "require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	function loadFile(remote, url) {
		return remote
			.get(require.toUrl(url))
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	function getTransformX(v) {
		var m = v.match(/matrix\(.*,.*,.*,.*,\s*(.*)\s*,.*\)/);
		if (m && m.length > 0) {
			return m[1];
		} else {
			m = v.match(/matrix3d\(.*,.*,.*,.*,.*,.*,.*,.*,.*,.*,.*,.*,\s*(.*)\s*,.*,.*,.*\)/);
			if (m && m.length > 0) {
				return m[1];
			} else {
				return "unknown transform";
			}
		}
	}
	
	registerSuite({
		name: "SwapView - functional",

		"SwapView load": function () {
			var remote = this.remote;
			return loadFile(remote, "./SwapView.html").findById("sv").then(function () {
				pollUntil("return document.getElementById('sv').className == 'd-swap-view d-view-stack'", [], 2000,
					intern.config.POLL_INTERVAL);
			})
				.execute("return document.getElementById('sv').children.length;")
				.then(function (v) {
					assert.equal(v, 3, "Wrong number of children in SwapView");
				})
			;
		},

		"ViewIndicator initialization": function () {
			var remote = this.remote;
			return remote
				.execute("return document.getElementById('vi').className;")
				.then(function (v) {
					assert.equal(v, "d-view-indicator", "Wrong class for ViewIndicator");
				})
				.execute("return document.getElementById('vi').children.length;")
				.then(function (v) {
					assert.equal(v, 3, "Wrong number of children in ViewIndicator");
				})
				.execute("return document.getElementById('vi').children[0].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 0");
					assert.include(v, "-d-view-indicator-dot-selected", "Missing class for vi child 0");
				})
				.execute("return document.getElementById('vi').children[1].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 1");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 1");
				})
				.execute("return document.getElementById('vi').children[2].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 2");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 2");
				})
			;
		},

		"SwapView swipe gesture (right->left)": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
			    return this.skip("moveMouseTo() broken");
			}
			return remote
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 200, 100);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 195, 100);
				})
				.end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.notInclude(v, " -d-swap-view-drag", "Swipe started before drag threshold");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 189, 100);
				})
				.end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.include(v, " -d-swap-view-drag", "Swipe not started after drag threshold");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 100, 100);
				}).end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.include(v, " -d-swap-view-drag", "Missing -d-swap-view-drag class during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[0]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "-100", "Wrong transform during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[1]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "300", "Wrong transform during swipe");
				})
				.releaseMouseButton()
				.sleep(500)
				.execute("return document.getElementById('sv').className;").then(function (v) {
					assert.notInclude(v, " -d-swap-view-drag", "-d-swap-view-drag class left after swipe");
				})
				.execute("return document.getElementById('sv').children[0].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 0 should still be visible after swipe 100");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 310, 100);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 100, 100);
				})
				.end()
				.sleep(50)
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[0]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "-208", "Wrong transform during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[1]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "188", "Wrong transform during swipe");
				})
				.releaseMouseButton()
				.sleep(500)
				.execute("return document.getElementById('sv').children[0].style.visibility;")
				.then(function (v) {
					assert.equal(v, "hidden", "child 0 should be hidden after swipe > 200");
				})
				.execute("return document.getElementById('sv').children[1].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 1 should be visible after swipe > 200");
				})
				;
		},

		"ViewIndicator update": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo() broken");
			}
			return remote
				.execute("return document.getElementById('vi').children[0].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 0");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 0");
				})
				.execute("return document.getElementById('vi').children[1].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 1");
					assert.include(v, "-d-view-indicator-dot-selected", "Extra class for vi child 1");
				})
				.execute("return document.getElementById('vi').children[2].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 2");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 2");
				})
				;
		},

		"SwapView swipe gesture (left->right)": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo() broken");
			}
			return remote
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 200, 100);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 205, 100);
				})
				.end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.notInclude(v, " -d-swap-view-drag", "Swipe started before drag threshold");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 211, 100);
				})
				.end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.include(v, " -d-swap-view-drag", "Swipe not started after drag threshold");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 300, 100);
				}).end()
				.sleep(50)
				.execute("return document.getElementById('sv').className;")
				.then(function (v) {
					assert.include(v, " -d-swap-view-drag", "Missing -d-swap-view-drag class during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[0]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "-300", "Wrong transform during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[1]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "100", "Wrong transform during swipe");
				})
				.releaseMouseButton()
				.sleep(500)
				.execute("return document.getElementById('sv').className;").then(function (v) {
					assert.notInclude(v, " -d-swap-view-drag", "-d-swap-view-drag class left after swipe");
				})
				.execute("return document.getElementById('sv').children[1].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 1 should still be visible after swipe 100");
				})
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 90, 100);
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.findById("sv")
				.then(function (element) {
					return remote.moveMouseTo(element, 300, 100);
				})
				.end()
				.sleep(50)
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[0]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "-188", "Wrong transform during swipe");
				})
				.execute("var s = window.getComputedStyle(document.getElementById('sv').children[1]);" +
					"return s.webkitTransform || s.transform;")
				.then(function (v) {
					assert.equal(getTransformX(v), "208", "Wrong transform during swipe");
				})
				.releaseMouseButton()
				.sleep(500)
				.execute("return document.getElementById('sv').children[0].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 0 should be visible after swipe > 200");
				})
				.execute("return document.getElementById('sv').children[1].style.visibility;")
				.then(function (v) {
					assert.equal(v, "hidden", "child 1 should be hidden after swipe > 200");
				})
				;
		},

		"ViewIndicator click dot": function () {
			var remote = this.remote;
			if (/iOS/.test(remote.environmentType.browserName)) {
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
		},

		"ViewIndicator click left": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo() broken");
			}
			return remote
				.findById("vi")
				.then(function (element) {
					return remote.moveMouseTo(element, 100, 5);		// click to left of the dots
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.releaseMouseButton()
				.sleep(500)
				.execute("return document.getElementById('vi').children[0].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 0");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 0");
				})
				.execute("return document.getElementById('vi').children[1].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 1");
					assert.include(v, "-d-view-indicator-dot-selected", "Missing class for vi child 1");
				})
				.execute("return document.getElementById('vi').children[2].className;")
				.then(function (v) {
					assert.include(v, "-d-view-indicator-dot", "Missing class for vi child 2");
					assert.notInclude(v, "-d-view-indicator-dot-selected", "Extra class for vi child 2");
				})
				;
		},

		"ViewIndicator click right": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo() broken");
			}
			return remote
				.findById("vi")
				.then(function (element) {
					return remote.moveMouseTo(element, 300, 5);		// click to right of the dots
				})
				.end()
				.pressMouseButton()
				.sleep(50)
				.releaseMouseButton()
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
		},

		"SwapView keyboard accessibility": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				// keyboard navigation
				.execute("var sv = document.getElementById('sv'); sv.show(sv.children[2]); return true;")
				.sleep(400)
				.findById("b1")	// focus the button to have a ref starting point in the chain
				.click()
				.end()
				.pressKeys(keys.TAB) // Press TAB -> swapview
				.sleep(400)
				.getActiveElement()
				.getAttribute("class")
				.then(function (v) {
					assert.include(v, "d-swap-view", "SwapView should be focused after 1st TAB.");
				})
				.end()
				.pressKeys(keys.PAGE_DOWN) // previous -> child 1
				.sleep(500)
				.execute("return document.getElementById('sv').children[1].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 1 should be visible after Page Down key");
				})
				.pressKeys(keys.PAGE_UP) // next -> child 2
				.sleep(500)
				.execute("return document.getElementById('sv').children[2].style.visibility;")
				.then(function (v) {
					assert.equal(v, "visible", "child 2 should be visible after Page Up key");
				})
				.pressKeys(keys.TAB) // Press TAB -> End button
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.equal(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				.end()
				;
		}
	});
});
