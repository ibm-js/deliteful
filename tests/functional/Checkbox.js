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
		name: "Checkbox - functional",

		"Checkbox behavior": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			return loadFile(remote, "./Checkbox.html")
				// default click action
				.execute("return document.getElementById('cb1').focusNode;")
				.then(function (element) {
					element.click();
				})
				.then(pollUntil("return document.getElementById('cb1').checked ? true : null;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				// click on disabled checkbox
				.then(pollUntil("return document.getElementById('cb2').checked ? null : true;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.execute("return document.getElementById('cb2').focusNode;")
				.then(function (element) {
					element.click();
				})
				.then(pollUntil("return document.getElementById('cb2').checked ? null : true;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		"Checkbox Key nav": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			// keyb nav
			// give the focus to the button to have a ref starting point in the chain
			var remote = this.remote;
			if (/safari|iOS|selendroid/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support sendKeys
			    return this.skip("SafariDriver doesn't support sendKeys.");
			}
			return remote
				.execute("return document.getElementById('b1').focus();")
				.getActiveElement()
				.end()
				.sleep(400)
				.pressKeys(keys.TAB) // Press TAB -> cb1
				.sleep(400)
				.getActiveElement()
				.getAttribute("name")
				.then(function (v) {
					assert.strictEqual(v, "cb1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.pressKeys(keys.SPACE) // Press Space to check cb1
				.then(pollUntil("return document.getElementById('cb1').checked ? null : true;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.end()
				.pressKeys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.strictEqual(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				;
		},

		"Checkbox Form": function () {
				//
				// Form tests
				//
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/iOS|selendroid/.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return loadFile(remote, "./Checkbox.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.execute("return document.getElementById('valueFor_cb3');")
				.then(function (value) {
						assert.isNull(value, "Unexpected value for unchecked checkbox cb3.");
					})
				.end()
				.findById("valueFor_cb4")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "2", "Unexpected value for checkbox cb4");
				})
				.end()
				.execute("return document.getElementById('valueFor_cb5');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled checkbox cb5.");
				})
				.findById("valueFor_cb6")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "4", "Unexpected value for checkbox cb6");
				})
				;
		}
	});
});
