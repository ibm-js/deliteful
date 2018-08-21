define([
	"require",
	"intern",
	"intern!object",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"intern/dojo/node!leadfoot/helpers/pollUntil"
], function (require, intern, registerSuite, assert, keys, pollUntil) {

	// Functional tests for BoilerplateTextbox.
	// Unfortunately webdriver's imperfect keystroke simulation doesn't work well with BoilerplateTextBox's
	// synthetic handling of keyboard event, except on IE, so I had to instead manually emit synthetic keyboard
	// events.

	registerSuite({
		name: "BoilerplateTextbox functional tests",

		setup: function () {
			return this.remote
				.get(require.toUrl("./BoilerplateTextbox.html"))
				.then(pollUntil("return ready || null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		afterEach: function () {
			return this.remote
				.findById("reset").click().end()		// set BoilerplateTextboxes to original values
				.execute("resetToOriginalValues();")	// hmm, above doesn't do anything, at least on chrome
				.findById("pi").click().end();			// focus on <input> before BoilerplateTextboxes
		},

		"initial conditions": function () {
			return this.remote
				.execute("return document.querySelector('[name=date1]').value;").then(function (value) {
					assert.strictEqual(value, "", "dt1 initial value");
				})
				.execute("return document.querySelector('[name=date2]').value;").then(function (value) {
					assert.strictEqual(value, "07/04/2008", "dt2 initial value");
				})
				.execute("return document.querySelector('#dt1 .d-input-container-node')" +
					".getAttribute('aria-labelledby');").then(function (value) {
					assert.strictEqual(value, "dt1-label", "aria-labelledby set on (direct) parent of <input> nodes");
				});
		},

		basic: function () {
			return this.remote
				.findByCssSelector("#dt1 .d-input-container-node input").click().end()
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "mm/dd/yyyy",
						focused: "month d-btb-field"
					}, "mm selected");
				})
				.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "01/dd/yyyy",
						focused: "month d-btb-field"
					}, "mm selected, 1 typed");
				})
				.execute("dt1.emit('keydown', {key: '2'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "12/dd/yyyy",
						focused: "day d-btb-field"
					}, "focus automatically moves to next field");
				})
				.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '3'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "12/03/yyyy",
						focused: "year d-btb-field"
					}, "03 typed");
				})
				.execute("return document.querySelector('[name=date1]').value;").then(function (value) {
					assert.strictEqual(value, "", "only partial input so no hidden value yet");
				}).end()
				.execute("dt1.emit('keydown', {key: '2'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '7'}, document.activeElement);")
				.execute("return document.querySelector('[name=date1]').value;").then(function (value) {
					assert.strictEqual(value, "12/03/2017", "hidden value finally set");
				})
				.execute("return document.activeElement.parentNode.className;").then(function (name) {
					assert.strictEqual(name, "year d-btb-field", "focus still on dt1");
				});
		},

		"tab into and out of element": function () {
			if (this.remote.environmentType.brokenSendKeys || !this.remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			return this.remote
				.findById("pi").click().end()
				.execute("return document.getElementById('dt1-change-events').value;").then(function (count) {
					assert.strictEqual(count, "0", "no change events to start");
				})
				.pressKeys(keys.TAB)
				.execute("return document.activeElement.id;").then(function (id) {
					assert.strictEqual(id, "dt1-input", "tab into dt1");
				})
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "mm/dd/yyyy",
						focused: "month d-btb-field"
					}, "mm selected");
				})
				.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
				.pressKeys(keys.TAB)
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "01/dd/yyyy",
						focused: "day d-btb-field"
					}, "dd selected");
				})
				.execute("dt1.emit('keydown', {key: '2'}, document.activeElement);")
				.pressKeys(keys.TAB)
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "01/02/yyyy",
						focused: "year d-btb-field"
					}, "yyyy selected");
				})
				.execute("dt1.emit('keydown', {key: '3'}, document.activeElement);")
				.execute("return document.getElementById('dt1-change-events').value;").then(function (count) {
					assert.strictEqual(count, "0", "no change events until blur");
				})
				.pressKeys(keys.TAB)
				.execute("return document.activeElement.id;").then(function (id) {
					assert.strictEqual(id, "dt2-input", "tab out of dt1");
				})
				.execute("return document.getElementById('dt1-change-events').value;").then(function (count) {
					assert.strictEqual(count, "1", "one change event on blur");
				});
		},

		"shift tab to previous element": function () {
			if (this.remote.environmentType.brokenSendKeys || !this.remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			if (this.remote.environmentType.browserName === "internet explorer") {
				return this.skip("shift-tab keydown event broken for IE webdriver, evt.shiftKey not set");
			}

			return this.remote
				.findById("tt1-input").click().end()
				.pressKeys(keys.SHIFT + keys.TAB)
				.pressKeys(keys.SHIFT)		// release shift key
				.execute("return document.activeElement.id;").then(function (id) {
					assert.strictEqual(id, "dt2-input", "shift-tab from first field moves to previous element");
				});
		},

		backspace: function () {
			return this.remote
				.findById("dt2-input").click().end()
				.execute("return state(dt2);").then(function (v) {
					assert.deepEqual(v, {
						value: "07/04/2008",
						displayed: "07/04/2008",
						focused: "month d-btb-field"
					}, "month selected");
				})
				.execute("dt2.emit('keydown', {key: 'Backspace'}, document.activeElement);")
				.execute("return state(dt2);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "mm/04/2008",
						focused: "month d-btb-field"
					}, "month cleared");
				})
				.execute("dt2.emit('keydown', {key: '1'}, document.activeElement);")
				.execute("return state(dt2);").then(function (v) {
					assert.deepEqual(v, {
						value: "01/04/2008",
						displayed: "01/04/2008",
						focused: "month d-btb-field"
					}, "month partially typed");
				})
				.execute("dt2.emit('keydown', {key: 'Backspace'}, document.activeElement);")
				.execute("return state(dt2);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "mm/04/2008",
						focused: "month d-btb-field"
					}, "month cleared again");
				});
		},

		clicking: {
			"click on year": function () {
				return this.remote
					.findByCssSelector("#dt1 .d-btb-field:last-child").click().end()
					.sleep(10)
					.execute("return state(dt1);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "mm/dd/yyyy",
							focused: "month d-btb-field"
						}, "clicked on year but month was selected because it's the initial click on the widget");
					})
					.findByCssSelector("#dt1 .d-btb-field:last-child").click().end()
					.execute("return state(dt1);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "mm/dd/yyyy",
							focused: "year d-btb-field"
						}, "second click on year goes to year");
					});
			},

			"click on slash": function () {
				if (this.remote.environmentType.platformName === "iOS") {
					return this.skip("doesn't work on mobile, I guess you can't programatically shift focus?");
				}
				return this.remote
					.findByCssSelector("#dt2 d-btb-boilerplate").click().end()
					.execute("return state(dt2);").then(function (v) {
						assert.deepEqual(v, {
							value: "07/04/2008",
							displayed: "07/04/2008",
							focused: "month d-btb-field"
						}, "clicked on slash but month was selected because it's the initial click on the widget");
					});
			}
		},

		max: function () {
			return this.remote
				.findByCssSelector("#dt1 .d-input-container-node input").click().end()
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "mm/dd/yyyy",
						focused: "month d-btb-field"
					}, "mm selected");
				})
				.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "01/dd/yyyy",
						focused: "month d-btb-field"
					}, "mm selected, 1 typed");
				})
				.execute("dt1.emit('keydown', {key: '5'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "01/dd/yyyy",
						focused: "month d-btb-field"
					}, "15 disallowed for month since max is 12, value stays at 1");
				})
				.execute("dt1.emit('keydown', {key: '2'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "12/dd/yyyy",
						focused: "day d-btb-field"
					}, "month entered as 12, focus moved to day");
				})
				.execute("dt1.emit('keydown', {key: '4'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "",
						displayed: "12/04/yyyy",
						focused: "year d-btb-field"
					}, "typing 4 for day automatically advances to year, since 40 > 31");
				})
				.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '2'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '3'}, document.activeElement);")
				.execute("dt1.emit('keydown', {key: '4'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "12/04/1234",
						displayed: "12/04/1234",
						focused: "year d-btb-field"
					}, "typed in max digits for year");
				})
				.execute("dt1.emit('keydown', {key: '5'}, document.activeElement);")
				.execute("return state(dt1);").then(function (v) {
					assert.deepEqual(v, {
						value: "12/04/1234",
						displayed: "12/04/1234",
						focused: "year d-btb-field"
					}, "typing another digit has no effect");
				});
		},

		min: {
			"12 hour clock": function () {
				return this.remote
					.findByCssSelector("#tt1 .d-input-container-node input").click().end()
					.execute("return state(tt1);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "hh:mm am",
							focused: "hour d-btb-field"
						}, "hour selected");
					})
					.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
					.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
					.execute("return state(tt1);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "00:mm am",
							focused: "hour d-btb-field"
						}, "since min hour is 1, typing 00 doesn't advance to next field");
					})
					.execute("dt1.emit('keydown', {key: '1'}, document.activeElement);")
					.execute("return state(tt1);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "01:mm am",
							focused: "minute d-btb-field"
						}, "advanced to minutes");
					});
			},

			"24 hour clock": function () {
				return this.remote
					.findByCssSelector("#tt2 .d-input-container-node input").click().end()
					.execute("return state(tt2);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "hh:mm",
							focused: "hour d-btb-field"
						}, "hour selected");
					})
					.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
					.execute("dt1.emit('keydown', {key: '0'}, document.activeElement);")
					.execute("return state(tt2);").then(function (v) {
						assert.deepEqual(v, {
							value: "",
							displayed: "00:mm",
							focused: "minute d-btb-field"
						}, "24 hour clock so 0 for hour is OK");
					});
			}
		}
	});
});
