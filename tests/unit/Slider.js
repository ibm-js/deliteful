define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/Slider"
], function (registerSuite, assert, Slider) {
	var msgPrefix = "";
	/**
	 * +-------------------------------+
	 * |                 D             |
	 * | C [===B=====(A)============]  |
	 * |                               |
	 * +-------------------------------+
	 */
	registerSuite({
		name: "Single Slider",
		"Default values": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			checkSliderProperties(slider, 0, 100, 1, false, false, "50");
			destroySlider(slider);
		},
		"Updating min in bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.min = 20;
			slider.validate();
			checkSliderProperties(slider, 20, 100, 1, false, false, "50");
			destroySlider(slider);
		},
		"Updating min out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.min = 60;
			slider.validate();
			checkSliderProperties(slider, 60, 100, 1, false, false, "60");
			destroySlider(slider);
		},
		"Updating max in bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.max = 80;
			slider.validate();
			checkSliderProperties(slider, 0, 80, 1, false, false, "50");
			destroySlider(slider);
		},
		"Updating max out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.max = 40;
			slider.validate();
			checkSliderProperties(slider, 0, 40, 1, false, false, "40");
			destroySlider(slider);
		},
		"Step mismatch": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = 50.1;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "50");
			slider.value = 50.5;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "51");
			slider.step = 20;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 20, false, false, "60");
			slider.value = 90;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 20, false, false, "100");
			destroySlider(slider);
		},
		"Value in bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = 20;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "20");
			slider.value = 90;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "90");
			destroySlider(slider);
		},
		"Value out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = -10;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0");
			slider.value = 110;
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "100");
			destroySlider(slider);
		}
	});

	registerSuite({
		name: "Dual Slider",
		"Default values": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			checkSliderProperties(slider, 0, 100, 1, false, false, "25,75");
			destroySlider(slider);
		},
		"Updating min in bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.min = 20;
			slider.validate();
			checkSliderProperties(slider, 20, 100, 1, false, false, "25,75");
			destroySlider(slider);
		},
		"Updating min out of bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.min = 50;
			slider.validate();
			checkSliderProperties(slider, 50, 100, 1, false, false, "50,75");
			destroySlider(slider);
		},
		"Updating max in bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.max = 80;
			slider.validate();
			checkSliderProperties(slider, 0, 80, 1, false, false, "25,75");
			destroySlider(slider);
		},
		"Updating max out of bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.max = 60;
			slider.validate();
			checkSliderProperties(slider, 0, 60, 1, false, false, "25,60");
			destroySlider(slider);
		},
		"Step mismatch": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.step = 20;
			slider.value = "50,70";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 20, false, false, "60,80");
			slider.value = "10,90";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 20, false, false, "20,100");
			destroySlider(slider);
		},
		"Value in bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.value = "10,30";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "10,30");
			slider.value = "60,90";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "60,90");
			destroySlider(slider);
		},
		"Value out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = "-10,20";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,20");
			slider.value = "-10,-5";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,0");
			slider.value = "80,110";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "80,100");
			slider.value = "110,150";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "100,100");
			destroySlider(slider);
		},
		"Inverted values": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = "75,25";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "25,75");
			slider.value = "110,50";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "50,100");
			slider.value = "50,-10";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,50");
			slider.value = "110,-10";
			slider.validate();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,100");
			destroySlider(slider);
		}
	});

	function createSingleSlider() {
		var slider = new Slider();
		document.body.appendChild(slider);
		slider.startup();
		return slider;
	}
	function createDualSlider() {
		var slider = new Slider({value: ","});
		document.body.appendChild(slider);
		slider.startup();
		return slider;
	}

	function destroySlider(slider) {
		slider.destroy();
		slider = null;
	}

	function assertMessage(message) {
		return "[" + msgPrefix + "] " + message;
	}

	function checkSliderProperties(slider, min, max, step, flip, vertical, value) {
		//public attribute:min
		assert.strictEqual(slider.min, min, assertMessage("min"));
		//public attribute:max
		assert.strictEqual(slider.max, max, assertMessage("max"));
		//public attribute:step
		assert.strictEqual(slider.step, step, assertMessage("step"));
		//public attribute:flip
		assert.strictEqual(slider.flip, flip, assertMessage("flip"));
		//public attribute:vertical
		assert.strictEqual(slider.vertical, vertical, assertMessage("vertical"));
		//value
		assert.equal(slider.value, value, assertMessage("value"));
		//input value
		assert.equal(slider.value, slider.querySelector("input").value, assertMessage("input value"));
	}

	/*
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
	 */

});