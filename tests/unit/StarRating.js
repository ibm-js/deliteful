define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/StarRating"
], function (registerSuite, assert, StarRating) {

	var sr = null;

	registerSuite({
		name: "StarRating",
		beforeEach: function () {
			sr = new StarRating();
			document.body.appendChild(sr);
			sr.startup();
		},
		"Setting different values for max": function () {
			var dfd = this.async(1000);
			sr.max = 1;
			setTimeout(dfd.rejectOnError(function () {
				assert.equal(sr.children.length, 3, "number of children for max = 1");
				sr.max = 2;
				setTimeout(dfd.callback(function () {
					assert.equal(sr.children.length, 4, "number of children for max = 2");
				}), 0);
			}), 0);
			return dfd;
		},
		teardown: function () {
			sr.destroy();
			sr = null;
		}
	});

});