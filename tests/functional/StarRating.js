define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/dojo/node!leadfoot/keys",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, keys, assert, require) {
	
	var pollUntilStarRatingReady = function (widgetId, timeout, pollInterval) {
		return pollUntil("return document.querySelector('#" + widgetId + " > div');", [], timeout, pollInterval);
	};

	var clickOnStar = function (remote, widgetId, starIndex /*first index is 1*/,
		firstHalf/*true to click on the first half, false to click the second half*/) {
		var divIndex = starIndex * 2 + (firstHalf ? 0 : 1);
		return remote
			.findByXpath("//*[@id='" + widgetId + "']/div/div[" + divIndex + "]")
				.click()
				.end();
	};

	var clickOnZeroSettingArea = function (remote, widgetId) {
		return remote
			.findByXpath("//*[@id='" + widgetId + "']/div/div[1]")
				.click()
				.end();
	};

	var checkSubmitedParameters = function (remote, /*Array*/expectedKeys, /*Array*/expectedValues) {
		var expected = [];
		for (var i = 0; i < expectedKeys.length; i++) {
			expected.push(expectedKeys[i]);
			expected.push(expectedValues[i]);
		}
		return remote.findAllByTagName("td")
			.getVisibleText()
			.then(function (texts) {
				assert.deepEqual(texts, expected);
			})
			.end();
	};

	var checkRating = function (remote, widgetId, expectedMax, expectedValue, expectedDisabled) {
		return remote
			.findByXpath("//*[@id='" + widgetId + "']/div")
				.getAttribute("aria-valuenow")
				.then(function (value) {
					assert.strictEqual(value, expectedValue.toString(), "aria-valuenow");
				})
				.getAttribute("aria-disabled")
				.then(function (value) {
					assert.strictEqual(value, expectedDisabled ? "true" : "false", "aria-disabled");
				})
				.getAttribute("tabindex")
				.then(function (value) {
					assert.strictEqual(value, expectedDisabled ? null : "0", "tabIndex");
				})
				.getAttribute("role")
				.then(function (value) {
					assert.strictEqual(value, "slider", "role");
				})
				.getAttribute("aria-valuemin")
				.then(function (value) {
					assert.strictEqual(value, "0", "aria-valuemin");
				})
				.getAttribute("aria-valuemax")
				.then(function (value) {
					assert.strictEqual(value, expectedMax.toString(), "aria-valuemax");
				})
				.getAttribute("aria-valuetext")
				.then(function (value) {
					assert.strictEqual(value, expectedValue + " stars", "aria-valuetest");
				})
				.end()
			.execute("return Array.prototype.map.call(" + widgetId
					+ ".getElementsByClassName('d-star-rating-star-icon'), "
					+ "function(elem){ return elem.className; });")
				.then(function (classNames) {
					assert.strictEqual(classNames.length, 2 * expectedMax, "# of stars");
					for (var i = 0; i < 2 * expectedMax; i++) {
						var expectedClass = "d-star-rating-star-icon";
						expectedClass += i % 2 ? " d-star-rating-end" : " d-star-rating-start";
						if ((i + 1) * 0.5 <= expectedValue) {
							expectedClass += " d-star-rating-full";
						} else {
							expectedClass += " d-star-rating-empty";
						}
						assert.strictEqual(classNames[i], expectedClass, "expected class star " + i);
					}
				});
	};

	var defaultEditableRatingTest = function (remote, widgetId, halfStars, zeroSetting, expectedInitialValue) {
		var expectedAfterClickOnThirdStar = halfStars ? 2.5 : 3;
		return remote
		.get(require.toUrl("./StarRating.html"))
		.then(pollUntilStarRatingReady(widgetId, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
		// Check initial rating
		.then(function () {
			return checkRating(remote, widgetId, 7, expectedInitialValue, false);
		})
		// check rating change after firing down and up events on a star
		.then(function () {
			return clickOnStar(remote, widgetId, 3, true);
		})
		.then(function () {
			return checkRating(remote, widgetId, 7, expectedAfterClickOnThirdStar, false);
		})
		// set zero rating
		.then(function () {
			if (zeroSetting) {
				return clickOnZeroSettingArea(remote, widgetId);
			}
		})
		.then(function () {
			if (zeroSetting) {
				return checkRating(remote, widgetId, 7, 0, false);
			}
		});
		///////////////////////////////////////////
		// TODO: CHECK USING MOVE TO SET VALUES
		///////////////////////////////////////////
	};

	console.log("# Registering StarRating tests");
	registerSuite({
		name: "StarRating tests",
		"read only ltr": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote, widgetId = "star";
			return remote
				.get(require.toUrl("./StarRating.html"))
				.then(pollUntilStarRatingReady(widgetId, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {
					// Check initial rating
					return checkRating(remote, widgetId, 1, 0, false);
				})
				// click the + button and verify the value is updated
				.findById("starplus")
					.click()
					.then(function () {
						checkRating(remote, widgetId, 1, 0.5, false);
					})
					.click()
					.then(function () {
						checkRating(remote, widgetId, 1, 1, false);
					})
					.end()
				// click the - button and verify the value is updated
				.findById("starminus")
					.click()
					.then(function () {
						checkRating(remote, widgetId, 1, 0.5, false);
					})
					.click()
					.then(function () {
						checkRating(remote, widgetId, 1, 0, false);
					})
					.end()
				// click on the star: doesn't change anything
				.then(function () {
					return clickOnStar(remote, widgetId, 1, true);
				})
				.then(function () {
					return checkRating(remote, widgetId, 1, 0, false);
				});
		},
		"editable ltr": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			if (/iOS/.test(this.remote.environmentType.browserName)) {
				return this.skip("Value not being updated on click on iOS 8.1");
			}
			return defaultEditableRatingTest(this.remote, "editablestar1", false, true, 0);
		},
		"editable half values ltr": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			if (/iOS/.test(this.remote.environmentType.browserName)) {
				return this.skip("Value not being updated on click on iOS 8.1");
			}
			return defaultEditableRatingTest(this.remote, "editablestar2", true, true, 0);
		},
		"editable half values no zero setting ltr": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			if (/iOS/.test(this.remote.environmentType.browserName)) {
				return this.skip("Value not being updated on click on iOS 8.1");
			}
			return defaultEditableRatingTest(this.remote, "editablestar5", true, false, 0.5);
		},
		"editable programmatic onchange ltr": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote, id = "editablestar6";
			if (/iOS/.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return remote
				.get(require.toUrl("./StarRating.html"))
				.then(pollUntilStarRatingReady(id, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				// Check initial rating
				.then(function () {
					return checkRating(remote, id, 7, 3.5, false);
				})
				// Check message
				.findById(id + "value")
					.getVisibleText()
					.then(function (text) {
						assert.strictEqual(text, "Rating is 3.5 stars", "message is not the one expected for " + id);
					})
					.end()
				// check rating change after clicking on a star
				.then(function () {
					return clickOnStar(remote, id, 3, true);
				})
				.then(function () {
					return checkRating(remote, id, 7, 2.5, false);
				})
				// Check message
				.findById(id + "value")
					.getVisibleText()
					.then(function (text) {
						assert.strictEqual(text, "Rating is 2.5 stars", "message is not the one expected for " + id);
					})
					.end()
				// set zero rating
				.then(function () {
					return clickOnZeroSettingArea(remote, id);
				})
				.then(function () {
					return checkRating(remote, id, 7, 0, false);
				})
				// Check message
				.findById(id + "value")
					.getVisibleText()
					.then(function (text) {
						assert.strictEqual(text, "Rating is 0 stars", "message is not the one expected for " + id);
					})
					.end();
		},
		"default": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote, id = "defaultstar";
			return remote
			.get(require.toUrl("./StarRating.html"))
			.then(pollUntilStarRatingReady(id, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			// Check initial rating
			.then(function () {
				return checkRating(remote, id, 5, 0, false);
			});
		},
		"tab order": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/safari|iOS|selendroid/.test(remote.environmentType.browserName) || remote.environmentType.safari) {
				// SafariDriver doesn't support tabbing, see https://code.google.com/p/selenium/issues/detail?id=5403
				// Same problem with selendroid and iOS, apparently
				return this.skip("SafariDriver doesn't support tabbing.");
			}
			return remote
			.get(require.toUrl("./StarRating.html"))
			.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			// Check active element
			.execute("return document.activeElement.id;")
			.then(function (value) {
				assert.strictEqual(value, "afinput");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id;")
			.then(function (value) {
				assert.strictEqual(value, "firsttabindexstar");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "secondtabindexstar");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "star");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.id")
			.then(function (value) {
				assert.strictEqual(value, "starminus");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.id")
			.then(function (value) {
				assert.strictEqual(value, "starplus");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "editablestar1");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "editablestar2");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "editablestar5");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "editablestar6");
			})
			.pressKeys(keys.TAB)
			.execute("return document.activeElement.parentNode.id")
			.then(function (value) {
				assert.strictEqual(value, "defaultstar");
			});
		},
		"disabled": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote, id = "starrating3";
			return remote
			.get(require.toUrl("./StarRating-form.html"))
			.then(pollUntilStarRatingReady(id, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			// Check initial rating
			.then(function () {
				return checkRating(remote, id, 7, 3, true);
			});
		},
		"form back button": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			// Safari driver does not support the back method
			// see https://code.google.com/p/selenium/issues/detail?id=3771
			if (/safari|iOS|selendroid/.test(remote.environmentType.browserName)) {
				return this.skip("SafariDriver doesn't support back.");
			}
			return remote
			.get(require.toUrl("./StarRating-formback.html"))
			.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.then(function () {
				return clickOnStar(remote, "starratingA", 7, false);
			})
			.findById("submitButton")
				.click()
				.end()
			.then(pollUntil("return document.getElementById('parameters');", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.then(function () {
				return checkSubmitedParameters(remote, ["star1", "star2"], ["7", "2"])
					.goBack()
					.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
							intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
					.then(function () {
						return checkRating(remote, "starratingA", 7, 7, false);
					})
					.findById("submitButton")
						.click()
						.end()
						.then(pollUntil("return document.getElementById('parameters');", [],
								intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
					.then(function () {
						return checkSubmitedParameters(remote, ["star1", "star2"], ["7", "2"]);
					})
					.goBack()
					.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
							intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
					.then(function () {
						return checkRating(remote, "starratingA", 7, 7, false);
					});
			});
		},
		"form values": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			if (/iOS/.test(this.remote.environmentType.browserName)) {
				return this.skip("Value not being updated on click on iOS 8.1");
			}
			var remote = this.remote, id = "starrating1";
			return remote
			.get(require.toUrl("./StarRating-form.html"))
			.then(pollUntilStarRatingReady(id, intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.then(function () {
				return clickOnStar(remote, id, 2, false);
			})
			.findById("submitButton")
			.click()
			.end()
			.then(pollUntil("return document.getElementById('parameters');", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.end()
			.then(function () {
				return checkSubmitedParameters(remote, ["star1", "star2", "star4", "star5"], ["2", "2", "4", "5"]);
			});
		}
	});
});
