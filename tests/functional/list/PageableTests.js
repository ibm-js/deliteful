define(["intern",
        "intern!object",
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/dojo/node!leadfoot/keys",
        "intern/chai!assert",
        "require"
        ], function (intern, registerSuite, pollUntil, keys, assert, require) {

	function loadNextPage(remote, listId, pageSize, expectedActiveTextAfterLoad, comment) {
		return remote.pressKeys(keys.PAGE_DOWN)
			.pressKeys(keys.TAB)
			.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Click to load " + pageSize + " more items", comment + " (a)");
				})
			.end()
			.pressKeys(keys.SPACE)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, expectedActiveTextAfterLoad, comment + " (b)");
			})
			.end();
	}

	function loadPreviousPage(remote, listId, pageSize, expectedActiveTextAfterLoad, comment) {
		return remote.pressKeys(keys.PAGE_UP)
			.pressKeys(keys.SHIFT + keys.TAB)
			.pressKeys(keys.SHIFT) // release shift
			.getActiveElement()
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "Click to load " + pageSize + " more items", comment + " (a)");
				})
			.end()
			.pressKeys(keys.SPACE)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.strictEqual(value, expectedActiveTextAfterLoad, comment + " (b)");
			})
			.end();
	}

	registerSuite({
		name: "Pageable tests",
		"Pageable list keyboard navigation": function () {
			var remote = this.remote;
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
					return loadNextPage(remote, listId, 20, "Programmatic item of order 20", "loadNext #1");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 59", "loadNext #2");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 79", "loadNext #3");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 99", "loadNext #4");
				})
				.then(function () {
					return loadNextPage(remote, listId, 20, "Programmatic item of order 99", "loadNext #5");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 40", "loadPrev #1");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 20", "loadPrev #2");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 20, "Programmatic item of order 0", "loadPrev #3");
				});
		},

		"Pageable categorized list keyboard navigation": function () {
			var remote = this.remote;
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
					return loadNextPage(remote, listId, 25, "Programmatic item of order 25", "loadNext #1");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 73", "loadNext #2");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 99", "loadNext #3");
				})
				.then(function () {
					return loadNextPage(remote, listId, 25, "Programmatic item of order 99", "loadNext #4");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Category 2", "loadPrev #1");
				})
				.then(function () {
					return loadPreviousPage(remote, listId, 25, "Category 0", "loadPrev #2");
				});
		}
	});
});
