define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;
	var keys = require("@theintern/leadfoot/keys").default;
	var assert = intern.getPlugin("chai").assert;

	function clickOnStar(remote, widgetId, starIndex /*first index is 1*/,
		firstHalf/*true to click on the first half, false to click the second half*/) {
		var divIndex = starIndex * 2 + (firstHalf ? 0 : 1);
		return remote
			.findByCssSelector("#" + widgetId + " .d-star-rating-star-icon:nth-child(" + divIndex + ")")
			.click()
			.end();
	}

	function clickOnZeroSettingArea(remote, widgetId) {
		return remote
			.findByCssSelector("#" + widgetId + " .d-star-rating-zero")
			.click()
			.end();
	}

	function checkSubmittedParameters(remote, /*Array*/expectedKeys, /*Array*/expectedValues) {
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
	}

	function checkRating(remote, widgetId, expectedMax, expectedValue, expectedDisabled, comment) {
		return remote
			.execute("return document.getElementById('" + widgetId + "').value;").then(function (value) {
				assert.strictEqual(value, expectedValue, "value " + comment);
			})
			.findByCssSelector("#" + widgetId + " [role=slider]")
				.getAttribute("aria-valuenow").then(function (value) {
					assert.strictEqual(value, expectedValue.toString(), "aria-valuenow " + comment);
				})
				.getAttribute("aria-disabled").then(function (value) {
					assert.strictEqual(value, expectedDisabled ? "true" : "false", "aria-disabled " + comment);
				})
				.getAttribute("tabindex").then(function (value) {
					assert.strictEqual(value, expectedDisabled ? null : "0", "tabIndex " + comment);
				})
				.getAttribute("role").then(function (value) {
					assert.strictEqual(value, "slider", "role " + comment);
				})
				.getAttribute("aria-valuemin").then(function (value) {
					assert.strictEqual(value, "0", "aria-valuemin " + comment);
				})
				.getAttribute("aria-valuemax").then(function (value) {
					assert.strictEqual(value, expectedMax.toString(), "aria-valuemax " + comment);
				})
				.getAttribute("aria-valuetext").then(function (value) {
					assert.strictEqual(value, expectedValue + " stars", "aria-valuetest " + comment);
				})
				.end()
			.execute("return Array.prototype.map.call(" + widgetId
					+ ".getElementsByClassName('d-star-rating-star-icon'), "
					+ "function(elem){ return elem.className; });").then(function (classNames) {
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
	}

	function defaultEditableRatingTest(remote, widgetId, halfStars, zeroSetting, expectedInitialValue) {
		var expectedAfterClickOnThirdStar = halfStars ? 2.5 : 3;
		return remote
			.then(function () {
				return checkRating(remote, widgetId, 7, expectedInitialValue, false, "initial value");
			})
			// check rating change after firing down and up events on a star
			.then(function () {
				return clickOnStar(remote, widgetId, 3, true);
			})
			.then(function () {
				return checkRating(remote, widgetId, 7, expectedAfterClickOnThirdStar, false, "after click on star");
			})
			// set zero rating
			.then(function () {
				if (zeroSetting) {
					return clickOnZeroSettingArea(remote, widgetId);
				}
			})
			.then(function () {
				if (zeroSetting) {
					return checkRating(remote, widgetId, 7, 0, false, "after click on zero setting area");
				}
			});
		///////////////////////////////////////////
		// TODO: CHECK USING MOVE TO SET VALUES
		///////////////////////////////////////////
	}

	registerSuite("StarRating tests", {
		before: function () {
			return this.remote
				.get(require.toUrl("deliteful/tests/functional/StarRating.html"))
				.then(pollUntil("return ('ready' in window &&  ready) ? true : null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		tests: {
			"read only ltr": function () {
				var remote = this.remote, widgetId = "star";
				return remote
					.then(function () {
						// Check initial rating
						return checkRating(remote, widgetId, 1, 0, false, "initial");
					})
					// click the + button and verify the value is updated
					.findById("starplus")
						.click()
						.then(function () {
							return checkRating(remote, widgetId, 1, 0.5, false, "star plus 1");
						})
						.click()
						.then(function () {
							return checkRating(remote, widgetId, 1, 1, false, "star plus 2");
						})
						.end()
						// click the - button and verify the value is updated
						.findById("starminus")
						.click()
						.then(function () {
							return checkRating(remote, widgetId, 1, 0.5, false, "star minus 1");
						})
						.click()
						.then(function () {
							return checkRating(remote, widgetId, 1, 0, false, "star minus 2");
						})
					.end()
					// click on the star: doesn't change anything
					.then(function () {
						if (/safari/i.test(remote.environmentType.browserName)) {
							// Avoid Safari webdriver bug where it claims element isn't clickable just because
							// it has overflow:hidden set on it.
							return;
						}
						return clickOnStar(remote, widgetId, 1, true);
					})
					.then(function () {
						return checkRating(remote, widgetId, 1, 0, false, "click on star");
					});
			},

			"editable ltr": function () {
				if (this.remote.environmentType.brokenMouseEvents) {
					// https://github.com/theintern/leadfoot/issues/17
					return this.skip("click() doesn't generate mousedown, so value won't be updated");
				}
				if (this.remote.environmentType.platformName === "iOS") {
					// https://github.com/theintern/leadfoot/issues/61
					return this.skip("click() doesn't generate touchstart, so value won't be updated");
				}
				return defaultEditableRatingTest(this.remote, "editablestar1", false, true, 0);
			},

			"editable half values ltr": function () {
				if (this.remote.environmentType.brokenMouseEvents ||
					/firefox/i.test(this.remote.environmentType.browserName)) {
					// https://github.com/theintern/leadfoot/issues/17
					return this.skip("click() doesn't generate mousedown, so value won't be updated");
				}
				if (this.remote.environmentType.platformName === "iOS") {
					// https://github.com/theintern/leadfoot/issues/61
					return this.skip("click() doesn't generate touchstart, so value won't be updated");
				}
				return defaultEditableRatingTest(this.remote, "editablestar2", true, true, 0);
			},

			"editable half values no zero setting ltr": function () {
				if (this.remote.environmentType.brokenMouseEvents ||
					/firefox/i.test(this.remote.environmentType.browserName)) {
					// https://github.com/theintern/leadfoot/issues/17
					return this.skip("click() doesn't generate mousedown, so value won't be updated");
				}
				if (this.remote.environmentType.platformName === "iOS") {
					// https://github.com/theintern/leadfoot/issues/61
					return this.skip("click() doesn't generate touchstart, so value won't be updated");
				}
				return defaultEditableRatingTest(this.remote, "editablestar5", true, false, 0.5);
			},

			"editable programmatic onchange ltr": function () {
				if (this.remote.environmentType.brokenMouseEvents ||
					/firefox/i.test(this.remote.environmentType.browserName)) {
					// https://github.com/theintern/leadfoot/issues/17
					return this.skip("click() doesn't generate mousedown, so value won't be updated");
				}
				if (this.remote.environmentType.platformName === "iOS") {
					// https://github.com/theintern/leadfoot/issues/61
					return this.skip("click() doesn't generate touchstart, so value won't be updated");
				}

				var remote = this.remote, id = "editablestar6";
				return remote
					// Check initial rating
					.then(function () {
						return checkRating(remote, id, 7, 3.5, false, "initial");
					})
					// Check message
					.findById(id + "value").getVisibleText().then(function (text) {
						assert.strictEqual(text, "Rating is 3.5 stars", "message is not the one expected for " + id);
					}).end()
					// check rating change after clicking on a star
					.then(function () {
						return clickOnStar(remote, id, 3, true);
					})
					.then(function () {
						return checkRating(remote, id, 7, 2.5, false, "click on star");
					})
					// Check message
					.findById(id + "value").getVisibleText().then(function (text) {
						assert.strictEqual(text, "Rating is 2.5 stars", "message is not the one expected for " + id);
					}).end()
					// set zero rating
					.then(function () {
						return clickOnZeroSettingArea(remote, id);
					})
					.then(function () {
						return checkRating(remote, id, 7, 0, false, "click on zero setting");
					})
					// Check message
					.findById(id + "value").getVisibleText().then(function (text) {
						assert.strictEqual(text, "Rating is 0 stars", "message is not the one expected for " + id);
					}).end();
			},

			"default": function () {
				// Check initial rating
				return checkRating(this.remote, "defaultstar", 5, 0, false, "initial");
			},

			"tab order": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return remote
					.findById("afinput").click().end()
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id;").then(function (value) {
						assert.strictEqual(value, "firsttabindexstar");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "secondtabindexstar");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "star");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.id").then(function (value) {
						assert.strictEqual(value, "starminus");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.id").then(function (value) {
						assert.strictEqual(value, "starplus");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "editablestar1");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "editablestar2");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "editablestar5");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "editablestar6");
					})
					.pressKeys(keys.TAB)
					.execute("return document.activeElement.parentNode.id").then(function (value) {
						assert.strictEqual(value, "defaultstar");
					});
			},

			"disabled": function () {
				// Check initial rating
				return checkRating(this.remote, "disabled", 7, 3, true, "initial");
			}
		}
	});

	registerSuite("StarRating form tests", {
		"form back button": function () {
			var remote = this.remote;
			// Safari driver does not support the back method
			// see https://code.google.com/p/selenium/issues/detail?id=3771
			if (/safari|selendroid/i.test(remote.environmentType.browserName)) {
				return this.skip("SafariDriver doesn't support back.");
			}
			if (this.remote.environmentType.brokenMouseEvents) {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown, so value won't be updated");
			}
			if (this.remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart, so value won't be updated");
			}
			if (this.remote.environmentType.browserName === "MicrosoftEdge") {
				return this.skip("works manually but fails against saucelabs");
			}
			return remote
				.get(require.toUrl("deliteful/tests/functional/StarRating-formback.html"))
				.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {
					return clickOnStar(remote, "starratingA", 7, false);
				})
				.findById("submitButton").click().end()
				.findById("parameters").end()	// wait for result page to load
				.then(function () {
					return checkSubmittedParameters(remote, ["star1", "star2"], ["7", "2"])
						.goBack()
						.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
							intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {
							return checkRating(remote, "starratingA", 7, 7, false, "go back 1");
						})
						.findById("submitButton").click().end()
						.findById("parameters").end()	// wait for result page to load
						.then(function () {
							return checkSubmittedParameters(remote, ["star1", "star2"], ["7", "2"]);
						})
						.goBack()
						.then(pollUntil("return 'ready' in window && ready ? true : null;", [],
							intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {
							return checkRating(remote, "starratingA", 7, 7, false, "go back 2");
						});
				});
		},

		"form values": function () {
			if (this.remote.environmentType.brokenMouseEvents) {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown, so value won't be updated");
			}
			if (this.remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart, so value won't be updated");
			}
			var remote = this.remote, id = "starrating1";
			return remote
				.get(require.toUrl("deliteful/tests/functional/StarRating-form.html"))
				.then(pollUntil("return ('ready' in window &&  ready) ? true : null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {
					return clickOnStar(remote, id, 2, false);
				})
				.findById("submitButton").click().end()
				.findById("parameters").end()	// wait for result page to load
				.then(function () {
					return checkSubmittedParameters(remote, ["star1", "star2", "star4", "star5"], ["2", "2", "4", "5"]);
				});
		}
	});
});
