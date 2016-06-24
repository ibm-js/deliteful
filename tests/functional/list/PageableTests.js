define(["intern",
        "intern!object",
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/dojo/node!leadfoot/keys",
        "intern/chai!assert",
        "require"
        ], function (intern, registerSuite, pollUntil, keys, assert, require) {

	var loadNextPage = function (remote, listId, pageSize, expectedActiveTextAfterLoad, isCategory) {
		var expectedTextPath = isCategory ? "document.activeElement.textContent"
				: "document.activeElement.children[1].textContent";
		return remote.pressKeys(keys.PAGE_DOWN)
			.pressKeys(keys.TAB)
			.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Click to load " + pageSize + " more items");
				})
			.end()
			.pressKeys(keys.SPACE)
			.then(pollUntil("return " + expectedTextPath + " === '"
					+ expectedActiveTextAfterLoad + "' ? true : null", [], 5000, intern.config.POLL_INTERVAL));
	};

	var loadPreviousPage = function (remote, listId, pageSize, expectedActiveTextAfterLoad) {
		return remote.pressKeys(keys.PAGE_UP)
			.pressKeys(keys.SHIFT + keys.TAB)
			.pressKeys(keys.SHIFT) // release shift
			.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Click to load " + pageSize + " more items");
				})
			.end()
			.pressKeys(keys.SPACE)
				.then(pollUntil("return document.activeElement.children[1].textContent === '"
					+ expectedActiveTextAfterLoad + "' ? true : null;", [], 5000, intern.config.POLL_INTERVAL));
	};

	registerSuite({
		name: "Pageable tests",
		"Pageable list keyboard navigation": function () {
			var remote = this.remote;
			// PageableList not currently supported on IE 10
			// see https://github.com/ibm-js/deliteful/issues/280
			if (remote.environmentType.browserName === "internet explorer" &&
					remote.environmentType.version === "10") {
				return this.skip("WARNING: PageableList not supported on IE10");
			}
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			var listId = "pageable-prog-1";
			return remote
				.get(require.toUrl("./pageable-prog-1.html"))
				.then(pollUntil("return ('ready' in window &&  ready "
						+ "&& document.getElementById('" + listId + "') "
						+ "&& !document.querySelector('#" + listId + " .d-list-container')"
						+	".getAttribute('aria-busy') === false) ? true : null;",
						[],
						intern.config.WAIT_TIMEOUT,
						intern.config.POLL_INTERVAL))
				.getActiveElement()
				// For some reason, tab navigation doesn't succeed on IE if not typing a value before
					.type("test")
				.end()
				.pressKeys(keys.TAB)
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 20");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 40");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 60");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 80");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 99");
				})
				.then(function () {
					return remote.pressKeys(keys.PAGE_DOWN)
							.then(pollUntil(
								"return document.activeElement.children[1].textContent === "
									+ "'Programmatic item of order 99' ? true : null;",
							[], 5000, intern.config.POLL_INTERVAL));
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 59");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 39");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 19");
				})
				.then(function () {
					return remote.pressKeys(keys.PAGE_UP)
							.then(pollUntil(
									"return document.activeElement.children[1].textContent === "
									+ "'Programmatic item of order 0' ? true : null;",
							[], 5000, intern.config.POLL_INTERVAL));
				});
		},
		"Pageable categorized list keyboard navigation": function () {
			var remote = this.remote;
			// PageableList not currently supported on IE 10
			// see https://github.com/ibm-js/deliteful/issues/280
			if (remote.environmentType.browserName === "internet explorer" &&
					remote.environmentType.version === "10") {
				return this.skip("WARNING: PageableList not supported on IE10");
			}
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			var listId = "pageable-prog-2";
			return remote
				.get(require.toUrl("./pageable-prog-2.html"))
				.then(pollUntil("return ('ready' in window &&  ready "
						+ "&& document.getElementById('" + listId + "') "
						+ "&& !document.querySelector('#" + listId + " .d-list-container')"
						+	".getAttribute('aria-busy') === false) ? true : null;",
						[],
						intern.config.WAIT_TIMEOUT,
						intern.config.POLL_INTERVAL))
				.pressKeys(keys.TAB)
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 25");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Category 5", true);
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 75");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 99");
				})
				.then(function () {
					return remote.pressKeys(keys.PAGE_DOWN)
							.then(pollUntil(
								"return document.activeElement.children[1].textContent === "
									+ "'Programmatic item of order 99' ? true : null;",
							[], 5000));
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Programmatic item of order 49");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Programmatic item of order 24");
				})
				.then(function () {
					return remote.pressKeys(keys.PAGE_UP)
							.then(pollUntil("return document.activeElement.textContent === 'Category 0' ? true : null;",
							[], 5000));
				});
		}
	});
});
