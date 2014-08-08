define(["intern!object",
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/dojo/node!leadfoot/keys",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, pollUntil, keys, assert, require) {

	var WAIT_TIMEOUT_MS = 180000;
	
	var WAIT_POLLING_MS = 200;

	var TEST_TIMEOUT_MS = 240000;

	var basicTest = function (remote, testPage, listId, numberOfItemsExpected, numberOfCategoriesExpected, itemTag) {
		return remote
		.get(require.toUrl(testPage))
		.then(pollUntil("return ('ready' in window &&  ready "
				+ "&& document.getElementById('" + listId + "') "
				+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')) ? true : null;",
				[],
				WAIT_TIMEOUT_MS,
				WAIT_POLLING_MS))
		.then(function () {
			return remote
			.findById(listId)
				.findAllByTagName(itemTag)
					.then(function (result) {
						assert.strictEqual(result.length, numberOfItemsExpected,
								listId + " number of list items is not the expected one");
						// TODO: check the label on each item
					})
					.end()
				.findAllByTagName("d-list-category-renderer")
					.then(function (result) {
						assert.strictEqual(result.length, numberOfCategoriesExpected,
								listId + " number of category headers is not the expected one");
					})
					// TODO: scroll ?
					.end()
				.end();
		});
	};

	registerSuite({
		name: "List tests",
		"list-prog-1.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-prog-1.html", "list-prog-1", 100, 0, "d-list-item-renderer");
		},
		"list-prog-2.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-prog-2.html", "list-prog-2", 100, 0, "d-list-item-renderer");
		},
		"list-prog-3.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-prog-3.html", "list-prog-3", 100, 0, "d-list-item-renderer");
		},
		"list-prog-4.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-prog-4.html", "list-prog-4", 100, 0, "d-list-item-renderer");
		},
		"list-prog-5.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-prog-5.html", "list-prog-5", 100, 0, "d-list-item-renderer");
		},
		"list-mark-1.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-mark-1.html", "list-mark-1", 10, 0, "d-list-item-renderer");
		},
		"list-mark-2.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-mark-2.html", "list-mark-2", 10, 0, "d-list-item-renderer");
		},
		"list-mark-3.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-mark-3.html", "list-mark-3", 10, 2, "d-list-item-renderer");
		},
		"list-mark-4.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-mark-4.html", "list-mark-4", 10, 0, "d-list-item-renderer");
		},
		"list-cust-1.html": function () {
			this.timeout = TEST_TIMEOUT_MS;
			return basicTest(this.remote, "./list-cust-1.html", "list-cust-1", 40, 0, "d-customnav-item");
		},
		"selectionMode 'none'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-3";
			return remote
			.get(require.toUrl("./list-mark-3.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.strictEqual(value, null);
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.strictEqual(value, null);
					})
					.end();
			});
		},
		"selectionMode 'multiple'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-1";
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
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
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[4]/div")
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
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.strictEqual(value, "true");
					})
					.end();
			});
		},
		"selectionMode 'single'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-2";
			return remote
			.get(require.toUrl("./list-mark-2.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
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
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[4]/div")
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
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.strictEqual(value, "false");
					})
					.end();
			});
		},
		"selectionMode 'radio'": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			var listId = "list-mark-5";
			return remote
			.get(require.toUrl("./list-mark-5.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
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
						assert.strictEqual(value, "true");
					})
					.end()
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[4]/div")
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
				.findByXpath("//*[@id='" + listId + "']//d-list-item-renderer[3]/div")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.strictEqual(value, "false");
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
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-prog-1.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-prog-1') "
					+ "&& !document.getElementById('list-prog-1').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 0\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.ARROW_RIGHT) // Press RIGHT ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.ENTER) // Press ENTER
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 2\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.ARROW_UP) // Press UP ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.pressKeys(keys.SHIFT + keys.TAB) // Press Shift + TAB
				.pressKeys(keys.SHIFT) // release shift
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end()
				.pressKeys(keys.F2) // Press F2
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Programmatic item of order 1\nlist-prog-1");
				})
				.end();
			});
		},
		"keyboard navigation with custom renderers": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-cust-2.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-cust-2') "
					+ "&& !document.getElementById('list-cust-2').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Amazon\nhttp://www.amazon.com", "keystroke 1");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide\nISBN: 0596516487", "keystroke 2");
				})
				.end()
				.pressKeys(keys.ARROW_UP) // Press UP ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Amazon\nhttp://www.amazon.com", "keystroke 3");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide\nISBN: 0596516487", "keystroke 4");
				})
				.end()
				.pressKeys(keys.ARROW_RIGHT) // Press RIGHT ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide\nISBN: 0596516487", "keystroke 5");
				})
				.end()
				.pressKeys(keys.ENTER) // Press ENTER
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 6");
				})
				.end()
				.pressKeys(keys.SHIFT + keys.TAB) // Press Shift + TAB
				.pressKeys(keys.SHIFT) // release shift
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "http://www.amazon.com", "keystroke 7");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 8");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "ISBN: 0596516487", "keystroke 9");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: Using the Dojo JavaScript Library to Build Ajax Applications",
							"keystroke 10");
				})
				.end()
				.pressKeys(keys.SHIFT + keys.TAB)
				.pressKeys(keys.SHIFT) // release shift
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "ISBN: 0596516487", "keystroke 11");
				})
				.end()
				.pressKeys(keys.SHIFT + keys.TAB)
				.pressKeys(keys.SHIFT) // release shift
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 12");
				})
				.end()
				.pressKeys(keys.ARROW_UP) // Press UP ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 13");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 14");
				})
				.end()
				.pressKeys(keys.ESCAPE) // Press ESC
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide\nISBN: 0596516487", "keystroke 15");
				})
				.end()
				.pressKeys(keys.SHIFT + keys.TAB)
				.pressKeys(keys.SHIFT) // release shift
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide\nISBN: 0596516487", "keystroke 16");
				})
				.end()
				.pressKeys(keys.F2) // Press F2
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Dojo: The Definitive Guide", "keystroke 17");
				})
				.end();
			});
		},
		"keyboard multiple selection": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.getElementById('list-mark-1').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text A");
				})
				.end()
				.pressKeys(keys.SPACE) // Press SPACE
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
				.pressKeys(keys.SPACE) // Press SPACE
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
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-mark-2.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-2') "
					+ "&& !document.getElementById('list-mark-2').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 1");
				})
				.end()
				.pressKeys(keys.SPACE) // Press SPACE
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
				.pressKeys(keys.SPACE) // Press SPACE
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
				.pressKeys(keys.END) // Press END
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 4");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "false", "keystroke 4");
				})
				.end()
				.pressKeys(keys.PAGE_DOWN) // Press PAGE DOWN
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
				.pressKeys(keys.HOME) // Press HOME
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 9\nright text 10", "keystroke 6");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "false", "keystroke 6");
				})
				.end()
				.pressKeys(keys.PAGE_UP) // Press PAGE UP
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 7");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "false", "keystroke 7");
				})
				.end()
				.pressKeys(keys.ARROW_UP) // Press UP ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 9\nright text 10", "keystroke 8");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 9");
				})
				.end();
			});
		},
		"keyboard radio selection": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-mark-5.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-5') "
					+ "&& !document.getElementById('list-mark-5').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 1");
				})
				.end()
				.pressKeys(keys.SPACE) // Press SPACE
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
				.pressKeys(keys.SPACE) // Press SPACE
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 3");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "true", "keystroke 3");
				})
				.end()
				.pressKeys(keys.END) // Press END
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 4");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "true", "keystroke 4");
				})
				.end()
				.pressKeys(keys.PAGE_DOWN) // Press PAGE DOWN
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
				.pressKeys(keys.HOME) // Press HOME
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 9\nright text 10", "keystroke 6");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "false", "keystroke 6");
				})
				.end()
				.pressKeys(keys.PAGE_UP) // Press PAGE UP
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 7");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.strictEqual(value, "true", "keystroke 7");
				})
				.end()
				.pressKeys(keys.ARROW_UP) // Press UP ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 9\nright text 10", "keystroke 8");
				})
				.end()
				.pressKeys(keys.ARROW_DOWN) // Press DOWN ARROW
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "list item 0\nright text 1", "keystroke 9");
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
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-mark-1') "
					+ "&& !document.getElementById('list-mark-1').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
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
		},
		"custom keyboard navigation": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return remote
			.get(require.toUrl("./list-cust-1.html"))
			.then(pollUntil("return ('ready' in window &&  ready "
					+ "&& document.getElementById('list-cust-1') "
					+ "&& !document.getElementById('list-cust-1').hasAttribute('aria-busy')) ? true : null;",
					[],
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS))
			.then(function () {
				remote
				.pressKeys(keys.TAB) // Press TAB
				.pressKeys(keys.ENTER) // Press ENTER
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "6 navindex -2");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "1 navindex -1");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "4 navindex 0");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "2 navindex 1");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "5 navindex 1");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB
				.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "6 navindex -2");
				})
				.end();
			});
		}
	});
});
