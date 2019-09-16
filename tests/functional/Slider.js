define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = require("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var debug = false; // set to true for additional feedback on test execution (adds console messages + wait time).

	registerSuite("Slider (markup)", {
		// single
		"init single slider (default value)": function () {
			var remote = this.remote;
			return loadFile(remote, "slider/slider.html")
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
		}
	});

	registerSuite("Slider (programmatic)", {
		"init single slider (default value)": function () {
			var remote = this.remote;
			return loadFile(remote, "slider/slider-prg.html")
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

	function checkOnChange(remote, sliderId, hasValue, hint) {
		return function () {
			debugMsg("checkOnChange...");
			var prefix = hint ? hint + ": " : "";
			return remote.execute("return onchange_target.value;")
				.then(function (target) {
					debugMsg("checkOnChange: onchange event target id");
					if (hasValue) {
						assert.strictEqual(target, sliderId, prefix + "onchange target id");
					} else {
						assert.strictEqual(target.length, 0,
							prefix + "unexpected change event received from [" + target + "]");
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
								assert.ok(value, prefix + "onchange value is expected");
							})
							.findById("onchange_value")
							.clearValue()
							.end()
							.then(function () {
								return remote.execute("return onchange_input.value;")
									.then(function (value) {
										debugMsg("checkOnChange: input.value?");
										assert.ok(value, prefix + "incorrect input value");
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
	 * Load a new test page in the remote session
	 */
	function loadFile(remote, fileName) {
		return remote
			.get(require.toUrl("deliteful/tests/functional/" + fileName))
			.then(pollUntil("return ('ready' in window && ready) ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.then(function () {
				debugMsg(fileName + " loaded.");
				return remote;
			});
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
