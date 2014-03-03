define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/ProgressIndicator"
], function (registerSuite, assert, ProgressIndicator) {
	var progressIndicator = null,
		FRAME_DELAY = 50, //delay, in ms, to test for value changed in animation frame
		FRAME_TIMEOUT = FRAME_DELAY + 50;
	registerSuite({
		name: "ProgressIndicator",
		setup: function () {
			progressIndicator = new ProgressIndicator();
			document.body.appendChild(progressIndicator);
			progressIndicator.startup();
		},
		"Default values and state": function () {
			//public attribute:active
			assert.strictEqual(progressIndicator.active, false,
				"public attribute:active (default)");
			//public attribute:value
			assert(isNaN(progressIndicator.value),
				"public attribute:value (default)");
			//public attribute:speed
			assert.strictEqual(progressIndicator.speed, "normal",
				"public attribute:value (default)");
			//private attribute:_requestId
			assert.strictEqual(progressIndicator._requestId, 0,
				"private attribute:_requestId (default)");
			//private attribute:_lapsTime
			assert.strictEqual(progressIndicator._lapsTime, 1000,
				"private attribute:_lapsTime (default)");
			//style:visibility
			assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
				"hidden", "style:visibility (default)");
		},
		"Set NaN value while inactive": function () {
			progressIndicator.value = "not a number";
			assert.strictEqual(progressIndicator.value, "not a number");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should not start when not active
			}), FRAME_DELAY);
			return def;
		},
		"Set speed while inactive": function () {
			progressIndicator.speed = "fast";
			assert.strictEqual(progressIndicator.speed, "fast");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
				assert.strictEqual(progressIndicator._requestId, 0); //animation should not be started
			}), FRAME_DELAY);
			return def;
		},
		"Activate": function () {
			progressIndicator.active = true;
			assert.strictEqual(progressIndicator.active, true);
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.notStrictEqual(progressIndicator._requestId, 0); //animation should start
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set value while active and animated": function () {
			progressIndicator.value = 50;
			assert.strictEqual(progressIndicator.value, 50);
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should stop
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set slow speed": function () {
			progressIndicator.speed = "slow";
			assert.strictEqual(progressIndicator.speed, "slow");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 2000, "slow is 2000ms");
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set normal speed": function () {
			progressIndicator.speed = "normal";
			assert.strictEqual(progressIndicator.speed, "normal");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 1000, "normal is 1000ms");
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set fast speed": function () {
			progressIndicator.speed = "fast";
			assert.strictEqual(progressIndicator.speed, "fast");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set undefined speed": function () {
			progressIndicator.speed = "undefined";
			assert.strictEqual(progressIndicator.speed, "undefined");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 1000, "default is 1000ms (normal)");
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Start animation": function () {
			progressIndicator.value = NaN;
			assert(isNaN(progressIndicator.value));
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.notStrictEqual(progressIndicator._requestId, 0); //animation should be started
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Change speed while active/animated": function () {
			progressIndicator.speed = "fast";
			assert.strictEqual(progressIndicator.speed, "fast");
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
				assert.notStrictEqual(progressIndicator._requestId, 0); //animation should be started
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		"Deactivate while active/animated": function () {
			progressIndicator.active = false;
			assert.strictEqual(progressIndicator.active, false);
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"hidden");
			}), FRAME_DELAY);
			return def;
		},
		"Set value while inactive": function () {
			progressIndicator.value = 50;
			assert.strictEqual(progressIndicator.value, 50);
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should not be started
			}), FRAME_DELAY);
			return def;
		},
		"Activate with value set": function () {
			progressIndicator.active = true;
			assert.strictEqual(progressIndicator.active, true);
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should NOT start
				assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"),
					"visible");
			}), FRAME_DELAY);
			return def;
		},
		teardown: function () {
			progressIndicator.destroy();
			progressIndicator = null;
		}
	});
});