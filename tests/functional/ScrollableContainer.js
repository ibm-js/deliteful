define(["intern!object",
	"intern/chai!assert",
	"require"
	], function (registerSuite, assert, require) {
	
	registerSuite({
		name: "ScrollableContainer",
		"programmatic scroll with animation": function () {
			var remote = this.remote;
			return remote
			.get(require.toUrl("./ScrollableContainer.html"))
			.waitForCondition("ready", 5000)
			.then(function () {
				remote.elementById("scrollButton")
				.clickElement()
				.end()
				// Check that the scroll arrives at 100:
				.waitForCondition("document.getElementById('scrollContainer').scrollableNode.scrollTop=='100'", 5000)
				// Check that it stays at 100 even after waiting a while (that is, 
				// that it does not continue to scroll):
				.wait(200)
				.then(function () {
					remote.execute("return document.getElementById('scrollContainer').scrollableNode.scrollTop")
					.then(function (value) {
						assert.equal(value, "100", "scrollTop should have stayed at 100!");
					});
				});
			});
		}
	});
});
