define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;

	registerSuite("AriaListbox tests", {
		"selectionMode 'multiple'": function () {
			var remote = this.remote;
			var listId = "list-mark-1";
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-1.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.querySelector('#" + listId + " .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.findByCssSelector("#" + listId + " div")
						.getAttribute("role")
						.then(function (value) {
							assert.strictEqual(value, "listbox");
						})
						.end()
						.findByCssSelector("#" + listId + " [role=option]:nth-child(3)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true");
						})
						.end()
						.findByCssSelector("#" + listId + " [role=option]:nth-child(4)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true");
						})
						.end()
						.findByCssSelector("#" + listId + " [role=option]:nth-child(3)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true");
						})
						.end();
				});
		},

		"selectionMode 'single'": function () {
			var remote = this.remote;
			var listId = "list-mark-2";
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-2.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.querySelector('#" + listId + " .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.findByCssSelector("#" + listId + " [role=option]:nth-child(3)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "test 1");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true", "test 2");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "test 3");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true", "test 4");
						})
						.end()
						.findByCssSelector("#" + listId + " [role=option]:nth-child(4)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "test 5");
						})
						.click()
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true", "test 6");
						})
						.end()
						.findByCssSelector("#" + listId + " [role=option]:nth-child(3)")
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "test 7");
						})
						.end();
				});
		},

		"keyboard navigation with default renderers": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.get("deliteful/tests/functional/list/listbox-prog-1.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-prog-1') "
					+ "&& !document.querySelector('#list-prog-1 .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.pressKeys(keys.TAB)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 0\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.ARROW_DOWN)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.ARROW_DOWN)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.ARROW_RIGHT)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.ENTER)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.ARROW_UP)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.TAB)
						.pressKeys(keys.SHIFT + keys.TAB)
						.pressKeys(keys.SHIFT) // release shift
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
						})
						.end()
						.pressKeys(keys.F2)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
						})
						.end();
				});
		},

		"keyboard navigation with categorized items": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-3.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-3') "
					+ "&& !document.querySelector('#list-mark-3 .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.pressKeys(keys.TAB)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nA");
						})
						.end()
						.pressKeys(keys.ARROW_DOWN) 	//5 times
						.pressKeys(keys.ARROW_DOWN)
						.pressKeys(keys.ARROW_DOWN)
						.pressKeys(keys.ARROW_DOWN)
						.pressKeys(keys.ARROW_DOWN)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 5\nB");
						})
						.end();
				});
		},

		// TODO: ADD A TEST: CLICKING ON A CATEGORY HEADER (see https://github.com/ibm-js/delite/issues/229)
		"keyboard multiple selection": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-1.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.querySelector('#list-mark-1 .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.pressKeys(keys.TAB)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.end()
						.pressKeys(keys.SPACE)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true");
						})
						.end()
						.pressKeys(keys.SPACE)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false");
						})
						.end();
				});
		},

		"keyboard single selection": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-2.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-2') "
					+ "&& !document.querySelector('#list-mark-2 .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.pressKeys(keys.TAB)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text 1", "keystroke 1");
						})
						.end()
						.pressKeys(keys.SPACE)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text 1", "keystroke 2");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "true", "keystroke 2");
						})
						.end()
						.sleep(10)
						.pressKeys(keys.SPACE)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text 1", "keystroke 3");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "keystroke 3");
						})
						.end()
						.pressKeys(keys.END)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 9\nright text 10", "keystroke 4");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "keystroke 4");
						})
						.end()
						.pressKeys(keys.PAGE_DOWN)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 9\nright text 10", "keystroke 5");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "keystroke 5");
						})
						.end()
						.pressKeys(keys.HOME)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text 1", "keystroke 6");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "keystroke 6");
						})
						.end()
						.pressKeys(keys.PAGE_UP)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text 1", "keystroke 7");
						})
						.getAttribute("aria-selected")
						.then(function (value) {
							assert.strictEqual(value, "false", "keystroke 7");
						})
						.end();
				});
		},

		"keyboard search": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.get("deliteful/tests/functional/list/listbox-mark-1.html")
				.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.querySelector('#list-mark-1 .d-list-container')"
					+	".getAttribute('aria-busy') === false) ? true : null;",
				[],
				intern.config.WAIT_TIMEOUT,
				intern.config.POLL_INTERVAL))
				.then(function () {
					return remote
						.pressKeys(keys.TAB)
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.end()
						.pressKeys("R")
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.end()
						.sleep(10)
						.pressKeys("r")
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 0\nright text A");
						})
						.end()
						.sleep(10)
						.pressKeys("L")
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 1\nright text B");
						})
						.end()
						.sleep(10)
						.pressKeys("l")
						.getActiveElement()
						.getVisibleText()
						.then(function (value) {
							assert.strictEqual(value, "list item 2\nright text C");
						})
						.end();
				});
		}
	});
});
