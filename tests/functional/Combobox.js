define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {
	
	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};
	
	registerSuite({
		name: "Combobox - functional",

		"Combobox Form submit": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/iphone|selendroid/.test(remote.environmentType.browserName)) {
				console.log("Skipping test: 'Combobox Form submit' on browser: " +
					remote.environmentType.browserName);
				return remote.end();
			}
			return loadFile(this.remote, "./Combobox-decl.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.findById("valueFor_combo1")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo1");
				})
				.end()
				.findById("valueFor_combo2")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo2");
				})
				.end()
				.findById("valueFor_combo3")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "", "Unexpected value for Combobox combo3");
				})
				.end()
				.execute("return document.getElementById('valueFor_combo1-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo1-disabled");
				})
				.end()
				.execute("return document.getElementById('valueFor_combo2-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo2-disabled");
				})
				.end()
				.execute("return document.getElementById('valueFor_combo3-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo3-disabled");
				})
				.end()
				.findById("valueFor_combo1-value")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "FR", "Unexpected value for Combobox combo1-value");
				})
				.end()
				.findById("valueFor_combo3-value")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "", "Unexpected value for Combobox combo3-value");
				})
				.end()
				.findById("valueFor_combo1-single-rtl")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo1-single-rtl");
				})
				.end();
		}
	});
});
