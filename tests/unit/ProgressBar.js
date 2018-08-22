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
			progressBar = new ProgressBar({lang: "en-US"});
			progressBar.placeAt(document.body);
		},
		"Default values and state": function () {
			//public attribute:value
			assert(isNaN(progressBar.value),
				"public attribute:value (default)");
			//private attribute:max
			assert.strictEqual(progressBar.max, 1.0,
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
			var testVal = 0.5;
			progressBar.value = testVal;
			progressBar.deliver();
			checkDeterminate();
			checkFractionDigits(progressBar.fractionDigits);
			checkPercentage(testVal);
			checkAria();
		},
		"Set value out of range (value < 0)": function () {
			var testVal = -0.1;
			progressBar.value = testVal;
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(testVal, true);
			checkAria();
		},
		"Set value out of range (value > max)": function () {
			var testVal = 100.1;
			progressBar.value = testVal;
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(testVal, true);
			checkAria();
		},
		"Set max in range (max > value)": function () {
			progressBar.value = 10;
			progressBar.max = 90;
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set max out of range (max < 0)": function () {
			progressBar.max = -10;
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set max to NaN": function () {
			progressBar.max = NaN;
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set indeterminate state (value = NaN)": function () {
			progressBar.value = NaN;
			progressBar.deliver();
			checkIndeterminate();
			checkAria(true);
		},
		"Set custom message (indeterminate)": function () {
			progressBar.message = TEST_MSG;
			progressBar.deliver();
			checkIndeterminate();
			checkMessage(TEST_MSG, true);
			checkAria(true);
		},
		"Set value (custom message)": function () {
			var testVal = 0.5;
			progressBar.value = testVal;
			progressBar.deliver();
			checkDeterminate();
			checkMessage(TEST_MSG, false);
			checkPercentage(testVal);
			checkAria();
		},
		"Restore default message (determinate)": function () {
			var msg = "";
			progressBar.message = msg;
			progressBar.deliver();
			checkDeterminate();
			checkMessage(msg, false);
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Set fraction digits": function () {
			var fractionDigits = 2;
			progressBar.fractionDigits = fractionDigits;
			progressBar.deliver();
			checkDeterminate();
			checkFractionDigits(fractionDigits);
			checkPercentage(progressBar.value);
			checkAria();
		},
		"Override formatMessage": function () {
			var testVal = 0.5, message;
			progressBar.formatMessage = function (percent, value, max) {
				message = "percent: " + percent + " value: " + value + " max: " + max;
				return message;
			};
			progressBar.value = testVal;
			progressBar.deliver();
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
			progressBar.deliver();
			checkDeterminate();
			checkPercentage(testVal);
			checkExtMsg();
			checkAria();
		},
		"valid init value": function () {
			var pb = new ProgressBar({value: 10, max: 100});
			pb.placeAt(document.body);
			assert.strictEqual(10, pb.value);
			assert.strictEqual(100, pb.max);
			pb.destroy();
		},
		"Invalid init value": function () {
			var pb = new ProgressBar({value: -10, max: -9});
			pb.placeAt(document.body);
			var value = pb.value, max = pb.max;
			assert.strictEqual(0, value);
			assert.strictEqual(1.0, max);
			pb.destroy();
		},
		teardown: function () {
			progressBar.destroy();
			progressBar = null;
		}
	});

	function removeWhiteSpaces(value) {
		return value.replace(/ /g, "");
	}

	function checkFractionDigits(value) {
		//check property
		assert.strictEqual(progressBar.fractionDigits, value);
		//check that displayed value actually enforces the fractionDigits property
		if (!isNaN(progressBar.value) && progressBar.message.length === 0) {
			//removes spaces to avoid false negative: IE11 formats with a space before the % sign
			var displayedValue = removeWhiteSpaces(progressBar.msgNode.innerHTML);
			var digits = displayedValue.split(".");
			assert.strictEqual((digits.length > 1) ? (digits[1].length - 1) : 0, progressBar.fractionDigits,
				"Displayed value [" + displayedValue + "] should enforce " +
					"fractionDigits [" + progressBar.fractionDigits + "]");
		}
	}

	//simple helper to test if an element contains a class
	function hasClass(element, className) {
		return (" " + element.className.replace(/\s{2,}/g, " ") + " ").indexOf(" " + className + " ") > -1;
	}

	//check aria attribute definitions and values
	function checkAria(indeterminate) {
		//min: always present
		assert.ok(progressBar.hasAttribute("aria-valuemin"));
		assert.strictEqual(progressBar.getAttribute("aria-valuemin"), "0");
		//max: always present
		assert.ok(progressBar.hasAttribute("aria-valuemax"));
		assert.strictEqual(progressBar.getAttribute("aria-valuemax"), progressBar.max.toString());
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
			assert.strictEqual(progressBar.getAttribute("aria-valuenow"), progressBar.value.toString());
			assert.notOk(progressBar.hasAttribute("aria-valuetext"),
				"aria-valuetext not allowed when aria-valuenow is set");
		}
	}

	//check if percentage is ok regarding current value/max props.
	//set isOutOfRange to true is the value is < 0 or > max
	function checkPercentage(value, isOutOfRange) {
		if (isOutOfRange) {
			//correct value
			value = Math.min(Math.max(0, value), progressBar.max);
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

	//compute a percentage relative to max and returns a number
	function computePercentage(value, fractionDigit) {
		return (value / progressBar.max  * 100)
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
				//removes spaces to avoid false negative: IE11 formats with a space before the % sign
				msg = removeWhiteSpaces(msg);
				assert.strictEqual(msg, message,
					"msgNode: current [" + msg + "], expected [" + message + "]");
				msg = removeWhiteSpaces(progressBar.msgInvertNode.innerHTML);
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

});
