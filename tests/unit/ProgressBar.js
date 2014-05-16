define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/ProgressBar"
], function (registerSuite, assert, ProgressBar) {
	var progressBar = null,
		TEST_MSG = "test custom message"; //test message

	registerSuite({
		name: "ProgressBar",
		setup: function () {
			progressBar = new ProgressBar();
			progressBar.lang = "en-US";
			document.body.appendChild(progressBar);
			progressBar.startup();
			//progressBar.style.width = "250px";
		},
		"Default values and state": function () {
			//public attribute:value
			assert(isNaN(progressBar.value),
				"public attribute:value (default)");
			//public attribute:min
			assert.strictEqual(progressBar.min, 0,
				"public attribute:min (default)");
			//private attribute:max
			assert.strictEqual(progressBar.max, 100,
				"private attribute:max (default)");
			//private attribute:message
			assert.strictEqual(progressBar.message, "",
				"private attribute:message (default)");
			//private attribute:displayExtMsg
			assert.strictEqual(progressBar.displayExtMsg, false,
				"private attribute:displayExtMsg (default)");
			//aria role
			assert.strictEqual(progressBar.getAttribute("role"), "progressbar",
				"aria role:progressbar");
			//aria attributes
			checkAria(true);
			//CSS base class
			assert.ok(hasClass(progressBar, "d-progress-bar"));
			//indeterminate state
			checkIndeterminate();
		},
		"Set value in range": function () {
			var testVal = 50;
			progressBar.value = testVal;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(testVal);
			checkAria();
		},
		"Set value out of range (value < min)": function () {
			var testVal = -0.1;
			progressBar.value = testVal;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(testVal, true);
			checkAria();
		},
		"Set value out of range (value > max)": function () {
			var testVal = 100.1;
			progressBar.value = testVal;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(testVal, true);
			checkAria();
		},
		"Set min in range (min < value)": function () {
			progressBar.min = 10;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set min out of range (min > max)": function () {
			var testMin = progressBar.max + 1;
			try {
				progressBar.min = testMin;
			} catch (error) {
				checkError(
					error.toString(),
					"min (" + testMin + ") must be < max (" + progressBar.max + ")"
				);
			}
		},
		"Set min to NaN": function () {
			var testMin = NaN;
			try {
				progressBar.min = testMin;
			} catch (error) {
				checkError(
					error.toString(),
					"min (" + testMin + ") must be < max (" + progressBar.max + ")"
				);
			}
		},
		"Set max in range (max > value)": function () {
			progressBar.max = 90;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set max out of range (max < min)": function () {
			var testMax = progressBar.min - 1;
			try {
				progressBar.max = testMax;
			} catch (error) {
				checkError(
					error.toString(),
					"max (" + testMax + ") must be > min (" + progressBar.min + ")"
				);
			}
		},
		"Set max to NaN": function () {
			var testMax = NaN;
			try {
				progressBar.max = testMax;
			} catch (error) {
				checkError(
					error.toString(),
					"max (" + testMax + ") must be > min (" + progressBar.min + ")"
				);
			}
		},
		"Set indeterminate state (value = NaN)": function () {
			progressBar.value = NaN;
			progressBar.validate();
			checkIndeterminate();
			checkAria(true);
		},
		"Set custom message (indeterminate)": function () {
			progressBar.message = TEST_MSG;
			progressBar.validate();
			checkIndeterminate();
			checkMessage(TEST_MSG, true);
			checkAria(true);
		},
		"Set value (custom message)": function () {
			var testVal = 50;
			progressBar.value = testVal;
			progressBar.validate();
			checkDeterminate();
			checkMessage(TEST_MSG, false);
			checkPercentage(testVal);
			checkAria();
		},
		"Restore default message (determinate)": function () {
			var msg = "";
			progressBar.message = msg;
			progressBar.validate();
			checkDeterminate();
			checkMessage(msg, false);
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Override formatMessage": function () {
			var testVal = 50, message;
			progressBar.formatMessage = function (percent, value, max) {
				message = "percent: " + percent + " value: " + value + " max: " + max;
				return message;
			};
			progressBar.value = testVal;
			progressBar.validate();
			checkDeterminate();
			checkMessage(message, false);
			checkPercentage(testVal);
			checkAria();
		},
		"Set displayExtMsg (with value)": function () {
			var testVal = 50;
			progressBar.min = 0;
			progressBar.max = 100;
			progressBar.value = testVal;
			progressBar.displayExtMsg = true;
			progressBar.validate();
			checkDeterminate();
			checkPercentage(testVal);
			checkExtMsg();
			checkAria();
		},
		teardown: function () {
			progressBar.destroy();
			progressBar = null;
		}
	});

	//simple helper to test if an element contains a class
	function hasClass(element, className) {
		return (" " + element.className.replace(/\s{2,}/g, " ") + " ").indexOf(" " + className + " ") > -1;
	}

	//check aria attribute definitions and values
	function checkAria(indeterminate) {
		//min: always present
		assert.ok(progressBar.hasAttribute("aria-valuemin"));
		assert.equal(progressBar.getAttribute("aria-valuemin"), progressBar.min);
		//max: always present
		assert.ok(progressBar.hasAttribute("aria-valuemax"));
		assert.equal(progressBar.getAttribute("aria-valuemax"), progressBar.max);
		//value and message
		if (indeterminate) {
			//indeterminate: no aria-valuenow. aria-valuetext only if custom messsage set.
			assert.notOk(progressBar.hasAttribute("aria-valuenow"),
				"aria-valuenow not allowed when indeterminate");
			var msg = progressBar.msgNode.innerHTML;
			if (msg) {
				assert.ok(progressBar.hasAttribute("aria-valuetext"));
				assert.strictEqual(progressBar.getAttribute("aria-valuetext"), msg);
			} else {
				assert.notOk(progressBar.hasAttribute("aria-valuetext"),
					"aria-valuetext not allowed if  message to display is empty");
			}
		} else {
			//value: aria-valuenow, no aria-valuetext.
			assert.ok(progressBar.hasAttribute("aria-valuenow"));
			assert.equal(progressBar.getAttribute("aria-valuenow"), progressBar.value);
			assert.notOk(progressBar.hasAttribute("aria-valuetext"),
				"aria-valuetext not allowed when aria-valuenow is set");
		}
	}

	//check if percentage is ok regarding current value/min/max props.
	//set isOutOfRange to true is the value is < min or > max
	function checkPercentage(value, isOutOfRange) {
		if (isOutOfRange) {
			//correct value
			value = Math.min(Math.max(progressBar.min, value), progressBar.max);
		}
		var width = checkIndicatorNodeWidth(2);
		assert.strictEqual(width, computePercentage(value, 2),
			"computed width not equal to indicatorNode.style.width");
	}

	//check indicatorNode width is a percentage.
	//Returns the percentage value as a number (without the leading %).
	function checkIndicatorNodeWidth(fractionDigit) {
		var width = progressBar.indicatorNode.style.width;
		assert.isTrue(/%$/.test(width), "indicatorNode.style.width (" + width + ") should end with %");
		return Number(width.slice(0, -1)).toFixed(fractionDigit ? fractionDigit : 0);
	}

	//compute a percentage relative to the current min/max and returns a number
	function computePercentage(value, fractionDigit) {
		return ((value - progressBar.min) / (progressBar.max - progressBar.min) * 100)
			.toFixed(fractionDigit ? fractionDigit : 0);
	}

	//check indeterminate state artifacts
	function checkIndeterminate() {
		assert.ok(hasClass(progressBar, "d-progress-bar-indeterminate"));
		assert.notOk(progressBar.indicatorNode.style.width);
	}

	//check if NOT indeterminate
	function checkDeterminate() {
		assert.notOk(hasClass(progressBar, "d-progress-bar-indeterminate"));
		assert.ok(progressBar.indicatorNode.style.width);
	}

	//check message
	function checkMessage(message, isIndeterminate) {
		var msg = progressBar.msgNode.innerHTML;
		if (message) {
			//custom message: should be displayed as-is
			assert.strictEqual(msg, message,
				"msgNode: current [" + msg + "], expected [" + message + "]");
			msg = progressBar.msgInvertNode.innerHTML;
			assert.strictEqual(msg, message,
				"msgInvertNode: current [" + msg + "], expected [" + message + "]");
		} else {
			if (isIndeterminate) {
				//no message
				assert.notOk(msg,
					"msgNode: Indeterminate without custom message shouldn't display [" + msg + "]");
				msg = progressBar.msgInvertNode.innerHTML;
				assert.notOk(msg,
					"msgInvertNode: Indeterminate without custom message shouldn't display [" + msg + "]");
			} else {
				//no custom message: default message is the percentage of progression
				message = checkIndicatorNodeWidth(progressBar.fractionDigits) + "%";
				assert.strictEqual(msg, message,
					"msgNode: current [" + msg + "], expected [" + message + "]");
				msg = progressBar.msgInvertNode.innerHTML;
				assert.strictEqual(msg, message,
					"msgInvertNode: current [" + msg + "], expected [" + message + "]");
			}
		}
	}

	//check extra message
	function checkExtMsg(isIndeterminate) {
		if (isIndeterminate) {
			assert.notOk(hasClass(progressBar.msgNode, "d-progress-bar-msg-ext"),
				"checkExtMsg: d-progress-bar-msg-ext shouldn't be set when indeterminate");
			assert.notOk(progressBar.msgNode.hasAttribute("msg-ext"),
				"checkExtMsg: attribute msg-ext should not be set on msgNode when indeterminate");
		} else {
			assert.ok(hasClass(progressBar.msgNode, "d-progress-bar-msg-ext"),
				"checkExtMsg: d-progress-bar-msg-ext should be set");
			assert.ok(progressBar.msgNode.hasAttribute("msg-ext"),
				"checkExtMsg: attribute msg-ext must be set on msgNode");
			//todo:check default value?
		}
	}

	//check if error ends with  the expected message
	function checkError(error, expectedMessage) {
		if (expectedMessage) {
			assert.isTrue(error.indexOf(expectedMessage) !== -1,
				"Expected error message: [" + expectedMessage + "] not found in [" + error + "]");
		} else {
			assert.isNull(error, "Unexpected error: [" + error + "]");
		}
	}

});