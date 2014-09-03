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
			.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	registerSuite({
		name: "CheckBox - functional",

		"Checkbox behavior": function () {
			var remote = this.remote;
			return remote
				// default click action
				.execute("return document.getElementById('cb1').focusNode;")
				.click()
				.execute("return document.getElementById('cb1').checked;")
				.then(function (v) {
					assert.isTrue(v, "Unexpected value for 'checked' property.");
				})
				.end()
				// click on disabled checkbox
				.execute("return document.getElementById('cb2').checked;")
				.then(function (v) {
					assert.isFalse(v, "Unexpected value for disabled 'checked' property.");
				})
				.end()
				.execute("return document.getElementById('cb2').focusNode;")
				.click()
				.execute("return document.getElementById('cb2').checked;")
				.then(function (v) {
					assert.isFalse(v, "Unexpected  change for disabled 'checked' property.");
				})
				;
		},

		"CheckBox Key nav": function () {
			// keyb nav
			// give the focus to the button to have a ref starting point in the chain
			var remote = this.remote;
			if (/safari|iphone|selendroid/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support sendKeys
				console.log("Skipping test: key nav as sendKeys not supported on Safari");
				return remote.end();
			}
			return remote
				.execute("return document.getElementById('b1').focus();")
				.getActiveElement()
				.end()
				.sleep(400)
				.keys(keys.TAB) // Press TAB -> cb1
				.sleep(400)
				.getActiveElement()
				.getAttribute("name")
				.then(function (v) {
					assert.strictEqual(v, "cb1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.keys(keys.SPACE) // Press Space to check cb1
				.execute("return document.getElementById('cb1').checked;")
				.then(function (v) {
					assert.isFalse(v, "Unexpected value for 'checked' property after pressing SPACE.");
				})
				.end()
				.keys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.strictEqual(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				;
		},

		"CheckBox Form": function () {
				//
				// Form tests
				//
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/iphone|selendroid/.test(remote.environmentType.browserName)) {
				console.log("Skipping test: 'CheckBox Form' on this platform.");
				return remote.end();
			}
			return loadFile(remote, "./CheckBox.html")
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
