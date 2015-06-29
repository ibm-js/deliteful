define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	function loadFile(remote, url) {
		return remote
			.get(require.toUrl(url))
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	registerSuite({
		name: "Button - functional",

		"Button behavior": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			return loadFile(remote, "./Button.html")
				// default click action
				.execute("return document.getElementById('b1').focusNode;")
				.then(function (element) {
					element.click();
				})
				.then(pollUntil("return document.getElementById('b1')._test_clicked === 1;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				// click on disabled checkbox
				.then(pollUntil("return document.getElementById('b2')._test_clicked === undefined;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.execute("return document.getElementById('b2').focusNode;")
				.then(function (element) {
					element.click();
				})
				.then(pollUntil("return document.getElementById('b2')._test_clicked === undefined;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		"Button Key nav": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			// keyb nav
			// give the focus to the button to have a ref starting point in the chain
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return remote
				.execute("return document.getElementById('b0').focus();")
				.getActiveElement()
				.end()
				.sleep(400)
				.pressKeys(keys.TAB) // Press TAB -> b1
				.sleep(400)
				.getActiveElement()
				.getAttribute("name")
				.then(function (v) {
					assert.strictEqual(v, "b1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.pressKeys(keys.SPACE) // Press Space to check b1
				.then(pollUntil("return document.getElementById('b1')._test_clicked === 2;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.end()
				.pressKeys(keys.TAB) // Press TAB -> skip b2 (disabled)
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.strictEqual(v, "End", "Unexpected focused element after 2nd TAB.");
				});
		},

		"Button Form": function () {
				//
				// Form tests
				//
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/selendroid/.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return loadFile(remote, "./Button.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.execute("return document.getElementById('valueFor_b3');")
				.then(function (value) {
						assert.isNull(value, "Unexpected value for button b3.");
					})
				.end()
				.execute("return document.getElementById('valueFor_b5');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled button b5.");
				})
				;
		}
	});
});
