define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var StarRating = require("deliteful/StarRating");

	var sr = null;

	registerSuite("StarRating", {
		beforeEach: function () {
			sr = new StarRating();
			sr.placeAt(document.body);
		},

		tests: {
			"Setting different values for max": function () {
				var dfd = this.async(1000);
				sr.max = 1;
				setTimeout(dfd.rejectOnError(function () {
					assert.strictEqual(sr.focusNode.children.length, 3, "number of children for max = 1");
					sr.max = 2;
					setTimeout(dfd.callback(function () {
						assert.strictEqual(sr.focusNode.children.length, 5, "number of children for max = 2");
					}), 100);
				}), 100);
				return dfd;
			}
		},

		after: function () {
			if (sr) {
				sr.destroy();
			}
			sr = null;
		}
	});

});
