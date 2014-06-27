/**
 * Slider functional tests
 */
define(["intern!object",
	"intern/chai!assert",
	"require"
], function (registerSuite, assert, require) {
	//set to true to add wait time after each action; allows visual feedback when tests are running.
	var debug = false;
	
	registerSuite({
		name: "Slider initValue",
		"single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-single.html")
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false))
				.then(checkAria(remote, "singleSlider01", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false))
				.then(checkAria(remote, "singleSlider02", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false))
				.then(checkAria(remote, "singleSlider03", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},
		"Single slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider04", "50"))
				.then(checkOnChange(remote, "singleSlider04", false))
				.then(checkAria(remote, "singleSlider04", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider05", "25"))
				.then(checkOnChange(remote, "singleSlider05", false))
				.then(checkAria(remote, "singleSlider05", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider06", "100"))
				.then(checkOnChange(remote, "singleSlider06", false))
				.then(checkAria(remote, "singleSlider06", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},

		"Range slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-range.html")
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"Range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"Range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		},

		"Range slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider04", "25,75"))
				.then(checkOnChange(remote, "rangeSlider04", false))
				.then(checkAria(remote, "rangeSlider04", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider04", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider05", "10,90"))
				.then(checkOnChange(remote, "rangeSlider05", false))
				.then(checkAria(remote, "rangeSlider05", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider05", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider06", "80,100"))
				.then(checkOnChange(remote, "rangeSlider06", false))
				.then(checkAria(remote, "rangeSlider06", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider06", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		}
	});

	registerSuite({
		name: "Slider initValue (programmatic)",
		"single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-programmatic.html")
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false))
				.then(checkAria(remote, "singleSlider01", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false))
				.then(checkAria(remote, "singleSlider02", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false))
				.then(checkAria(remote, "singleSlider03", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},

		"Single slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider04", "50"))
				.then(checkOnChange(remote, "singleSlider04", false))
				.then(checkAria(remote, "singleSlider04", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"Single slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider05", "25"))
				.then(checkOnChange(remote, "singleSlider05", false))
				.then(checkAria(remote, "singleSlider05", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"Single slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "singleSlider06", "100"))
				.then(checkOnChange(remote, "singleSlider06", false))
				.then(checkAria(remote, "singleSlider06", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},

		"Range slider (default value)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"Range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"Range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		},

		"Range slider with intermediateChanges (default)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider04", "25,75"))
				.then(checkOnChange(remote, "rangeSlider04", false))
				.then(checkAria(remote, "rangeSlider04", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider04", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"Range slider with intermediateChanges (in bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider05", "10,90"))
				.then(checkOnChange(remote, "rangeSlider05", false))
				.then(checkAria(remote, "rangeSlider05", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider05", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"Range slider with intermediateChanges (out bound)": function () {
			var remote = this.remote;
			return remote.url()
				.then(logMessage(remote, this.id, "start..."))
				.then(checkInitValue(remote, "rangeSlider06", "80,100"))
				.then(checkOnChange(remote, "rangeSlider06", false))
				.then(checkAria(remote, "rangeSlider06", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider06", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		}
	});

	registerSuite({
		name: "Slider interactions",
		"Single": function () {
			var remote = this.remote;
			remote = loadTestPage(remote, "./slider/slider-single.html");
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
			var remote = this.remote;
			remote = loadTestPage(remote, "./slider/slider-range.html");
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
	function checkInitValue(remote, sliderId, expectedValue) {
		return function () {
			getElementById(remote, sliderId + "_value")
				.getAttribute("value")
				.then(function (value) {
					assert.strictEqual(value, expectedValue,
							"Element " + sliderId + " value is [" + value + "] instead of [" + expectedValue + "]");
				})
				.end();

			getElementByXPath(remote, "//d-slider[@id='" + sliderId + "']//input")
				.getAttribute("value")
				.then(function (value) {
					assert.strictEqual(value, expectedValue, sliderId + " wrapped input attribute value is [" + value +
						"] while expected [" + expectedValue + "]");
				})
				.end();

			if (debug) {
				remote.wait(500);
			}
			remote.end();
		};
	}

	function checkOnChange(remote, sliderId, hasValue, isIntermediateChange) {
		return function () {
			getElementById(remote, "onchange_target")
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
				getElementById(remote, "onchange_value")
					.getAttribute("value")
					.then(function (value) {
						assert.ok(value, "onchange value is expected");
					})
					.clear()
					.end();

				getElementById(remote, "onchange_intermediateChange")
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
				remote.wait(500);
			}
		};
	}

	function checkAria(remote, sliderId, className, ariaOrientation, ariaValueMin, ariaValueMax, ariaValueNow) {
		return function () {
			getSliderElementByCss(remote, sliderId, className)
				.getAttribute("role")
				.then(function (value) {
					assert.equal(value, "slider", "role");
				})
				.getAttribute("aria-orientation")
				.then(function (value) {
					assert.equal(value, ariaOrientation, "aria-orientation");
				})
				.getAttribute("aria-valuemin")
				.then(function (value) {
					assert.equal(value, ariaValueMin, "aria-valuemin");
				})
				.getAttribute("aria-valuemax")
				.then(function (value) {
					assert.equal(value, ariaValueMax, "aria-valuemax");
				})
				.getAttribute("aria-valuenow")
				.then(function (value) {
					assert.equal(value, ariaValueNow, "aria-valuenow");
				})
				.end();
		};
	}

	function getElementById(remote, elementId) {
		return remote.elementById(elementId)
			.then(null, function (error) {
				handleElementNotFound(elementId, error);
			});
	}

	function getElementByXPath(remote, xpath) {
		return remote.elementByXPath(xpath)
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
	 * element to contain this class name). Faster than calling getElementById + elementByCssSelector.
	 */
	function getSliderElementByCss(remote, sliderId, cssClass) {
		return remote
			.elementByXPath("//d-slider[@id='" + sliderId + "']" +
				"//div[contains(concat(' ', normalize-space(@class), ' '), ' " + cssClass + " ')]")
			.then(null, function (error) {
				handleElementNotFound("not found: " + sliderId + " > ." + cssClass, error);
			});
	}

	/**
	 * simulate a click on the slider progress bar.
	 */
	function clickOnProgressBar(remote, sliderId, moveToX, moveToY) {
		return function () {
			getSliderElementByCss(remote, sliderId, "d-slider-progress-bar")
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
				remote.wait(500);
			}
		};
	}

	function clickOnHandler(remote, sliderId) {
		getSliderElementByCss(remote, sliderId, "d-slider-handle-max")
			.moveTo()
			//Simulate click with button down/up to bypass this issue:
			//"change" event is not fired when click() on FF with selenium
			//https://code.google.com/p/selenium/issues/detail?id=157
			.buttonDown()
			.buttonUp()
			.end();
		if (debug) {
			remote.wait(500);
		}
	}

	function moveHandler(remote, sliderId, moveToX, moveToY) {
		getSliderElementByCss(remote, sliderId, "d-slider-handle-max")
			.moveTo()
			.buttonDown()
			.moveTo(moveToX, moveToY)
			.buttonUp()
			.end();
		if (debug) {
			remote.wait(500);
		}
	}

	function moveRange(remote, sliderId, moveToX, moveToY) {
		getSliderElementByCss(remote, sliderId, "d-slider-progress-bar")
			.moveTo()
			.buttonDown()
			.moveTo(moveToX, moveToY)
			//.wait(20)
			.buttonUp()
			.end();
		if (debug) {
			remote.wait(500);
		}
	}

	function setSlideRange(remote, sliderId, enable) {
		remote.execute("document.getElementById('" + sliderId + "').slideRange = " + String(enable) + ";");
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

	function logMessage(remote, prefix, message) {
		return function () {
			console.log("[" + prefix + "] " + message);
		};
	}

	function hasMoveToIssue(remote) {
		//SafariDriver doesn't support moveTo, see https://code.google.com/p/selenium/issues/detail?id=4136
		return (/safari|iPhone|selendroid/.test(remote.environmentType.browserName) ||
			remote.environmentType.safari);
	}
});
