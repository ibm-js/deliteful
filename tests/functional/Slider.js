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
			var testPage = loadTestPage(this.remote, "./slider/slider-single.html");
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider01", "50");
			checkOnChange(testPage, "singleSlider01", false);
			return testPage;
		},
		"single slider (value in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider02", "25");
			checkOnChange(testPage, "singleSlider02", false);
			return testPage;
		},
		"single slider (value out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider03", "100");
			checkOnChange(testPage, "singleSlider03", false);
			return testPage;
		},

		"Single slider with intermediateChanges (default)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider04", "50");
			checkOnChange(testPage, "singleSlider04", false);
			return testPage;
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider05", "25");
			checkOnChange(testPage, "singleSlider05", false);
			return testPage;
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider06", "100");
			checkOnChange(testPage, "singleSlider06", false);
			return testPage;
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
			var testPage = loadTestPage(this.remote, "./slider/slider-range.html");
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider01", "25,75");
			checkOnChange(testPage, "rangeSlider01", false);
			return testPage;
		},
		"Range slider (value in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider02", "10,90");
			checkOnChange(testPage, "rangeSlider02", false);
			return testPage;
		},
		"Range slider (value out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider03", "80,100");
			checkOnChange(testPage, "rangeSlider03", false);
			return testPage;
		},

		"Range slider with intermediateChanges (default)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider04", "25,75");
			checkOnChange(testPage, "rangeSlider04", false);
			return testPage;
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider05", "10,90");
			checkOnChange(testPage, "rangeSlider05", false);
			return testPage;
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider06", "80,100");
			checkOnChange(testPage, "rangeSlider06", false);
			return testPage;
		}
	});

	registerSuite({
		name: "Slider initValue (programmatic)",
		"single slider (default value)": function () {
			var testPage = loadTestPage(this.remote, "./slider/slider-programmatic.html");
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider01", "50");
			checkOnChange(testPage, "singleSlider01", false);
			return testPage;
		},
		"single slider (value in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider02", "25");
			checkOnChange(testPage, "singleSlider02", false);
			return testPage;
		},
		"single slider (value out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider03", "100");
			checkOnChange(testPage, "singleSlider03", false);
			return testPage;
		},

		"Single slider with intermediateChanges (default)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider04", "50");
			checkOnChange(testPage, "singleSlider04", false);
			return testPage;
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider05", "25");
			checkOnChange(testPage, "singleSlider05", false);
			return testPage;
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "singleSlider06", "100");
			checkOnChange(testPage, "singleSlider06", false);
			return testPage;
		},

		"Range slider (default value)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider01", "25,75");
			checkOnChange(testPage, "rangeSlider01", false);
			return testPage;
		},
		"Range slider (value in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider02", "10,90");
			checkOnChange(testPage, "rangeSlider02", false);
			return testPage;
		},
		"Range slider (value out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider03", "80,100");
			checkOnChange(testPage, "rangeSlider03", false);
			return testPage;
		},

		"Range slider with intermediateChanges (default)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider04", "25,75");
			checkOnChange(testPage, "rangeSlider04", false);
			return testPage;
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider05", "10,90");
			checkOnChange(testPage, "rangeSlider05", false);
			return testPage;
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var testPage = this.remote.url();
			logMessage2(testPage, this.id, "start...");
			checkInitValue(testPage, "rangeSlider06", "80,100");
			checkOnChange(testPage, "rangeSlider06", false);
			return testPage;
		}
	});

	registerSuite({
		name: "Slider interactions",
		"Single": function () {
			var testPage = loadTestPage(this.remote, "./slider/slider-single.html");
			if (hasMoveToIssue(testPage)) {
				logMessage2(testPage, this.id, "no support for moveTo, skipping tests...");
				return testPage;
			}
			logMessage2(testPage, this.id, "click on handler...");
			clickOnHandler(testPage, "singleSlider01");
			checkOnChange(testPage, "singleSlider01", false);

			logMessage2(testPage, this.id, "click on progress bar");
			clickOnProgressBar(testPage, "singleSlider01", 50, 10);
			checkOnChange(testPage, "singleSlider01", true);

			logMessage2(testPage, this.id, "move handler");
			moveHandler(testPage, "singleSlider01", 26, 10);
			checkOnChange(testPage, "singleSlider01", true);

			return testPage;
		},

		"Range": function () {
			var testPage = loadTestPage(this.remote, "./slider/slider-range.html");
			if (hasMoveToIssue(testPage)) {
				logMessage2(testPage, this.id, "no support for moveTo, skipping tests...");
				return testPage;
			}
			logMessage2(testPage, this.id, "click on handler...");
			clickOnHandler(testPage, "rangeSlider01");
			checkOnChange(testPage, "rangeSlider01", false);

			logMessage2(testPage, this.id, "click on progress bar");
			clickOnProgressBar(testPage, "rangeSlider01", 50, 10);
			checkOnChange(testPage, "rangeSlider01", false);//no action when slideRange=true

			logMessage2(testPage, this.id, "move handler");
			moveHandler(testPage, "rangeSlider01", 26, 10);
			checkOnChange(testPage, "rangeSlider01", true);

			logMessage2(testPage, this.id, "move range (slideRange=true)");
			moveRange(testPage, "rangeSlider01", 31, 10);
			checkOnChange(testPage, "rangeSlider01", true);

			logMessage2(testPage, this.id, "click on progress bar (slideRange=false)");
			setSlideRange(testPage, "rangeSlider01", false);
			clickOnProgressBar(testPage, "rangeSlider01", 50, 10);
			checkOnChange(testPage, "rangeSlider01", true);

			return testPage;
		}
	});

	/**
	 * check the value after the slider is started, also check the attribute value of the wrapped input element.
	 */
	function checkInitValue(testPage, sliderId, expectedValue) {
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
				assert.equal(value, expectedValue, sliderId + " wrapped input attribute value is [" + value +
					"] while expected [" + expectedValue + "]");
			})
			.end();

		if (debug) {
			testPage.wait(500);
		}
		testPage.end();
	}

	function checkOnChange(testPage, sliderId, hasValue, isIntermediateChange) {
		getElementById(testPage, "onchange_target")
			.getAttribute("value")
			.then(function (target) {
				if (hasValue) {
					assert.strictEqual(target, sliderId, "onchange target [" + target + "]" +
						" not expected. Must be [" + sliderId + "]");
				} else {
					assert.ok(target.length === 0, "onchange not expected, but received from [" + target + "]");
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
						assert.equal(value, "true", "should be an intermediate change");
					} else {
						assert.equal(value, "false", "should NOT be an intermediate change [" + value + "]");
					}
				})
				.clear()
				.end();
		}
		if (debug) {
			testPage.wait(500);
		}
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
			console.log("[" + error.name + "] " +  customMsg);
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

	function logMessage2(testPage, prefix, message) {
		testPage.then(function () {
			console.log("[" + prefix + "] " + message);
		});
	}

	function hasMoveToIssue(testPage) {
		// SafariDriver doesn't support moveTo, see https://code.google.com/p/selenium/issues/detail?id=4136
		return (/safari|iPhone|selendroid/.test(testPage.environmentType.browserName) ||
			testPage.environmentType.safari);
	}
})
;