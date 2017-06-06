/**
 * Slider functional tests
 */
define(["intern",
    "intern!object",
    "intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, assert, require) {
	var debug = false; // set to true for additional feedback on test execution (adds console messages + wait time).

	registerSuite({
		name: "Slider (markup)",
		// single
		"init single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider.html")
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false))
				.then(checkAria(remote, "singleSlider01", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"init single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false))
				.then(checkAria(remote, "singleSlider02", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"init single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false))
				.then(checkAria(remote, "singleSlider03", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},
		"single slider interaction": function () {
			var remote = this.remote;
			// See https://code.google.com/p/selenium/issues/detail?id=4136
			if (/safari|firefox|iOS|selendroid/.test(remote.environmentType.browserName)) {
				return this.skip("moveMouseTo() unsupported");
			}
			if (remote.environmentType.brokenMouseEvents) {
				// https://github.com/theintern/leadfoot/issues/103
				return this.skip("IE uses synthetic mouse events and doesn't fire pointer events");
			}
			return remote
				.then(logMessage(remote, this.id, "click on handle..."))
				.then(clickOnHandle(remote, "singleSlider01"))
				.then(checkOnChange(remote, "singleSlider01", false))

				.then(logMessage(remote, this.id, "click on progress bar"))
				.then(clickOnProgressBar(remote, "singleSlider01", 50, 3))
				.then(checkOnChange(remote, "singleSlider01", true))

				.then(logMessage(remote, this.id, "move handle"))
				.then(moveHandle(remote, "singleSlider01", 26, 10))
				.then(checkOnChange(remote, "singleSlider01", true));
		},
		// range
		"init range slider (default value)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"init range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"init range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		},
		"range slider interaction": function () {
			var remote = this.remote;
			// See https://code.google.com/p/selenium/issues/detail?id=4136
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				return this.skip("moveMouseTo not supported");
			}
			if (remote.environmentType.brokenMouseEvents) {
				// https://github.com/theintern/leadfoot/issues/103
				return this.skip("IE uses synthetic mouse events and doesn't fire pointer events");
			}
			return remote
				.then(logMessage(remote, this.id, "click on handle..."))
				.then(clickOnHandle(remote, "rangeSlider01"))
				.then(checkOnChange(remote, "rangeSlider01", false))

				.then(logMessage(remote, this.id, "click on progress bar"))
				.then(clickOnProgressBar(remote, "rangeSlider01", 50, 3))
				.then(checkOnChange(remote, "rangeSlider01", false))// no action when slideRange=true

				.then(logMessage(remote, this.id, "move handle"))
				.then(moveHandle(remote, "rangeSlider01", 26, 10))
				.then(checkOnChange(remote, "rangeSlider01", true))

				.then(logMessage(remote, this.id, "move range (slideRange=true)"))
				.then(moveRange(remote, "rangeSlider01", 31, 10))
				.then(checkOnChange(remote, "rangeSlider01", true))

				.then(logMessage(remote, this.id, "click on progress bar (slideRange=false)"))
				.then(setSlideRange(remote, "rangeSlider01", false))
				.then(clickOnProgressBar(remote, "rangeSlider01", 50, 3))
				.then(checkOnChange(remote, "rangeSlider01", true));
		},
		"range slider interaction inside a listening parent": function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid|internet explorer/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo not supported");
			}

			return remote
				.then(logMessage(remote, this.id, "move handle"))
				.then(clickOnHandle(remote, "rangeSlider01"))
				.then(moveHandle(remote, "rangeSlider01", 70, 30))
				.execute("return rangeSlider01parent")
				.then(function (rangeSlider01parent) {
					assert.equal(rangeSlider01parent.pointerdowns, 0, "parent did not detect pointerdown");
					assert.equal(rangeSlider01parent.pointermoves, 0, "parent did not detect pointermove");
				})
				.end();
		}
	});

	registerSuite({
		name: "Slider (programmatic)",
		"init single slider (default value)": function () {
			var remote = this.remote;
			return loadTestPage(remote, "./slider/slider-prg.html")
				.then(checkInitValue(remote, "singleSlider01", "50"))
				.then(checkOnChange(remote, "singleSlider01", false))
				.then(checkAria(remote, "singleSlider01", "d-slider-handle-max", "horizontal", "0", "100", "50"));
		},
		"init single slider (value in bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "singleSlider02", "25"))
				.then(checkOnChange(remote, "singleSlider02", false))
				.then(checkAria(remote, "singleSlider02", "d-slider-handle-max", "horizontal", "0", "100", "25"));
		},
		"init single slider (value out bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "singleSlider03", "100"))
				.then(checkOnChange(remote, "singleSlider03", false))
				.then(checkAria(remote, "singleSlider03", "d-slider-handle-max", "horizontal", "0", "100", "100"));
		},

		"init range slider (default value)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider01", "25,75"))
				.then(checkOnChange(remote, "rangeSlider01", false))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-min", "horizontal", "0", "75", "25"))
				.then(checkAria(remote, "rangeSlider01", "d-slider-handle-max", "horizontal", "25", "100", "75"));
		},
		"init range slider (value in bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider02", "10,90"))
				.then(checkOnChange(remote, "rangeSlider02", false))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-min", "horizontal", "0", "90", "10"))
				.then(checkAria(remote, "rangeSlider02", "d-slider-handle-max", "horizontal", "10", "100", "90"));
		},
		"init range slider (value out bound)": function () {
			var remote = this.remote;
			return remote.getCurrentUrl()
				.then(checkInitValue(remote, "rangeSlider03", "80,100"))
				.then(checkOnChange(remote, "rangeSlider03", false))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-min", "horizontal", "0", "100", "80"))
				.then(checkAria(remote, "rangeSlider03", "d-slider-handle-max", "horizontal", "80", "100", "100"));
		}
	});

	/**
	 * check the value after the slider is started, also check the value of the wrapped input element.
	 */
	function checkInitValue(remote, sliderId, expectedValue) {
		return function () {
			debugMsg("checkInitValue...");
			return remote.execute("return " + sliderId + "_value.value;")
				.then(function (value) {
					debugMsg("checkInitValue: " + value);
					assert.strictEqual(value, expectedValue, sliderId + ".value");
				})
				.end()
				.then(function () {
					return remote.execute("return document.querySelector('#" + sliderId + " > input').value;")
						.then(function (value) {
							debugMsg("checkInitValue: wrapped input value");
							assert.strictEqual(value, expectedValue, sliderId + " wrapped input attribute");
						})
						.end();
				})
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function checkOnChange(remote, sliderId, hasValue) {
		return function () {
			debugMsg("checkOnChange...");
			return remote.execute("return onchange_target.value;")
				.then(function (target) {
					debugMsg("checkOnChange: onchange event target id");
					if (hasValue) {
						assert.strictEqual(target, sliderId, "onchange target id");
					} else {
						assert.strictEqual(target.length, 0, "unexpected change event received from [" + target + "]");
					}
				})
				.findById("onchange_target")
				.clearValue()
				.end()
				.then(function () {
					if (hasValue) {
						return remote.execute("return onchange_value.value")
							.then(function (value) {
								debugMsg("checkOnChange: onchange received?");
								assert.ok(value, "onchange value is expected");
							})
							.findById("onchange_value")
							.clearValue()
							.end()
							.then(function () {
								return remote.execute("return onchange_input.value;")
									.then(function (value) {
										debugMsg("checkOnChange: input.value?");
										assert.ok(value, "incorrect input value");
									})
									.findById("onchange_input")
									.clearValue()
									.end();
							});
					} else {
						debugMsg("checkOnChange: no value");
						return remote.end();
					}
				})
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function checkAria(remote, sliderId, className, ariaOrientation, ariaValueMin, ariaValueMax, ariaValueNow) {
		return function () {
			debugMsg("checkAria " + sliderId + "/" + className + "...");
			return getSliderElementByCss(remote, sliderId, className)
				.getAttribute("role")
				.then(function (value) {
					debugMsg("checkAria: role");
					assert.strictEqual(value, "slider", "role");
				})
				.getAttribute("aria-orientation")
				.then(function (value) {
					debugMsg("checkAria: aria-orientation");
					assert.strictEqual(value, ariaOrientation, "aria-orientation");
				})
				.getAttribute("aria-valuemin")
				.then(function (value) {
					debugMsg("checkAria: aria-valuemin");
					assert.strictEqual(value, ariaValueMin, "aria-valuemin");
				})
				.getAttribute("aria-valuemax")
				.then(function (value) {
					debugMsg("checkAria: aria-valuemax");
					assert.strictEqual(value, ariaValueMax, "aria-valuemax");
				})
				.getAttribute("aria-valuenow")
				.then(function (value) {
					debugMsg("checkAria: aria-valuenow");
					assert.strictEqual(value, ariaValueNow, "aria-valuenow");
				})
				.end();
		};
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
			.findByXpath("//d-slider[@id='" + sliderId + "']" +
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
			debugMsg("clickOnProgressBar...");
			return remote.findByCssSelector("#" + sliderId + " .d-slider-progress-bar")
				.then(function (element) {
					return remote.moveMouseTo(element, moveToX, moveToY);
				})
				.sleep(50)
				// 1. There is a pb with "change" event not fired after a click() on FF with selenium:
				// https://code.google.com/p/selenium/issues/detail?id=157
				// Slider does not listen on click events, so send mouseDown+Up to bypass FF problem.
				// 2. click() seems to click on the center of the element whatever the previous moveMouseTo(x,y)
				// on Chrome
				.pressMouseButton(0)
				.sleep(50)
				.releaseMouseButton(0)
				.end()
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function clickOnHandle(remote, sliderId) {
		return function () {
			debugMsg("clickOnHandle...");
			return remote.findByCssSelector("#" + sliderId + " .d-slider-handle-max")
				.then(function (element) {
					return remote.moveMouseTo(element);
				})
				// Simulate click with button down/up to bypass this issue:
				// "change" event is not fired when click() on FF with selenium
				// https://code.google.com/p/selenium/issues/detail?id=157
				.pressMouseButton()
				.releaseMouseButton()
				.end()
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function moveHandle(remote, sliderId, moveToX, moveToY) {
		return function () {
			debugMsg("moveHandle...");
			return remote.findByCssSelector("#" + sliderId + " .d-slider-handle-max")
				.then(function (element) {
					return remote.pressMouseButton()
						.moveMouseTo(element, moveToX, moveToY)
						.releaseMouseButton();
				})
				.end()
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function moveRange(remote, sliderId, moveToX, moveToY) {
		return function () {
			debugMsg("moveRange...");
			return remote.findByCssSelector("#" + sliderId + " .d-slider-progress-bar")
				.then(function (element) {
					return remote.moveMouseTo(element)
						.pressMouseButton()
						.moveMouseTo(element, moveToX, moveToY)
						.releaseMouseButton();
				})
				.end()
				.then(function () {
					return waitForDebug(remote);
				});
		};
	}

	function setSlideRange(remote, sliderId, enable) {
		return function () {
			debugMsg("setSlideRange...");
			return remote.execute("document.getElementById('" + sliderId + "').slideRange = " + String(enable) + ";");
		};
	}

	/**
	 * Load a new test page in the remote session
	 */
	function loadTestPage(remote, url) {
		return remote
			.get(require.toUrl(url))
			.then(pollUntil("return ('ready' in window && ready) ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.then(function () {
				debugMsg(url + " loaded.");
				return remote;
			});
	}

	function logMessage(remote, prefix, message) {
		return function () {
			console.log("[" + prefix + "] " + message);
			return remote;
		};
	}

	function waitForDebug(remote) {
		return debug ? remote.sleep(500) : remote;
	}
	
	function debugMsg(msg) {
		if (debug) {
			console.log(msg);
		}
	}
});
