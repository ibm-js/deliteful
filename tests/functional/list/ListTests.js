define(["intern!object",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, assert, require) {

	var basicTest = function (remote, testPage, listId, numberOfItemsExpected, numberOfCategoriesExpected, itemTag) {
		return remote
		.get(require.toUrl(testPage))
		.waitForCondition("ready", 60000)
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
		name: "ListGallery tests",
		"ListGallery.html / list-prog-1": function () {
			return basicTest(this.remote, "./list-prog-1.html", "list-prog-1", 100, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-prog-2": function () {
			return basicTest(this.remote, "./list-prog-2.html", "list-prog-2", 100, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-prog-3": function () {
			return basicTest(this.remote, "./list-prog-3.html", "list-prog-3", 100, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-prog-4": function () {
			return basicTest(this.remote, "./list-prog-4.html", "list-prog-4", 100, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-prog-5": function () {
			var def = this.async(1000);
			var remote = this.remote;
			setTimeout(def.callback(function () {
				try {
					basicTest(remote, "./list-prog-5.html", "list-prog-4", 100, 0, "d-list-item-renderer");
				} catch (e) {
					def.reject(e);
				}
			}), 500);
			return def;
		},
		"ListGallery.html / list-mark-1": function () {
			return basicTest(this.remote, "./list-mark-1.html", "list-mark-1", 10, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-mark-2": function () {
			return basicTest(this.remote, "./list-mark-2.html", "list-mark-2", 10, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-mark-3": function () {
			return basicTest(this.remote, "./list-mark-3.html", "list-mark-3", 10, 2, "d-list-item-renderer");
		},
		"ListGallery.html / list-mark-4": function () {
			return basicTest(this.remote, "./list-mark-4.html", "list-mark-4", 10, 0, "d-list-item-renderer");
		},
		"ListGallery.html / list-cust-1": function () {
			return basicTest(this.remote, "./list-cust-1.html", "list-cust-1", 40, 0, "d-customnav-item");
		},
		"selectionMode 'none'": function () {
			var remote = this.remote;
			var listId = "list-mark-3";
			return remote
			.get(require.toUrl("./list-mark-3.html"))
			.waitForCondition("ready", 60000)
			.then(function () {
				remote
				.execute("document.getElementById('" + listId + "').scrollIntoView();")
				.wait(500)
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.end();
			});
		},
		"selectionMode 'multiple'": function () {
			var remote = this.remote;
			var listId = "list-mark-1";
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.waitForCondition("ready", 60000)
			.then(function () {
				remote
				.execute("document.getElementById('" + listId + "').scrollIntoView();")
				.wait(500)
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.end();
			});
		},
		"selectionMode 'single'": function () {
			var remote = this.remote;
			var listId = "list-mark-2";
			return remote
			.get(require.toUrl("./list-mark-2.html"))
			.waitForCondition("ready", 60000)
			.then(function () {
				remote
				.execute("document.getElementById('" + listId + "').scrollIntoView();")
				.wait(500)
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[4]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.click()
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item d-selected");
					})
					.end()
				.elementByXPath("//*[@id='" + listId + "']//d-list-item-renderer[3]")
					.getAttribute("className")
					.then(function (className) {
						assert.equal(className, "d-list-item");
					})
					.end();
			});
		},
		"keyboard navigation": function () {
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-prog-1.html"))
			.waitForCondition("ready", 60000)
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
					assert.equal(value, "Programmatic item of order 2");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list-prog-1");
				})
				.end()
				.keys("\uE014") // Press RIGHT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "Programmatic item of order 2");
				})
				.end()
				.keys("\uE012") // Press LEFT ARROW
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list-prog-1");
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
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.waitForCondition("ready", 60000)
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
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item d-selected");
				})
				.end()
				.keys("\uE006") // Press ENTER
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text A");
				})
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item");
				})
				.end();
			});
		},
		"keyboard single selection": function () {
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return remote
			.get(require.toUrl("./list-mark-2.html"))
			.waitForCondition("ready", 60000)
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
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item d-selected");
				})
				.end()
				.keys("\uE00D") // Press SPACE
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1");
				})
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item");
				})
				.end()
				.keys("\uE010") // Press END
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 9\nright text 10");
				})
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item");
				})
				.end()
				.keys("\uE011") // Press HOME
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 0\nright text 1");
				})
				.getAttribute("className")
				.then(function (value) {
					assert.equal(value, "d-list-item");
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
		"keyboard search": function () {
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			this.timeout = 120000; // very slow on IE
			return remote
			.get(require.toUrl("./list-mark-1.html"))
			.waitForCondition("ready", 60000)
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
					assert.equal(value, "right text A");
				})
				.end()
				.wait(10)
				.keys("r")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "right text B");
				})
				.end()
				.wait(10)
				.keys("L")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 2");
				})
				.end()
				.wait(10)
				.keys("l")
				.active()
				.text()
				.then(function (value) {
					assert.equal(value, "list item 3");
				})
				.end();
			});
		},
		"custom keyboard navigation": function () {
			var remote = this.remote;
			if (/safari|iPhone/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			this.timeout = 120000; // very slow on IE
			return remote
			.get(require.toUrl("./list-cust-1.html"))
			.waitForCondition("ready", 60000)
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
		}
	});
});