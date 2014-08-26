define([
	"intern!object",
	"intern/chai!assert",
	"intern/dojo/node!wd/lib/special-keys",
	"require"
], function (registerSuite, assert, keys, require) {

	function loadFile(remote, url) {
		return remote
			.setAsyncScriptTimeout(30000)
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

		setup: function () {
			var remote = this.remote;
			loadFile(remote, "./Switch.html");
		},

		"Switch behavior": function () {
			var remote = this.remote;
			if (/safari|iPhone|selendroid/.test(remote.environmentType.browserName)) {
				// SafariDriver doesn't support moveTo, see https://code.google.com/p/selenium/issues/detail?id=4136
				console.log("Skipping test: Switch behavior as moveTo not supported on Safari");
				return;
			} else {
				return remote
					.elementById("sw1")
					.moveTo(60, 9)
					.end()
					.buttonDown()
					.wait(50)
					.buttonUp()
					.execute("return document.getElementById('sw1').checked;")
					.then(function (v) {
						assert.isTrue(v, "Unexpected value for 'checked' property.");
					})
					.wait(500)
					.elementById("sw1")
					.moveTo(10, 9)
					.end()
					.buttonDown()
					.wait(50)
					.buttonUp()
					.execute("return document.getElementById('sw1').checked;")
					.then(function (v) {
						assert.isFalse(v, "Unexpected value for 'checked' property [2].");
					})

					// click on disabled checkbox
					.execute("return document.getElementById('sw2').checked;")
					.then(function (v) {
						assert.isFalse(v, "Unexpected value for disabled 'checked' property.");
					})
					.elementById("sw2")
					.moveTo(60, 9)
					.end()
					.buttonDown()
					.wait(50)
					.buttonUp()
					.execute("return document.getElementById('sw2').checked;")
					.then(function (v) {
						assert.isFalse(v, "Unexpected  change for disabled 'checked' property.");
					});
			}
		},

		"Switch key nav": function () {
			var remote = this.remote;
			if (/safari|iphone|selendroid/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				// Same problem with selendroid and iOS, apparently
				console.log("Skipping test '" + this.parent.name + ": " + this.name + "' on this platform");
				return;
			}
			return remote
				// keyb nav
				// give the focus to the button to have a ref starting point in the chain
				.execute("return document.getElementById('b1').focus();")
				.active()
				.end()
				.wait(400)
				.keys(keys.Tab) // Press TAB -> cb1
				.wait(400)
				.active()
				.getAttribute("name")
				.then(function (v) {
					assert.equal(v, "sw1", "Unexpected focused element after 1st TAB.");
				})
				.end()
				.keys(keys.Space) // Press Space to check cb1
				.execute("return document.getElementById('sw1').checked;")
				.then(function (v) {
					assert.isTrue(v, "Unexpected value for 'checked' property after pressing SPACE.");
				})
				.end()
				.keys(keys.Tab) // Press TAB -> skip cb2 (disabled)
				.wait(400)
				.active()
				.text()
				.then(function (v) {
					assert.equal(v, "End", "Unexpected focused element after 2nd TAB.");
				})
				.end();
		},

		"Form tests": function () {
			var remote = this.remote;
			return remote
				.elementById("form1")
				.submit()
				.waitForElementById("parameters")
				.end()
				.elementByIdOrNull("valueFor_sw3")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for unchecked checkbox cb3.");
				})
				.end()
				.elementById("valueFor_sw4")
				.text()
				.then(function (value) {
					assert.equal(value, "2", "Unexpected value for checkbox cb4");
				})
				.end()
				.elementByIdOrNull("valueFor_sw5")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled checkbox cb5.");
				})
				.elementById("valueFor_sw6")
				.text()
				.then(function (value) {
					assert.equal(value, "4", "Unexpected value for checkbox cb6");
				})
				.end()
				;
		}
	});
});
