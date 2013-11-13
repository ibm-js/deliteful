define(["intern!object",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, assert, require) {
	
	var clickOnStar = function (remote, widgetId, starIndex /*first index is 1*/,
			pixelsFromCenter/*?Number of pixels from the center of the star*/) {
			return remote
				.elementByXPath("//*[@id='" + widgetId + "']/div[" + starIndex + "]")
					.moveTo(20 + (pixelsFromCenter ? pixelsFromCenter : 0), 0)
					.end()
				.click();
		};

	var clickOnZeroSettingArea = function (remote, widgetId) {
		return remote
			.elementById(widgetId)
				.moveTo(0, 0)
				.end()
			.click();
	};

	var checkRating = function (remote, widgetId, expectedMax, expectedValue, expectedEditable) {
		var i, expectedClasses = [];
		for (i = 0; i < expectedMax; i++) {
			if (i > expectedValue - 1) {
				if (i === (expectedValue - 0.5)) {
					expectedClasses[i] = "duiStarRatingStarIcon duiStarRatingHalfStar";
				} else {
					expectedClasses[i] = "duiStarRatingStarIcon duiStarRatingEmptyStar";
				}
			} else {
				expectedClasses[i] = "duiStarRatingStarIcon duiStarRatingFullStar";
			}
		}
		return remote
			.elementById(widgetId)
				.getAttribute("role")
				.then(function (value) {
					assert.equal("slider", value);
				})
				.getAttribute("aria-label")
				.then(function (value) {
					assert.equal("rating", value);
				})
				.getAttribute("aria-valuemin")
				.then(function (value) {
					assert.equal("0", value);
				})
				.getAttribute("aria-valuemax")
				.then(function (value) {
					assert.equal(expectedMax, value);
				})
				.getAttribute("aria-valuenow")
				.then(function (value) {
					assert.equal(expectedValue, value);
				})
				.getAttribute("aria-valuetext")
				.then(function (value) {
					assert.equal(expectedValue + " stars", value);
				})
				.getAttribute("aria-disabled")
				.then(function (value) {
					assert.equal(expectedEditable ? "false" : "true", value);
				})
				.getAttribute("tabIndex")
				.then(function (value) {
					assert.equal("0", value);
				})
				.elementsByTagName("div")
					.then(function (children) {
						assert.equal(expectedMax, children.length, "The expected number of stars is wrong");
					})
					.end()
				.then(function () {
					for (i = 0; i < expectedMax; i++) {
						(function (i) {
							remote.elementByXPath("//*[@id='" + widgetId + "']/div[" + (i + 1) + "]")
								.getAttribute("className")
								.then(function (result) {
									assert.equal(expectedClasses[i], result);
								})
								.end();
						})(i);
					}
				})
				.end();
	};

	var defaultEditableRatingTest = function (remote, widgetId, halfStars, zeroSetting, expectedInitialValue) {
		var expectedAfterClickOnThirdStar = halfStars ? 2.5 : 3,
			expectedAfterZeroSetting = zeroSetting ? 0 : 0.5;
		return remote
		.get(require.toUrl("./StarRatingTests.html"))
		.waitForCondition("ready", 5000)
		// Check initial rating
		.then(function () {
			return checkRating(remote, widgetId, 7, expectedInitialValue, true);
		})
		// check rating change after firing down and up events on a star
		.then(function () {
			return clickOnStar(remote, widgetId, 3, -1);
		})
		.then(function () {
			return checkRating(remote, widgetId, 7, expectedAfterClickOnThirdStar, true);
		})
		// set zero rating
		.then(function () {
			return clickOnZeroSettingArea(remote, widgetId);
		})
		.then(function () {
			return checkRating(remote, widgetId, 7, expectedAfterZeroSetting, true);
		});
		///////////////////////////////////////////
		// TODO: CHECK USING MOVE TO SET VALUES
		///////////////////////////////////////////
	};

	console.log("# Registering StarRating tests");
	registerSuite({
		name: "StarRating tests",
		"read only ltr": function () {
			var remote = this.remote, widgetId = "star", i;
			console.log("# running test 'read only ltr'");
			return remote
			.get(require.toUrl("./StarRatingTests.html"))
			.waitForCondition("ready", 5000)
			.then(function () {
				// Check initial rating
				return checkRating(remote, widgetId, 7, 0, false);
			})
			// click the + button and verify the value is updated
			.then(function () {
				for (i = 0; i < 14; i++) {
					(function (i) {
						remote.elementById("starplus")
							.clickElement()
							.end()
						.then(function () {
							checkRating(remote, widgetId, 7, (i + 1) * 0.5, false);
						});
					})(i);
				}
			})
			// click the - button and verify the value is updated
			.then(function () {
				for (i = 0; i < 14; i++) {
					(function (i) {
						remote.elementById("starminus")
							.clickElement()
							.end()
						.then(function () {
							checkRating(remote, widgetId, 7, (13 - i) * 0.5, false);
						});
					})(i);
				}
			})
			// click on a star: doesn't change anything
			.then(function () {
				return clickOnStar(remote, widgetId, 2, -1);
			})
			.then(function () {
				return checkRating(remote, widgetId, 7, 0, false);
			});
		},
		"editable ltr": function () {
			console.log("# running test 'editable ltr'");
			return defaultEditableRatingTest(this.remote, "editablestar1", false, true, 0);
		},
		"editable half values ltr": function () {
			console.log("# running test 'editable half values ltr'");
			return defaultEditableRatingTest(this.remote, "editablestar2", true, true, 0);
		},
		"editable half values no zero setting ltr": function () {
			console.log("# running test 'editable half values no zero setting ltr'");
			return defaultEditableRatingTest(this.remote, "editablestar5", true, false, 0.5);
		},
		"editable programmatic onchange ltr": function () {
			console.log("# running test 'editable programmatic onchange ltr'");
			var remote = this.remote, id = "editablestar6";
			return remote
				.get(require.toUrl("./StarRatingTests.html"))
				.waitForCondition("ready", 5000)
				// Check initial rating
				.then(function () {
					return checkRating(remote, id, 7, 3.5, true);
				})
				// Check message
				.elementById(id + "value")
					.text()
					.then(function (text) {
						assert.equal("Rating is 3.5 stars", text, "message is not the one expected for " + id);
					})
					.end()
				// check rating change after clicking on a star
				.then(function () {
					return clickOnStar(remote, id, 3, -1);
				})
				.then(function () {
					return checkRating(remote, id, 7, 2.5, true);
				})
				// Check message
				.elementById(id + "value")
					.text()
					.then(function (text) {
						assert.equal("Rating is 2.5 stars", text, "message is not the one expected for " + id);
					})
					.end()
				// set zero rating
				.then(function () {
					return clickOnZeroSettingArea(remote, id);
				})
				.then(function () {
					return checkRating(remote, id, 7, 0, true);
				})
			// Check message
			.elementById(id + "value")
				.text()
				.then(function (text) {
					assert.equal("Rating is 0 star", text, "message is not the one expected for " + id);
				})
				.end();
			///////////////////////////////////////////
			// TODO: CHECK USING MOVE TO SET VALUES
			///////////////////////////////////////////
		},
		"default": function () {
			console.log("# running test 'default'");
			var remote = this.remote;
			return remote
			.get(require.toUrl("./StarRatingTests.html"))
			.waitForCondition("ready", 5000)
			// Check initial rating
			.then(function () {
				return checkRating(remote, "defaultstar", 5, 0, false);
			});
		}
	});
});