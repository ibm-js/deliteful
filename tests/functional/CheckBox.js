define([
	"intern!object",
	"intern/chai!assert",
	"intern/dojo/node!wd/lib/special-keys",
	"require"
], function (registerSuite, assert, keys, require) {

	function loadFile(remote, url) {
		return remote
			.setAsyncScriptTimeout(50000)
			.get(require.toUrl(url))
			.executeAsync(function (done) {
				require(["delite/register", "deliteful/CheckBox", "requirejs-domready/domReady!"], function (register) {
					register.parse();
					done();
				});
			});
	}

	registerSuite({
		name: "CheckBox - functional",

		setup: function () {
			var remote = this.remote;
			loadFile(remote, "./CheckBox.html");
		},

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
				.active()
				.end()
				.wait(400)
				.keys(keys.Tab) // Press TAB -> cb1
				.wait(400)
				.active()
				.getAttribute("name")
				.then(function (v) {
					assert.strictEqual(v, "cb1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.keys(keys.Space) // Press Space to check cb1
				.execute("return document.getElementById('cb1').checked;")
				.then(function (v) {
					assert.isFalse(v, "Unexpected value for 'checked' property after pressing SPACE.");
				})
				.end()
				.keys(keys.Tab) // Press TAB -> skip cb2 (disabled)
				.wait(400)
				.active()
				.text()
				.then(function (v) {
					assert.strictEqual(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				;
		},

		"CheckBox Form": function () {
				//
				// Form tests
				//
			var remote = this.remote;
			if (/iphone|selendroid/.test(remote.environmentType.browserName)) {
				console.log("Skipping test: 'CheckBox Form' on this platform.");
				return remote.end();
			}
			return remote
				.elementById("form1")
				.submit()
				.waitForElementById("parameters")
				.end()
				.execute("return document.getElementById('valueFor_cb3');")
				// do not call elementByIdOrNulkl as it fails
//				.elementByIdOrNull("valueFor_cb3")
				.then(function (value) {
						assert.isNull(value, "Unexpected value for unchecked checkbox cb3.");
					})
				.end()
				.elementById("valueFor_cb4")
				.text()
				.then(function (value) {
					assert.strictEqual(value, "2", "Unexpected value for checkbox cb4");
				})
				.end()
				.elementByIdOrNull("valueFor_cb5")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled checkbox cb5.");
				})
				.elementById("valueFor_cb6")
				.text()
				.then(function (value) {
					assert.strictEqual(value, "4", "Unexpected value for checkbox cb6");
				})
				;
		}
	});
});
