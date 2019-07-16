define(function (require) {
	"use strict";

	var intern = require("intern");
	var registerSuite = require("intern!object");
	var pollUntil = require("intern/dojo/node!leadfoot/helpers/pollUntil");
	var assert = require("intern/chai!assert");
	var keys = require("intern/dojo/node!leadfoot/keys");
	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.setWindowSize(600, 1000)
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};

	function checkComboState (comboId, comboState, expectedComboState, stepName) {
		// comboState is an object retrieved from the browser, containing the state of the ComboPopup.

		var msg =  comboId + " " + "(" + comboState.selectionMode + ")" + " " + stepName + " ";
		for (var propName in expectedComboState) {
			var expectedValue = expectedComboState[propName];
			var actualValue = comboState[propName];
			if (actualValue === null) {
				// Except for Safari, for a variable which is undefined in the browser,
				// remote.execute() returns a null value, not undefined.  Hence,
				// since in the tested page the variables that store widget.value
				// and widget.valueNode.value at the latest input/change moment the valueCombobox-decl.html
				actualValue = undefined;
			}
			if (Array.isArray(expectedValue)) {
				assert.deepEqual(actualValue, expectedValue, msg + propName);
			} else {
				assert.strictEqual(actualValue, expectedValue, msg + propName);
			}
		}

		// Note that the event counters count the new events since the previous check.
	}

	var checkFilter = function (remote, comboId) {
		var executeExpr = "return getComboPopupState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-mobile.html")
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				// No item should be selected, the popup is closed initially.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France"
				}, "right after load");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr) // when the popup opens, focus goes on list's first item.
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					widgetValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.findByCssSelector(".d-combo-popup .d-combobox-input[d-shown='true']")
			.pressKeys(keys.BACKSPACE) // Delete the 6 chars of "France"
			.sleep(100)
			.pressKeys(keys.BACKSPACE)
			.sleep(100)
			.pressKeys(keys.BACKSPACE)
			.sleep(100)
			.pressKeys(keys.BACKSPACE)
			.sleep(100)
			.pressKeys(keys.BACKSPACE)
			.sleep(100)
			.pressKeys(keys.BACKSPACE)
			.sleep(100)
			.type("j")
			.type("a")
			.type("p")
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "jap",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30,
					inputEventCounter: 1, // removed "france" and typed "jap"
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined
				}, "after searching `jap` into input field.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 3 chars of "Japan"
			.sleep(250)
			.pressKeys(keys.BACKSPACE)
			.sleep(250)
			.pressKeys(keys.BACKSPACE)
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined
				}, "after deleting the filter.");
			})
			.type("u")
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "u",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 2, // USA & UK
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined
				}, "after typed `u` into input field.");
			})
			.end();
	};

	var checkListInPopup = function (remote, comboId, hasFilterInput, isMultiSelect) {
		return loadFile(remote, "./Combobox-mobile.html")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()
			.sleep(500) // wait for List's loading panel to go away

			// Make sure Dialog's header matches the label of the original Combobox.
			.findByCssSelector("#" + comboId + "_dropdown .d-tooltip-dialog-label")
			.getVisibleText().then(function (popupLabel) {
				return remote.findByCssSelector("label[for=" + comboId + "-input]")
					.getVisibleText().then(function (comboLabel) {
						assert.strictEqual(popupLabel.trim(), comboLabel.trim(), "expected label");
					}).end();
			}).end()

			.findByCssSelector("#" + comboId + "_dropdown input").getAttribute("aria-controls").then(function (listId) {
				// Use aria-owns attribute to find the <d-list>, and then spot check that the <d-list>
				// contents are correct.
				return remote.findByCssSelector("#" + listId + " d-list-item-renderer:nth-child(2)")
					.getVisibleText().then(function (value) {
						// Spot check that the <d-list> contents are OK.
						assert.match(value.trim(), /^France/, "item renderer #1");
					}).end();
			}).end()

			.findByCssSelector(".d-combo-popup .d-combobox-input[d-shown='" + hasFilterInput + "']")
			.end()
			.findByCssSelector(".d-combo-popup .d-combo-popup-button-container[d-shown='" + isMultiSelect + "']")
			.end();
	};

	var checkSingleSelection = function (remote, comboId) {
		var executeExpr = "return getComboPopupState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-mobile.html")
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France"
				}, "before open");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					widgetValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.findByCssSelector("#" + comboId + "-list d-list-item-renderer:nth-of-type(2)").click().end() // "Germany"
			.sleep(500)
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany"
				}, "after clicking the third option (Germany)");
			});
	};

	var checkMultiSelection = function (remote, comboId) {
		var executeExpr = "return getComboPopupState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-mobile.html")
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					widgetValue: [],
					valueNodeValue: ""
				}, "before open");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					widgetValue: [],
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0, // no event so far
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					widgetValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.findByCssSelector("#" + comboId + "-list d-list-item-renderer:nth-of-type(2)").click().end() // "Germany"
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					widgetValue: ["Germany"],
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: ["Germany"],
					widgetValueAtLatestChangeEvent: undefined
				}, "after clicking option (Germany)");
			})
			.findByCssSelector("#" + comboId + "-list d-list-item-renderer:nth-of-type(7)").click().end() // "China"
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					widgetValue: ["China", "Germany"],
					selectedItemsCount: 2,
					itemRenderersCount: 37,
					inputEventCounter: 1,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: ["China", "Germany"],
					widgetValueAtLatestChangeEvent: undefined
				}, "after clicking option (China)");
			})
			.sleep(10)
			.findByCssSelector(".d-combo-ok-button").click().end()
			.sleep(500) // wait for the async closing of the popup
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, {
					inputNodeValue: "2 selected",
					widgetValue: ["China", "Germany"],
					valueNodeValue: "China,Germany"
				}, "after clicking OK button (close)");
			});
	};

	var checkAutoCompleteFilteringWithThreeFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboPopupState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-mobile.html")
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					valueNodeValue: ""
				}, "right after load");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(250)
			.execute(executeExpr) // when the popup opens, focus goes into the inputNode.
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					widgetValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.findByCssSelector("#" + comboId + "_dropdown")  // context for all following findByCssSelector() calls
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys("j")
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "j",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `j` - no query run yet.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='false']") // list not visible
			.then(function (list) {
				assert.isNotNull(list, "list should be invisible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys("a")
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "ja",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `a` (ja) - no query run yet.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='false']") // list not visible
			.then(function (list) {
				assert.isNotNull(list, "list should be invisible at this stage.");
			})
			.end()
			.pressKeys("p")
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "jap",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30, // showing only `jap` matching items.
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `jap` - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list should be visible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing one chars, list must disappear.
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "ja",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30, // showing only `jap` matching items.
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after deleting `p` from `jap` - query did not run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='false']") // list not visible
			.then(function (list) {
				assert.isNotNull(list, "list should be visible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing remaining two chars, list must disappear.
			.pressKeys(keys.BACKSPACE)
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30, // showing only `jap` matching items.
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after deleting `ja` from the inputNode - query did not run.");
			})
			.isDisplayed() // check if popup is still visible.
			.then(function (isVisible) {
				assert.isTrue(isVisible, "popup must be visible at this stage.");
			})
			.end();
	};

	var checkAutoCompleteFilteringWithZeroFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboPopupState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-mobile.html")
			.execute("return getComboboxState(\"" + comboId + "\");")
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					valueNodeValue: ""
				}, "right after load");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(250)
			.execute(executeExpr) // when the popup opens, focus goes to the inputNode.
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					widgetValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.findByCssSelector("#" + comboId + "_dropdown") // context for all following findByCssSelector() calls
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys("j")
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "j",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `j` - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #1");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys("a")
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "ja",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 30,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `a` (ja) - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #2");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing two chars, get full list
			.pressKeys(keys.BACKSPACE)
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after deleting `ja` from the inputNode - full list shown.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list should be visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #3");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys("g") // 'Germany' item visible
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "g",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 1, // showing only `g` matching items.
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after typing `g` from the inputNode - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #4.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-shown='true']") // inputNode
			.pressKeys(keys.BACKSPACE) // erase "g", list still visible
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined
				}, "after deleting `g` from the inputNode - query did not run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list still visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #5.");
			})
			.end()
			.isDisplayed() // check if popup is still visible.
			.then(function (isVisible) {
				assert.isTrue(isVisible, "popup must be visible at this stage.");
			})
			.end();
	};

	registerSuite({
		"name": "ComboPopup - functional",

		"setup": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				return this.skip("ComboPopup broken on IE");
			}
		},

		"button": function () {
			// Since clicking the Combobox opens the ComboPopup, the Combobox should be a button.
			return loadFile(this.remote, "./Combobox-mobile.html").execute(function () {
				return document.getElementById("combo2").inputNode.getAttribute("type");
			}).then(function (value) {
				assert.strictEqual(value, "button");
			});
		},

		"list in popup (combo1)": function () {
			return checkListInPopup(this.remote, "combo1", false, false);
		},

		"list in popup (combo2)": function () {
			return checkListInPopup(this.remote, "combo2", true, false);
		},

		"list in popup (combo3)": function () {
			return checkListInPopup(this.remote, "combo3", false, true);
		},

		"filtering (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			return checkFilter(remote, "combo2");
		},

		"single selection (combo1)": function () {
			return checkSingleSelection(this.remote, "combo1");
		},

		"close dialog via [x] icon": function () {
			var remote = this.remote;
			return loadFile(remote, "./Combobox-mobile.html")
				.findByCssSelector("#combo3 .d-combobox-input").click().end()
				.sleep(500) // wait for popup to appear
				.findByCssSelector("#combo3_dropdown .d-tooltip-dialog-close-icon").click().end()
				.findById("combo3_dropdown")
				.isDisplayed().then(function (displayed) {
					assert.isFalse(displayed, "clicking close icon hid popup");
				}).end();
		},

		"single selection (combo2)": function () {
			return checkSingleSelection(this.remote, "combo2");
		},

		"multi selection (combo3)": function () {
			return checkMultiSelection(this.remote, "combo3");
		},

		// TODO: merge this into checkAutoCompleteFilteringWithThreeFilterChars().
		"aria-expanded": function () {
			return loadFile(this.remote, "./Combobox-mobile.html")
				.findByCssSelector("#combo4 .d-combobox-input").click().end()
				.sleep(500) // wait for List's loading panel to go away
				.findByCssSelector("#combo4_dropdown [role=combobox]").getAttribute("aria-expanded")
				.then(function (value) {
					assert.strictEqual(value, "false", "initially not expanded");
				}).end()
				.findByCssSelector("#combo4_dropdown input").type("jap").end()
				.sleep(500)
				.findByCssSelector("#combo4_dropdown [role=combobox]").getAttribute("aria-expanded")
				.then(function (value) {
					assert.strictEqual(value, "true", "expanded after typing 3 chars");
				}).end();
		},

		"autocomplete filtering - minFilterChars = 3 (combo4)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.browserName === "safari" || remote.environmentType.brokenSendKeys ||
				!remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkAutoCompleteFilteringWithThreeFilterChars(remote, "combo4");
		},

		"autocomplete filtering - minFilterChars = 0 (combo5)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.browserName === "safari" || remote.environmentType.brokenSendKeys ||
				!remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkAutoCompleteFilteringWithZeroFilterChars(remote, "combo5");
		}
	});
});
