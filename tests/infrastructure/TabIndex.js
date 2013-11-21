define(["intern!object",
	"intern/chai!assert",
	"require"
], function (registerSuite, assert, require) {

	registerSuite({
		name: "tabIndex functional tests",

		"setup": function () {
			return this.remote
				.get(require.toUrl("./TabIndex.html"))
				.waitForCondition("ready", 10000);
		},

		"default tab indices": function () {
			if ( /safari|iPhone/.test(this.remote.environmentType.browserName) ) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return this.remote.elementById("d1").click()		// start on first element, before widgets
				.execute("return document.activeElement.id")
					.then(function (value) {
						// start focus on the node before the two widgets
						assert.equal("d1", value);
					})
					.end()
				.keys("\uE004") 								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// focused on <span> inside of widget
						assert.equal("d2", value);
					})
					.end()
				.keys("\uE004")								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// focused on <span> inside of widget
						assert.equal("d3", value);
					})
					.end()
				.keys("\uE004")								// tab
					.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("d4", value);
					});
		},

		"specified tab indices": function () {
			if ( /safari|iPhone/.test(this.remote.environmentType.browserName) ) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return this.remote.elementById("s1").click()		// start on first element, before widgets
				.execute("return document.activeElement.id")
					.then(function (value) {
						// start focus on the node before the two widgets
						assert.equal("s1", value);
					})
					.end()
				.keys("\uE004") 								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// focused on <span> inside of widget
						assert.equal("s2", value);
					})
					.end()
				.keys("\uE004")								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// focused on <span> inside of widget
						assert.equal("s3", value);
					})
					.end()
				.keys("\uE004")								// tab
				.execute("return document.activeElement.id")
					.then(function (value) {
						assert.equal("s4", value);
					});
		},

		"changed tab indices": function () {
			if ( /safari|iPhone/.test(this.remote.environmentType.browserName) ) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				return;
			}
			return this.remote.elementById("button").click()	// click button to change tab indices
				.execute("document.getElementById('button').focus();")	// needed on chrome for some reason
				.keys("\uE004") 								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// should have tabbed back to <span> inside first widget, which now has tabIndex=5
						assert.equal("s2", value);
					})
					.end()
				.execute("return document.activeElement.innerHTML")
					.then(function (value) {
						// making sure that watch() worked
						assert.equal("widget, tabindex=1, updated to 5", value);
					})
					.end()
				.keys("\uE004")								// tab
				.execute("return document.activeElement.parentNode.id")
					.then(function (value) {
						// should have tabbed back to <span> inside second widget, which now has tabIndex=6
						assert.equal("s3", value);
					});
		}
	});
});