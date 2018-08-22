define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/Slider"
], function (registerSuite, assert, Slider) {
	var msgPrefix = "";

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
			slider.deliver();
			checkSliderProperties(slider, 20, 100, 1, false, false, "50");
			destroySlider(slider);
		},
		"Updating min out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.min = 60;
			slider.deliver();
			checkSliderProperties(slider, 60, 100, 1, false, false, "60");
			destroySlider(slider);
		},
		"Updating max in bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.max = 80;
			slider.deliver();
			checkSliderProperties(slider, 0, 80, 1, false, false, "50");
			destroySlider(slider);
		},
		"Updating max out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.max = 40;
			slider.deliver();
			checkSliderProperties(slider, 0, 40, 1, false, false, "40");
			destroySlider(slider);
		},
		"Step mismatch": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = 50.1;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "50");
			slider.value = 50.5;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "51");
			slider.step = 20;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 20, false, false, "60");
			slider.value = 90;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 20, false, false, "100");
			destroySlider(slider);
		},
		"Value in bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = 20;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "20");
			slider.value = 90;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "90");
			destroySlider(slider);
		},
		"Value out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = -10;
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0");
			slider.value = 110;
			slider.deliver();
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
			slider.deliver();
			checkSliderProperties(slider, 20, 100, 1, false, false, "25,75");
			destroySlider(slider);
		},
		"Updating min out of bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.min = 50;
			slider.deliver();
			checkSliderProperties(slider, 50, 100, 1, false, false, "50,75");
			destroySlider(slider);
		},
		"Updating max in bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.max = 80;
			slider.deliver();
			checkSliderProperties(slider, 0, 80, 1, false, false, "25,75");
			destroySlider(slider);
		},
		"Updating max out of bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.max = 60;
			slider.deliver();
			checkSliderProperties(slider, 0, 60, 1, false, false, "25,60");
			destroySlider(slider);
		},
		"Step mismatch": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.step = 20;
			slider.value = "50,70";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 20, false, false, "60,80");
			slider.value = "10,90";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 20, false, false, "20,100");
			destroySlider(slider);
		},
		"Value in bound": function () {
			msgPrefix = this.id;
			var slider = createDualSlider();
			slider.value = "10,30";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "10,30");
			slider.value = "60,90";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "60,90");
			destroySlider(slider);
		},
		"Value out of bound": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = "-10,20";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,20");
			slider.value = "-10,-5";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,0");
			slider.value = "80,110";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "80,100");
			slider.value = "110,150";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "100,100");
			destroySlider(slider);
		},
		"Inverted values": function () {
			msgPrefix = this.id;
			var slider = createSingleSlider();
			slider.value = "75,25";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "25,75");
			slider.value = "110,50";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "50,100");
			slider.value = "50,-10";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,50");
			slider.value = "110,-10";
			slider.deliver();
			checkSliderProperties(slider, 0, 100, 1, false, false, "0,100");
			destroySlider(slider);
		},
		"Switch from single to dual": function () {
			var slider = new Slider({}).placeAt(document.body);
			slider.value = "25,75";
			slider.deliver();
			assert.strictEqual(slider.handleMin.className, "", "second handle not d-hidden");
			checkSliderProperties(slider, 0, 100, 1, false, false, "25,75");
			destroySlider(slider);
		}
	});

	function createSingleSlider() {
		var slider = new Slider();
		slider.placeAt(document.body);
		return slider;
	}
	function createDualSlider() {
		var slider = new Slider({value: ","});
		slider.placeAt(document.body);
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
		// public attribute:min
		assert.strictEqual(slider.min, min, assertMessage("min"));
		// public attribute:max
		assert.strictEqual(slider.max, max, assertMessage("max"));
		// public attribute:step
		assert.strictEqual(slider.step, step, assertMessage("step"));
		// public attribute:flip
		assert.strictEqual(slider.flip, flip, assertMessage("flip"));
		// public attribute:vertical
		assert.strictEqual(slider.vertical, vertical, assertMessage("vertical"));
		// value
		assert.strictEqual(slider.value, value, assertMessage("value"));
		// input value
		assert.strictEqual(slider.value, slider.querySelector("input").value, assertMessage("input value"));
	}
});
