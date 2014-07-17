define(["intern!object",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, assert, require) {

	var WAIT_TIMEOUT_MS = 180000;
	
	var WAIT_POLLING_MS = 200;

	var TEST_TIMEOUT_MS = 240000;

	registerSuite({
		name: "AriaListbox tests",
		"selectionMode 'multiple'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-1";
			return remote
			.get(require.toUrl("./listbox-mark-1.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.end();
			});
		},
		"selectionMode 'single'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-2";
			return remote
			.get(require.toUrl("./listbox-mark-2.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false", "test 1");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true", "test 2");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false", "test 3");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true", "test 4");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false", "test 5");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true", "test 6");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "false", "test 7");
					})
					.end();
			});
		},
		"keyboard navigation with default renderers": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
			.get(require.toUrl("./listbox-prog-1.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-prog-1') "
					+ "&& !document.getElementById('list-prog-1').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 0\nlist-prog-1");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.keys("\uE006") // Press ENTER
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.keys("\uE013") // Press UP ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.keys("\uE004") // Press TAB
				.keys("\uE008\uE004") // Press Shift + TAB
				.keys("\uE008") // release shift
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.keys("\uE032") // Press F2
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end();
			});
		},
		"keyboard navigation with categorized items": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
			.get(require.toUrl("./listbox-mark-3.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-3') "
					+ "&& !document.getElementById('list-mark-3').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nA");
				})
				.end()
				.keys("\uE013") // Press UP ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nB");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nA");
				})
				.keys("\uE015") // Press DOWN ARROW 5 times
				.keys("\uE015")
				.keys("\uE015")
				.keys("\uE015")
				.keys("\uE015")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 5\nB");
				})
				.end();
			});
		},
		// TODO: ADD A TEST: CLICKING ON A CATEGORY HEADER (see https://github.com/ibm-js/delite/issues/229)
		"keyboard multiple selection": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
			.get(require.toUrl("./listbox-mark-1.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.getElementById('list-mark-1').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.end()
				.keys("\uE00D") // Press SPACE
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "true");
				})
				.end()
				.keys("\uE00D") // Press SPACE
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false");
				})
				.end();
			});
		},
		"keyboard single selection": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
			.get(require.toUrl("./listbox-mark-2.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-2') "
					+ "&& !document.getElementById('list-mark-2').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 1");
				})
				.end()
				.keys("\uE00D") // Press SPACE
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 2");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "true", "keystroke 2");
				})
				.end()
				.wait(10)
				.keys("\uE00D") // Press SPACE
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 3");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false", "keystroke 3");
				})
				.end()
				.keys("\uE010") // Press END
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 4");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false", "keystroke 4");
				})
				.end()
				.keys("\uE00F") // Press PAGE DOWN
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10", "keystroke 5");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false", "keystroke 5");
				})
				.end()
				.keys("\uE011") // Press HOME
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10", "keystroke 6");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false", "keystroke 6");
				})
				.end()
				.keys("\uE00E") // Press PAGE UP
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 7");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, "false", "keystroke 7");
				})
				.end()
				.keys("\uE013") // Press UP ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10", "keystroke 8");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1", "keystroke 9");
				})
				.end();
			});
		},
		"keyboard search": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
			.get(require.toUrl("./listbox-mark-1.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.getElementById('list-mark-1').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.end()
				.keys("R")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.end()
				.wait(10)
				.keys("r")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.end()
				.wait(10)
				.keys("L")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 1\nright text B");
				})
				.end()
				.wait(10)
				.keys("l")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 2\nright text C");
				})
				.end();
			});
		}
	});
});