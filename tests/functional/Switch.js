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
			.setExecuteAsyncTimeout(intern.config.WAIT_TIMEOUT)
			.get(require.toUrl(url))
			.executeAsync(function (done) {
				require(["delite/register", "deliteful/Switch", "requirejs-domready/domReady!"], function (register) {
					register.parse();
					done();
				});
			});
	}

	registerSuite({
		name: "Switch - functional",

		"Switch behavior": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/safari|iphone|selendroid/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support moveTo, see https://code.google.com/p/selenium/issues/detail?id=4136
				console.log("Skipping test: Switch behavior as moveTo not supported on Safari");
				return remote.end();
			} else {
				return loadFile(remote, "./Switch.html")
					.findById("sw1")
					.then(function (element) {
						return remote.moveMouseTo(element, 60, 9);
					})
					.end()
					.pressMouseButton()
					.sleep(50)
					.releaseMouseButton()
					.then(function () {
						pollUntil("return document.getElementById('sw1').checked ? true : null;", [],
								2000, intern.config.POLL_INTERVAL);
					})
					.sleep(500)
					.findById("sw1")
					.then(function (element) {
						return remote.moveMouseTo(element, 10, 9);
					})
					.end()
					.pressMouseButton()
					.sleep(50)
					.releaseMouseButton()
					.then(function () {
						pollUntil("return document.getElementById('sw1').checked ? null : false;", [],
								2000, intern.config.POLL_INTERVAL);
					})
					// click on disabled checkbox
					.then(function () {
						pollUntil("return document.getElementById('sw2').checked ? null : false;", [],
								2000, intern.config.POLL_INTERVAL);
					})
					.findById("sw2")
					.then(function (element) {
						return remote.moveMouseTo(element, 60, 9);
					})
					.end()
					.pressMouseButton()
					.sleep(50)
					.releaseMouseButton()
					.then(function () {
						pollUntil("return document.getElementById('sw2').checked ? null : false;", [],
								2000, intern.config.POLL_INTERVAL);
					});
			}
		},

		"Switch key nav": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/safari|iphone|selendroid/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				// Same problem with selendroid and iOS, apparently
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return remote.end();
			}
			return loadFile(remote, "./Switch.html")
				// keyb nav
				// give the focus to the button to have a ref starting point in the chain
				.execute("return document.getElementById('b1').focus();")
				.getActiveElement()
				.end()
				.sleep(400)
				.pressKeys(keys.TAB) // Press TAB -> cb1
				.sleep(400)
				.getActiveElement()
				.getAttribute("name")
				.then(function (v) {
					assert.equal(v, "sw1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.pressKeys(keys.SPACE) // Press Space to check cb1
				.execute("return document.getElementById('sw1').checked;")
				.then(function (v) {
					assert.isTrue(v, "Unexpected value for 'checked' property after pressing SPACE.");
				})
				.end()
				.pressKeys(keys.TAB) // Press TAB -> skip cb2 (disabled)
				.sleep(400)
				.getActiveElement()
				.getVisibleText()
				.then(function (v) {
					assert.equal(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				;
		},

		"Switch Form tests": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			return loadFile(remote, "./Switch.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.execute("return document.getElementById('valueFor_sw3');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for unchecked checkbox cb3.");
				})
				.end()
				.findById("valueFor_sw4")
				.getVisibleText()
				.then(function (value) {
					assert.equal(value, "2", "Unexpected value for checkbox cb4");
				})
				.end()
				.execute("return document.getElementById('valueFor_sw5');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled checkbox cb5.");
				})
				.findById("valueFor_sw6")
				.getVisibleText()
				.then(function (value) {
					assert.equal(value, "4", "Unexpected value for checkbox cb6");
				})
				.end()
				;
		}
	});
});
