define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/ProgressIndicator"
], function (registerSuite, assert, ProgressIndicator) {
	var progressIndicator = null,
		FRAME_DELAY = 150, //delay, in ms, to test for value changed in animation frame
		FRAME_TIMEOUT = FRAME_DELAY + 50;

	//check progressIndicator node visibility style value.
	function checkVisibility(visibility, msg) {
		assert.strictEqual(window.getComputedStyle(progressIndicator).getPropertyValue("visibility"), visibility, msg);
	}

	registerSuite({
		name: "ProgressIndicator",
		setup: function () {
			progressIndicator = new ProgressIndicator();
			progressIndicator.placeAt(document.body);
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
			checkVisibility("hidden", "style:visibility (default)");
		},
		"Set value=NaN while inactive": function () {
			progressIndicator.value = "not a number";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator._requestId, 0); //animation should not start when not active
			checkVisibility("hidden", "must be hidden");
		},
		"Set speed while inactive": function () {
			progressIndicator.speed = "fast";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
			assert.strictEqual(progressIndicator._requestId, 0); //animation should not start when not active
			checkVisibility("hidden", "must be hidden");
		},
		"Set active": function () {
			progressIndicator.active = true;
			progressIndicator.deliver();
			assert.notStrictEqual(progressIndicator._requestId, 0); //animation must start
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set active while already active": function () {
			progressIndicator.active = true;
			progressIndicator.deliver();
			assert.notStrictEqual(progressIndicator._requestId, 0); //animation must start
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set value while active and animated": function () {
			progressIndicator.value = 50;
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator._requestId, 0); //animation must stop
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set slow speed": function () {
			progressIndicator.speed = "slow";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.speed, "slow");
			assert.strictEqual(progressIndicator._lapsTime, 2000, "slow is 2000ms");
			assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set normal speed": function () {
			progressIndicator.speed = "normal";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.speed, "normal");
			assert.strictEqual(progressIndicator._lapsTime, 1000, "normal is 1000ms");
			assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set fast speed": function () {
			progressIndicator.speed = "fast";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.speed, "fast");
			assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
			assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Set undefined speed": function () {
			progressIndicator.speed = "undefined";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.speed, "undefined");
			assert.strictEqual(progressIndicator._lapsTime, 1000, "default is 1000ms (normal)");
			assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Start animation": function () {
			progressIndicator.value = NaN;
			progressIndicator.deliver();
			assert(isNaN(progressIndicator.value));
			assert.notStrictEqual(progressIndicator._requestId, 0); //animation should be started
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Change speed while active/animated": function () {
			progressIndicator.speed = "fast";
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.speed, "fast");
			assert.strictEqual(progressIndicator._lapsTime, 500, "fast is 500ms");
			assert.notStrictEqual(progressIndicator._requestId, 0); //animation should be started
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "must be visible");
			}), FRAME_DELAY);
			return def;
		},
		"Deactivate while active/animated": function () {
			progressIndicator.active = false;
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.active, false);
			assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("hidden", "must be hidden");
			}), FRAME_DELAY);
			return def;
		},
		"Set value while inactive": function () {
			progressIndicator.value = 50;
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.value, 50);
			assert.strictEqual(progressIndicator._requestId, 0); //animation should not be started
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("hidden", "must be hidden");
			}), FRAME_DELAY);
			return def;
		},
		"Activate with value set": function () {
			progressIndicator.active = true;
			progressIndicator.deliver();
			assert.strictEqual(progressIndicator.active, true);
			assert.strictEqual(progressIndicator._requestId, 0); //animation should NOT start
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				checkVisibility("visible", "visible");
			}), FRAME_DELAY);
			return def;
		},
		"Start animation and destroy": function () {
			progressIndicator.value = NaN;
			progressIndicator.deliver();
			assert(isNaN(progressIndicator.value));
			assert.notStrictEqual(progressIndicator._requestId, 0); //animation should be started
			progressIndicator.destroy();
			var def = this.async(FRAME_TIMEOUT);
			setTimeout(def.callback(function () {
				assert.strictEqual(progressIndicator._requestId, 0); //animation should be stopped
			}), FRAME_DELAY);
			return def;
		},
		teardown: function () {
			progressIndicator = null;
		}
	});
});
