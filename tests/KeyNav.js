define(["intern!object",
	"intern/chai!assert",
	"require"
], function (registerSuite, assert, require) {

	registerSuite({
		name: "KeyNav functional tests",

		"setup": function () {
			return this.remote
				.get(require.toUrl("./KeyNavTests.html"))
				.waitForCondition("ready", 10000);
		},

		"inter widget tab navigation": function () {
			if (/safari|iPhone/.test(this.remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return this.remote.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("autofocusInput", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE008\uE004") // shift tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("autofocusInput", value);
					})
				.keys("\uE008") // release shift
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("emptyContainer", value);
					})
				.keys("\uE008\uE004") // shift tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE008") // release shift
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("emptyContainer", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("autofocusInput", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("emptyContainer", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("autofocusInput", value);
					});
		},
		"intra widget arrow navigation": function () {
			if (/safari|iPhone/.test(this.remote.environmentType.browserName)) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return this.remote.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("autofocusInput", value);
					})
				.keys("\uE004") // tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE015") // arrow down
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("two", value);
					})
				.keys("\uE015") // arrow down
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("three", value);
					})
				.keys("\uE015") // arrow down
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("four", value);
					})
				.keys("\uE015") // arrow down
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("five", value);
					})
				.keys("\uE015") // arrow down
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("five", value);
					})
				.keys("\uE013") // arrow up
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("four", value);
					})
				.keys("\uE013") // arrow up
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("three", value);
					})
				.keys("\uE013") // arrow up
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("two", value);
					})
				.keys("\uE013") // arrow up
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					})
				.keys("\uE013") // arrow up
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("one", value);
					});
		}

	});
});