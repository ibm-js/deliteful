/**
 * Slider functional tests
 */
define(["intern!object",
	"intern/chai!assert",
	"require"
], function (registerSuite, assert, require) {
	var debug = false;//set to true to add wait time after each action; allows visual feedback when tests are running.
	/**
	 * - Check if the value read from widget.value property just after the widget has started is the expected one:
	 *   a) default computed value when user doesn't specify anything (or just "," to force slider in "range" mode)
	 *   b) value specified by user is in bound (relative to slider min/max)
	 *   c) value specified by user is out of bound
	 * - Check that no "change" event has been fired during the value initialization.
	 * - check that no onchange is fired when clicking on a slider handle
	 * - Check that onchange is triggered and resulting value is correct when clicking on the progress bar.
	 * - Check that onchange is triggered and resulting value is correct when moving a slider handle.
	 * - Check that onchange is triggered and resulting value is correct when moving progressbar on range slider.
	 */
	registerSuite({
		name: "Slider initValue",

		"single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-single.html")
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false));
		},
		"single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false));
		},
		"single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false));
		},
		"Single slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider04", "50"))
				.then(checkOnChange(remote, "singleSlider04", false));
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider05", "25"))
				.then(checkOnChange(remote, "singleSlider05", false));
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider06", "100"))
				.then(checkOnChange(remote, "singleSlider06", false));
		},

		"Single slider with input element (default value)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider07", "50");
			checkOnChange(testPage, "singleSlider07", false);
			return testPage;
		},
		"Single slider with input element (in bound value)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider08", "25");
			checkOnChange(testPage, "singleSlider08", false);
			return testPage;
		},
		"Single slider with input element (out bound value)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider09", "100");
			checkOnChange(testPage, "singleSlider09", false);
			return testPage;
		},

		"Range slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-range.html")
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false));
		},
		"Range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false));
		},
		"Range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false));
		},

		"Range slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider04", "25,75"))
				.then(checkOnChange(remote, "rangeSlider04", false));
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider05", "10,90"))
				.then(checkOnChange(remote, "rangeSlider05", false));
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider06", "80,100"))
				.then(checkOnChange(remote, "rangeSlider06", false));
		}
	});

	registerSuite({
		name: "Slider initValue (programmatic)",
		"single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-programmatic.html")
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false));
		},
		"single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false));
		},
		"single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false));
		},

		"Single slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider04", "50"))
				.then(checkOnChange(remote, "singleSlider04", false));
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider05", "25"))
				.then(checkOnChange(remote, "singleSlider05", false));
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider06", "100"))
				.then(checkOnChange(remote, "singleSlider06", false));
		},

		"Range slider (default value)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false));
		},
		"Range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false));
		},
		"Range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false));
		},

		"Range slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider04", "25,75"))
				.then(checkOnChange(remote, "rangeSlider04", false));
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider05", "10,90"))
				.then(checkOnChange(remote, "rangeSlider05", false));
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider06", "80,100"))
				.then(checkOnChange(remote, "rangeSlider06", false));
		}
	});

	registerSuite({
		name: "Slider interactions",
		"Single": function () {
			var remote = loadTestPage(this.remote, "./slider/slider-single.html");
			if (hasMoveToIssue(remote)) {
				return remote
					.then(logMessage(remote, this.id, "no support for moveTo, skipping tests..."));
			} else {
				return remote
					.then(logMessage(remote, this.id, "click on handler..."))
					.then(clickOnHandler(remote, "singleSlider01"))
					.then(checkOnChange(remote, "singleSlider01", false))

					.then(logMessage(remote, this.id, "click on progress bar"))
					.then(clickOnProgressBar(remote, "singleSlider01", 50, 10))
					.then(checkOnChange(remote, "singleSlider01", true))

					.then(logMessage(remote, this.id, "move handler"))
					.then(moveHandler(remote, "singleSlider01", 26, 10))
					.then(checkOnChange(remote, "singleSlider01", true));
			}
		},

		"Range": function () {
			var remote = loadTestPage(this.remote, "./slider/slider-range.html");
			if (hasMoveToIssue(remote)) {
				return remote
					.then(logMessage(remote, this.id, "no support for moveTo, skipping tests..."));
			} else {
				return remote
					.then(logMessage(remote, this.id, "click on handler..."))
					.then(clickOnHandler(remote, "rangeSlider01"))
					.then(checkOnChange(remote, "rangeSlider01", false))

					.then(logMessage(remote, this.id, "click on progress bar"))
					.then(clickOnProgressBar(remote, "rangeSlider01", 50, 10))
					.then(checkOnChange(remote, "rangeSlider01", false))//no action when slideRange=true

					.then(logMessage(remote, this.id, "move handler"))
					.then(moveHandler(remote, "rangeSlider01", 26, 10))
					.then(checkOnChange(remote, "rangeSlider01", true))

					.then(logMessage(remote, this.id, "move range (slideRange=true)"))
					.then(moveRange(remote, "rangeSlider01", 31, 10))
					.then(checkOnChange(remote, "rangeSlider01", true))

					.then(logMessage(remote, this.id, "click on progress bar (slideRange=false)"))
					.then(setSlideRange(remote, "rangeSlider01", false))
					.then(clickOnProgressBar(remote, "rangeSlider01", 50, 10))
					.then(checkOnChange(remote, "rangeSlider01", true));
			}
		}
	});

	/**
	 * check the value after the slider is started, also check the attribute value of the wrapped input element.
	 */
	function checkInitValue(testPage, sliderId, expectedValue) {
		return function () {
			getElementById(testPage, sliderId + "_value")
				.getAttribute("value")
				.then(function (value) {
					assert.strictEqual(value, expectedValue,
							"Element " + sliderId + " value is [" + value + "] instead of [" + expectedValue + "]");
				})
				.end();

			getElementByXPath(testPage, "//d-slider[@id='" + sliderId + "']//input")
				.getAttribute("value")
				.then(function (value) {
					assert.strictEqual(value, expectedValue, sliderId + " wrapped input attribute value is [" + value +
						"] while expected [" + expectedValue + "]");
				})
				.end();

			if (debug) {
				testPage.wait(500);
			}
			testPage.end();
		};
	}

	function checkOnChange(testPage, sliderId, hasValue, isIntermediateChange) {
		return function () {
			getElementById(testPage, "onchange_target")
				.getAttribute("value")
				.then(function (target) {
					if (hasValue) {
						assert.strictEqual(target, sliderId, "onchange target [" + target + "]" +
							" not expected. Must be [" + sliderId + "]");
					} else {
						assert.strictEqual(target.length, 0, "unexpected change event received from [" + target + "]");
					}
				})
				.clear()
				.end();

			if (hasValue) {
				getElementById(testPage, "onchange_value")
					.getAttribute("value")
					.then(function (value) {
						assert.ok(value, "onchange value is expected");
					})
					.clear()
					.end();

				getElementById(testPage, "onchange_intermediateChange")
					.getAttribute("value")
					.then(function (value) {
						if (isIntermediateChange) {
							assert.strictEqual(value, "true", "should be an intermediate change");
						} else {
							assert.strictEqual(value, "false", "should NOT be an intermediate change");
						}
					})
					.clear()
					.end();
			}
			if (debug) {
				testPage.wait(500);
			}
		};
	}

	////////////////////////////////////
	function getElementById(testPage, elementId) {
		return testPage.elementById(elementId)
			.then(null, function (error) {
				handleElementNotFound(elementId, error);
			});
	}

	function getElementByXPath(testPage, xpath) {
		return testPage.elementByXPath(xpath)
			.then(null, function (error) {
				handleElementNotFound(xpath, error);
			});
	}

	/**
	 * display msg with information on the not found element and throw an assert to avoid unclear stack trace.
	 * errors not related to not found element are re-throwned.
	 */
	function handleElementNotFound(elementId, error) {
		if (/NoSuchElement|NoSuchWindow|XPathLookupError/.test(error.name)) {
			var customMsg = "(" + error.name + ") element [" + elementId + "] not found.";
			console.log("[" + error.name + "] " + customMsg);
			assert.ok(false, customMsg);
		} else {
			throw error;
		}
	}

	/**
	 * return a subelement of d-slider based on a css class (must be the only
	 * element to contain this class name)
	 * note: elementByCssSelector not working on safari, use elementByXPath instead
	 */
	function getSliderElementByCss(testPage, sliderId, cssClass) {
		return testPage
			.elementByXPath("//d-slider[@id='" + sliderId + "']" +
				"//div[contains(concat(' ', normalize-space(@class), ' '), ' " + cssClass + " ')]")
			.then(null, function (error) {
				handleElementNotFound("d-slider: " + sliderId + " > ." + cssClass, error);
			});
	}

	/**
	 * simulate a click on the slider progress bar.
	 */
	function clickOnProgressBar(testPage, sliderId, moveToX, moveToY) {
		return function () {
			getSliderElementByCss(testPage, sliderId, "d-slider-progress-bar")
				.moveTo(moveToX, moveToY)
				.wait(50)
				//1. There is a pb with "change" event not fired after a click() on FF with selenium:
				//https://code.google.com/p/selenium/issues/detail?id=157
				//Slider does not listen on click events, so send mouseDown+Up to bypass FF problem.
				//2. click() seems to click on the center of the element whatever the previous moveTo(x,y) on Chrome
				.buttonDown()
				.wait(50)
				.buttonUp()
				.end();
			if (debug) {
				testPage.wait(500);
			}
		};
	}

	function clickOnHandler(testPage, sliderId) {
		getSliderElementByCss(testPage, sliderId, "d-slider-handle-max")
			.moveTo()
			//Simulate click with button down/up to bypass this issue:
			//"change" event is not fired when click() on FF with selenium
			//https://code.google.com/p/selenium/issues/detail?id=157
			.buttonDown()
			.buttonUp()
			.end();
		if (debug) {
			testPage.wait(500);
		}
	}

	function moveHandler(testPage, sliderId, moveToX, moveToY) {
		getSliderElementByCss(testPage, sliderId, "d-slider-handle-max")
			.moveTo()
			.buttonDown()
			.moveTo(moveToX, moveToY)
			.buttonUp()
			.end();
		if (debug) {
			testPage.wait(500);
		}
	}

	function moveRange(testPage, sliderId, moveToX, moveToY) {
		getSliderElementByCss(testPage, sliderId, "d-slider-progress-bar")
			.moveTo()
			.buttonDown()
			.moveTo(moveToX, moveToY)
			//.wait(20)
			.buttonUp()
			.end();
		if (debug) {
			testPage.wait(500);
		}
	}

	function setSlideRange(testPage, sliderId, enable) {
		testPage.execute("document.getElementById('" + sliderId + "').slideRange = " + String(enable) + ";");
	}

	/**
	 * Load a new test page in the remote session
	 */
	function loadTestPage(remote, url) {
		return remote
			.get(require.toUrl(url))
			.waitForCondition("'ready' in window &&  ready", 10000, 1000)
			.then(function () {
				console.log(url + " loaded.");
			});
	}

	function logMessage(testPage, prefix, message) {
		return function () {
			console.log("[" + prefix + "] " + message);
		};
	}

	function hasMoveToIssue(testPage) {
		// SafariDriver doesn't support moveTo, see https://code.google.com/p/selenium/issues/detail?id=4136
		return (/safari|iPhone|selendroid/.test(testPage.environmentType.browserName) ||
			testPage.environmentType.safari);
	}
});
