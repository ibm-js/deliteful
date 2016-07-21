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

		"mouse": function () {
			var remote = this.remote;
			return loadFile(remote, "./Checkbox.html")
				// default click action
				.sleep(400)
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isFalse(checked, "cb1 initially unchecked");
				})
				.findByCssSelector("#cb1 input").click().end()
				.sleep(400)
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isTrue(checked, "click of cb1");
				})
				// then click disabled checkbox
				.findByCssSelector("#cb2 input").click().end()
				.sleep(400)
				.execute("return document.getElementById('cb2').checked;").then(function (checked) {
					assert.isFalse(checked, "click of cb2");
				});
		},

		"keyboard": function () {
			// keyboard nav
			// give the focus to the button to have a ref starting point in the chain
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return loadFile(remote, "./Checkbox.html")
				.execute("return document.getElementById('b1').focus();")
				.pressKeys(keys.TAB) // Press TAB -> cb1
				.execute("return document.activeElement.getAttribute('name')")
					.then(function (v) {
						assert.strictEqual(v, "cb1", "focused element after 1st TAB.");
					})
				.pressKeys(keys.SPACE) // Press Space to check cb1
				.sleep(400)
				.execute("return document.getElementById('cb1').checked;").then(function (checked) {
					assert.isTrue(checked, "keyboard click of cb1");
				})
				.pressKeys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.execute("return document.activeElement.textContent")
					.then(function (v) {
						assert.strictEqual(v, "End", "focused element after 2nd TAB.");
					})
				;
		},

		"form": function () {
			//
			// Form tests
			//
			var remote = this.remote;
			if (/iOS|selendroid/.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return loadFile(remote, "./Checkbox.html")
				.findById("form1")
					.submit()
					.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")	// TODO: shouldn't this be checking something?
				.end()
				.execute("return document.getElementById('valueFor_cb3');")
				.then(function (value) {
						assert.isNull(value, "Unexpected value for unchecked checkbox cb3.");
					})
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
					.end();
		}
	});
});
