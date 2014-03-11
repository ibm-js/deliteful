define(["intern!object",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, assert, require) {

	var WAIT_TIMEOUT_MS = 180000;
	
	var WAIT_POLLING_MS = 200;

	var TEST_TIMEOUT_MS = 240000;

	var basicTest = function (remote, testPage, listId, numberOfItemsExpected, numberOfCategoriesExpected, itemTag) {
		return remote
		.get(require.toUrl(testPage))
		.waitForCondition("'ready' in window &&  ready "
				+ "&& document.getElementById('" + listId + "') "
				+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
				WAIT_TIMEOUT_MS,
				WAIT_POLLING_MS)
		.then(function () {
			return remote
			.elementById(listId)
				.elementsByTagName(itemTag)
					.then(function (result) {
						assert.equal(result.length, numberOfItemsExpected,
								listId + " number of list items is not the expected one");
						// TODO: check the label on each item
					})
				.elementsByTagName("d-list-category-renderer")
					.then(function (result) {
						assert.equal(result.length, numberOfCategoriesExpected,
								listId + " number of category headers is not the expected one");
					})
					// TODO: scroll ?
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
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
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
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
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
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]")
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
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
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
			.get(require.toUrl("./list-mark-2.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('" + listId + "') "
					+ "&& !document.getElementById('" + listId + "').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
					})
					.click()
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, "true");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("aria-selected")
					.then(function (value) {
						assert.equal(value, null);
					})
					.end();
			});
		},
		"keyboard navigation": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-prog-1.html"))
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
				.keys("\uE012") // Press LEFT ARROW
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
				.end();
			});
		},
		"keyboard multiple selection": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-mark-1.html"))
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
				.keys("\uE006") // Press ENTER
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
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-mark-2.html"))
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
					assert.equal(value, "list item 0\nright text 1");
				})
				.end()
				.keys("\uE006") // Press ENTER
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1");
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
					assert.equal(value, "list item 0\nright text 1");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, null);
				})
				.end()
				.keys("\uE010") // Press END
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, null);
				})
				.end()
				.keys("\uE011") // Press HOME
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1");
				})
				.getAttribute("aria-selected")
				.then(function (value) {
					assert.equal(value, null);
				})
				.end()
				.keys("\uE013") // Press UP ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1");
				})
				.end();
			});
		},
		"keyboard search using default renderers": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-mark-3.html"))
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
					assert.equal(value, "A");
				})
				.end()
				.keys("B")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "B");
				})
				.end()
				.wait(10)
				.keys("l")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 5\nB");
				})
				.end()
				.wait(10)
				.keys("L")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 6\nB");
				})
				.end()
				.wait(10)
				.keys("l")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 7\nB");
				})
				.end()
				.wait(10)
				.keys("B")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "B");
				})
				.end()
				.wait(10)
				.keys("A")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "A");
				})
				.end()
				.wait(10)
				.keys("l")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nA");
				})
				.end();
			});
		},
		"custom keyboard navigation": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-cust-1.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-cust-1') "
					+ "&& !document.getElementById('list-cust-1').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "6 navindex -2");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "1 navindex -1");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "4 navindex 0");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "2 navindex 1");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "5 navindex 1");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "6 navindex -2");
				})
				.end();
			});
		},
		"custom keyboard navigation in items and renderers": function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-cust-2.html"))
			.waitForCondition("'ready' in window &&  ready "
					+ "&& document.getElementById('list-cust-2') "
					+ "&& !document.getElementById('list-cust-2').hasAttribute('aria-busy')",
					WAIT_TIMEOUT_MS,
					WAIT_POLLING_MS)
			.then(function () {
				remote
				.keys("\uE004") // Press TAB
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "FNAC\nWebsite: http://www.fnac.com");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "FNAC");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Website: http://www.fnac.com");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "FNAC");
				})
				.end()
				.keys("\uE015") // Press DOWN ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Dojo: The Definitive Guide\nISBN: 0596516487");
				})
				.end()
				.keys("\uE012") // Press LEFT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "ISBN: 0596516487");
				})
				.end()
				.keys("\uE012") // Press LEFT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Dojo: The Definitive Guide");
				})
				.end();
			});
		}
	});
});