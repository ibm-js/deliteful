define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var pollUntil = requirejs.nodeRequire("@theintern/leadfoot/helpers/pollUntil").default;
	var assert = intern.getPlugin("chai").assert;
	var keys = requirejs.nodeRequire("@theintern/leadfoot/keys").default;
	var string = require("dojo/string");

	function loadFile(remote, fileName) {
		return remote
			.get("deliteful/tests/functional/" + fileName)
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}

	function checkComboState(comboId, comboState, expectedComboState, stepName) {
		// comboState is an object retrieved from the browser, containing the state of the Combobox.

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

	// Check the state of the widget after selecting options using the keyboard.
	function checkKeyboardNavigationSingleSelection(remote, comboId, autoFilter) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		var res = loadFile(remote, "Combobox-decl.html")
			.execute(comboId + ".focus();  " + executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: false,
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0, // no event so far
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after initial focus");
			})
			.pressKeys(keys.ARROW_DOWN) // popup should open.
			.sleep(750)
			.execute(executeExpr)
			.then(function (comboState) {
				// the first ARROW_DOWN only opens the dropdown.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // no new event
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after first ARROW_DOWN");
				assert.match(comboState.activeDescendant, /^France/, "activeDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the second option (Germany) should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: "Germany",
					valueNodeValueAtLatestInputEvent: "Germany",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after second ARROW_DOWN");
				assert.match(comboState.activeDescendant, /^Germany/, "activeDescendant after second ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_UP)
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first option should be selected again
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: "France",
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after first ARROW_UP");
				assert.match(comboState.activeDescendant, /^France/, "activeDescendant after first ARROW_UP");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the second option should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: "Germany",
					valueNodeValueAtLatestInputEvent: "Germany",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after third ARROW_DOWN");
				assert.match(comboState.activeDescendant, /^Germany/, "activeDescendant after third ARROW_DOWN");
			})
			// Similar to native select, ESCAPE also closes and validates the popup
			.pressKeys(keys.ESCAPE)
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the second option should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany",
					opened: false,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 1, // incremented because validation by close popup
					widgetValueAtLatestInputEvent: "Germany",
					valueNodeValueAtLatestInputEvent: "Germany",
					widgetValueAtLatestChangeEvent: "Germany",
					valueNodeValueAtLatestChangeEvent: "Germany"
				}, "after ESCAPE");
			});

		// Additional tests for autoFilter=true
		if (autoFilter) {
			res = res
				.pressKeys(keys.ARROW_DOWN)
				.execute(executeExpr)
				.then(function (comboState) {
					// Just reopens the dropdown. No other state change.
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "Germany",
						widgetValue: "Germany",
						valueNodeValue: "Germany",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 37,
						inputEventCounter: 0, // unchanged
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: "Germany",
						valueNodeValueAtLatestInputEvent: "Germany",
						widgetValueAtLatestChangeEvent: "Germany",
						valueNodeValueAtLatestChangeEvent: "Germany"
					}, "after ARROW_DOWN following ESCAPE");
					assert.match(comboState.activeDescendant, /^Germany/,
						"activeDescendant after after ARROW_DOWN following ESCAPE");
				})
				.pressKeys(keys.BACKSPACE) // Delete the 7 chars of "Germany"
				.pressKeys(keys.BACKSPACE)
				.pressKeys(keys.BACKSPACE)
				.pressKeys(keys.BACKSPACE)
				.pressKeys(keys.BACKSPACE)
				.pressKeys(keys.BACKSPACE)
				.pressKeys(keys.BACKSPACE)
				.pressKeys("u") // filters all countries but UK and USA
				.execute(executeExpr)
				.then(function (comboState) {
					// Reopens the dropdown. No other state change, except the
					// input node now showing just the "u" character, and the list now
					// has only 2 item renderers (UK and USA).
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "u",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 2,
						inputEventCounter: 1,
						changeEventCounter: 0, // no commit yet.
						widgetValueAtLatestInputEvent: "",
						valueNodeValueAtLatestInputEvent: "",
						widgetValueAtLatestChangeEvent: "Germany",
						valueNodeValueAtLatestChangeEvent: "Germany"
					}, "after filter starting with u character");
				})
				.pressKeys(keys.SPACE) // now filtering string is "u " which doesn't match any country
				.execute(executeExpr)
				.then(function (comboState) {
					// Just reopens the dropdown. No other state change, except the
					// input node now showing just the "u" character, and the list now
					// has only 2 item renderers (UK and USA).
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "u ",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 0,
						inputEventCounter: 0,
						changeEventCounter: 0, // unchanged
						widgetValueAtLatestInputEvent: "",
						valueNodeValueAtLatestInputEvent: "",
						widgetValueAtLatestChangeEvent: "Germany",
						valueNodeValueAtLatestChangeEvent: "Germany"
					}, "after filter starting with u plus SPACE character");
				})
				.pressKeys(keys.BACKSPACE) // delete the SPACE, back to "u" filter
				.pressKeys(keys.ARROW_DOWN)
				.execute(executeExpr)
				.then(function (comboState) {
					// Now again just UK and USA are rendered.
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "UK",
						widgetValue: "UK",
						valueNodeValue: "UK",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 2, // UK and USA visible
						inputEventCounter: 1,
						changeEventCounter: 0, // unchanged
						widgetValueAtLatestInputEvent: "UK",
						valueNodeValueAtLatestInputEvent: "UK",
						widgetValueAtLatestChangeEvent: "Germany",
						valueNodeValueAtLatestChangeEvent: "Germany"
					}, "after ARROW_DOWN with filtered list");
					assert.match(comboState.activeDescendant, /^UK/,
						"activeDescendant after ARROW_DOWN with filtered list");
				})
				.pressKeys(keys.ENTER) // closes the popup and validates the changes
				.sleep(500) // wait for async closing
				.execute(executeExpr)
				.then(function (comboState) {
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "UK",
						widgetValue: "UK",
						valueNodeValue: "UK",
						opened: false,
						selectedItemsCount: 1,
						itemRenderersCount: 2, // UK and USA. The query was not reset yet.
						inputEventCounter: 0,
						changeEventCounter: 1, // incremented
						widgetValueAtLatestInputEvent: "UK",
						valueNodeValueAtLatestInputEvent: "UK",
						widgetValueAtLatestChangeEvent: "UK",
						valueNodeValueAtLatestChangeEvent: "UK"
					}, "after closing with ENTER the filtered list");
				});
		}

		return res;
	}

	// Check the state of the widget after selecting options using the keyboard.
	function checkKeyboardNavigationMultipleSelection(remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.execute(comboId + ".focus(); " + executeExpr)
			.then(function (comboState) {
				// In a multiple-select no option is selected initially
				// (holds for the widget's delite/Selection API just as for the
				// native select).
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: false,
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after initial focus");
			})
			.pressKeys(keys.ARROW_DOWN)
			.sleep(2000)
			.execute(executeExpr)
			.then(function (comboState) {
				// No option selected, the first ARROW_DOWN only opens the dropdown and focuses the first item.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after first ARROW_DOWN");
				assert.match(comboState.activeDescendant, /^France/, "activeDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.SPACE) // toggles selection state of the navigated item
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first item should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after first SPACE on France item");
			})
			.pressKeys(keys.SPACE) // toggles the navigated item back to unselected state
			.execute(executeExpr)
			.then(function (comboState) {
				// Now there should be no selection again
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: [],
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after second SPACE on France item");
			})
			.pressKeys(keys.SPACE) // toggles the navigated item back to selected state
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first item should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after third SPACE on France item");
			})
			.pressKeys(keys.ENTER) // closes the popup and validates the changes
			.sleep(1000) // wait for async closing
			.execute(executeExpr)
			.then(function (comboState) {
				// Now there should be no selection again
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: false,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 1, // incremented
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: ["France"],
					valueNodeValueAtLatestChangeEvent: "France"
				}, "after ENTER for closing");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// After closing the popup with ENTER, ARROW_DOWN only reopens it.
				// No state change, except the open state of the popup.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 0, // unchanged
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: ["France"],
					valueNodeValueAtLatestChangeEvent: "France"
				}, "after reopening with ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// Navigates to next item (Germany).
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 0, // unchanged
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: ["France"],
					valueNodeValueAtLatestChangeEvent: "France"
				}, "after second ARROW_DOWN after reopening");
				assert.match(comboState.activeDescendant, /^Germany/,
					"activeDescendant after second ARROW_DOWN after reopening");
			})
			.pressKeys(keys.SPACE) // toggles the navigated item (Germany) to selected state
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first item should be selected
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
					widgetValue: ["France", "Germany"],
					valueNodeValue: "France,Germany",
					opened: true,
					selectedItemsCount: 2,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // unchanged till validation by close popup
					widgetValueAtLatestInputEvent: ["France", "Germany"],
					valueNodeValueAtLatestInputEvent: "France,Germany",
					widgetValueAtLatestChangeEvent: ["France"],
					valueNodeValueAtLatestChangeEvent: "France"
				}, "after SPACE on Germany after reopening");
			})
			// For consistency with single selection mode, ESCAPE also closes the
			// popup and validates the changes
			.pressKeys(keys.ESCAPE)
			.sleep(500) // wait for async closing
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the selected items are Germany and France
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
					widgetValue: ["France", "Germany"],
					valueNodeValue: "France,Germany",
					opened: false,
					selectedItemsCount: 2,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 1, // incremented
					widgetValueAtLatestInputEvent: ["France", "Germany"],
					valueNodeValueAtLatestInputEvent: "France,Germany",
					widgetValueAtLatestChangeEvent: ["France", "Germany"],
					valueNodeValueAtLatestChangeEvent: "France,Germany"
				}, "after ESCAPE");
			});
	}

	// Check the state of the widget after selecting options using the mouse (clicks).
	function checkMouseNavigationSingleSelection(remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.findById(comboId)
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the popup is closed initially
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: false,
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0, // no event so far
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "right after load");
			})
			.end()
			.findByCssSelector("#" + comboId + " .d-combobox-arrow")
			.click()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the first click just opens the dropdown.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.end()
			// For some reason, using remote.click() for a category leads to this error
			// (at least with ChromeDriver):
			// "unknown error: Element is not clickable at point (118, 136). Other element
			// would receive the click". Hence, instead of
			//.findByCssSelector("#" + comboId + "-list d-list-category-renderer").click().end()
		/*			.sleep(500) // wait before checking because events are triggered async
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the first item does not change the state because it is a category
				checkComboState(comboId, comboState,{ // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clicking the first option (a category)");
			})
		*/
			.execute(function (comboId) {
				window.lastChangeEvent = "no change event yet";
				var combo = document.getElementById(comboId);
				combo.on("change", function () {
					window.lastChangeEvent = combo.value;
				});
			}, [comboId])
			.findByCssSelector("#" + comboId + "-list [role=option]:nth-child(3)").click().end() // "Germany"
			.sleep(500) // wait for popup to close
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany",
					opened: false,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1,
					changeEventCounter: 1,
					widgetValueAtLatestInputEvent: "Germany",
					valueNodeValueAtLatestInputEvent: "Germany",
					widgetValueAtLatestChangeEvent: "Germany",
					valueNodeValueAtLatestChangeEvent: "Germany"
				}, "after clicking the third option (Germany)");
			})
			.execute(function () {
				return window.lastChangeEvent;
			})
			.then(function (lastChangeEvent) {
				assert.strictEqual(lastChangeEvent, "Germany", "confirm change event fired");
			});
	}

	// Check the state of the widget after selecting options using the mouse (clicks).
	function checkMouseNavigationMultipleSelection(remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.execute(executeExpr)
			.then(function (comboState) {
				// No item should be selected, the popup is closed initially.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: false,
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "right after load");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-arrow")
			.click()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after click on root node");
			})
			.end()
		/*			.findByCssSelector("#" + comboId + "-list d-list-category-renderer").click().end() // "Germany"
			.sleep(500) // wait before checking because events are triggered async
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the first item does not change the state because it is a category
				checkComboState(comboId, comboState,{ // expected combo state
					inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
					widgetValue: [],
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined, // never received
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clicking the first item (a category)");
			})
		*/	.findByCssSelector("#" + comboId + "-list [role=option]").click().end() // "France"
			.sleep(10)
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the second item selects "France"
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: ["France"],
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // still 0 till validation by close popup
					widgetValueAtLatestInputEvent: ["France"],
					valueNodeValueAtLatestInputEvent: "France",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clicking the second item (France))");
			})
			.findByCssSelector("#" + comboId + "-list [role=option]:nth-child(3)").click().end() // "Germany"
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the third item adds "Germany" to the selected items
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
					widgetValue: ["France", "Germany"],
					valueNodeValue: "France,Germany",
					opened: true,
					selectedItemsCount: 2,
					itemRenderersCount: 37,
					inputEventCounter: 1, // incremented
					changeEventCounter: 0, // unchanged till validation by close popup
					widgetValueAtLatestInputEvent: ["France", "Germany"],
					valueNodeValueAtLatestInputEvent: "France,Germany",
					widgetValueAtLatestChangeEvent: undefined, // never received
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clicking the third item (Germany))");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input")	// try <input> instead of the down arrow
			.click()
			.sleep(500) // wait for the async closing of the popup
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the root node closes the popup
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
					widgetValue: ["France", "Germany"],
					valueNodeValue: "France,Germany",
					opened: false,
					selectedItemsCount: 2,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 1, // incremented
					widgetValueAtLatestInputEvent: ["France", "Germany"],
					valueNodeValueAtLatestInputEvent: "France,Germany",
					widgetValueAtLatestChangeEvent: ["France", "Germany"],
					valueNodeValueAtLatestChangeEvent: "France,Germany",
				}, "after clicking again the root node (close)");
			})
			.end();
	}

	// Check the autoscroll mechanism
	function checkKeyboardNavigationAutoscroll(remote, comboId) {
		return loadFile(remote, "Combobox-decl.html")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow")
			.click()
			.sleep(500)
			.pressKeys(keys.END)
			.sleep(500)
			.execute("return " + comboId + ".list.getBottomDistance(" + comboId +
				".list.querySelectorAll('[role=option]')[" + comboId + ".list.querySelectorAll('[role=option]').length - 1]);")
			.then(function (value) {
				assert.strictEqual(value, 0,
					"After navigating to last list item, list should be at max. " +
					"scroll on the bottom");
			})
			.execute(comboId + ".closeDropDown();");
	}

	function checkNavigatedDescendantMultipleNoSelection(remote, comboId) {
		var executeExpr = "return getNavigatedDescendant(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.execute(comboId + ".focus();")
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// For multiple mode, first arrow navigates to first item in list (but doesn't toggle its selection).
				assert.match(navigatedDescendant, /^France/, "navigatedDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN) // focus on Canada
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after forth ARROW_DOWN");
			})
			.pressKeys(keys.ESCAPE);
	}

	function checkNavigatedDescendantMultipleWithSelection(remote, comboId) {
		var executeExpr = "return getNavigatedDescendant(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.execute(comboId + ".focus();")
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^France/, "navigatedDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^UK/, "navigatedDescendant after two ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after other two ARROW_DOWN");
			})
			.pressKeys(keys.ESCAPE)
			.sleep(500); // wait for async closing
	}

	function checkPopupPosition(remote, comboId, position) {
		return loadFile(remote, "Combobox-decl.html")
			.execute("return moveToBottom(\"" + comboId + "\");")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()  // opens popup
			.sleep(500)
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup alignment #1");
			})
			.findByCssSelector("#" + comboId + " input").click().end()	// Needed for webdriver on IE, even though already focused.
			.pressKeys(keys.BACKSPACE + keys.BACKSPACE) // Delete the 2 chars of "France" -> "Fran"
			.sleep(500)
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup alignment #2");
			})
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE) // input field cleared.
			.pressKeys("c") // Canada & China as result.
			.sleep(500)
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup alignment #3");
			})
			.end();
	}

	function checkRequestCount(remote, comboId) {
		// NOTE: filterDelay = 100ms.
		return loadFile(remote, "Combobox-decl.html")
			.findById(comboId)
			.execute("return getQueryCount(\"" + comboId + "\");")
			.then(function (value) {
				assert.strictEqual(value, 0, comboId + ": after page load");
			})
			.click() // not popup opens because openOnPointerDown = false
			.sleep(250)
			.execute("return getQueryCount(\"" + comboId + "\");")
			.then(function (value) {
				assert.strictEqual(value, 0, comboId + ": after focus");
			})
			.pressKeys("c") // Canada & China as expected result.
			.sleep(250)
			.execute("return getQueryCount(\"" + comboId + "\");")
			.then(function (value) {
				assert.strictEqual(value, 1, comboId + ": after typing 'c'");
			})
			.pressKeys("a") // Canada only expected result.
			.sleep(250)
			.execute("return getQueryCount(\"" + comboId + "\");")
			.then(function (value) {
				assert.strictEqual(value, 2, comboId + ": after typing 'a'");
			})
			.end();
	}

	function checkFilteringWithZeroFilterChars(remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.findById(comboId)
			.click() // popup opens.
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: true,
					selectedItemsCount: 1,
					itemRenderersCount: 37,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after page load and popup opened");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "France"
			.execute(executeExpr)
			.then(function (comboState) { // Filtering happened.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Franc",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 1,
					inputEventCounter: 1,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after removing 1 char.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Franc"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Fran"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Fra"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Fr"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "F" - Empty input node
			.execute(executeExpr)
			.then(function (comboState) { // We get full list again.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 37,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clearing the input.");
			})
			.pressKeys("U") // filters all countries but UK and USA
			.execute(executeExpr)
			.then(function (comboState) { // We get full list.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "U",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 2,
					inputEventCounter: 0, // was reset by callling getComboState.
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after typing `U`.");
			})
			.end();
	}

	function checkFilteringWithThreeFilterChars(remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.findById(comboId)
			.click()
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "France",
					widgetValue: "France",
					valueNodeValue: "France",
					opened: false, // click() does not open the popup.
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0, // unchanged
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after page load.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "France"
			.execute(executeExpr)
			.then(function (comboState) { // Filtering happened.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Franc",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 1,
					inputEventCounter: 1,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after removing 1 char.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Franc"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Fran"
			.pressKeys(keys.BACKSPACE) // Delete the 1 char of "Fra" - popup closes.
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Fr",
					widgetValue: "",
					valueNodeValue: "",
					opened: false,
					selectedItemsCount: 0,
					itemRenderersCount: 1,
					inputEventCounter: 0,
					changeEventCounter: 0, // popup closed automatically, shouldn't generate change event
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after clearing the input partially.");
			})
			.pressKeys("a") // filters all countries but France.
			.execute(executeExpr)
			.then(function (comboState) { // We get full list.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Fra",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 1,
					inputEventCounter: 0, // was reset by previous getComboState call.
					changeEventCounter: 0, //
					widgetValueAtLatestInputEvent: "",
					valueNodeValueAtLatestInputEvent: "",
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after typing `a`.");
			})
			.end();
	}

	function checkFilteringAutoCompleteMode(remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "Combobox-decl.html")
			.findByCssSelector("#" + comboId + " .d-combobox-input")
			.getAttribute("readonly")
			.then(function (value) {
				assert.strictEqual(value, null, comboId + ": readonly attribute after page load");
			})
			.click()
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "",
					widgetValue: "",
					valueNodeValue: "",
					opened: false, // click() does not open the popup.
					selectedItemsCount: 0,
					itemRenderersCount: 0, // the source is already attached, but items not yet rendered.
					inputEventCounter: 0, // unchanged
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after page load.");
			})
			.pressKeys("g")
			.pressKeys("e")
			.pressKeys("r")
			.pressKeys("m")
			.execute(executeExpr)
			.then(function (comboState) { // Filtering happened.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "germ",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 1,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after typing `germ` chars.");
			})
			.pressKeys("w") // germw -> not matching items
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "germw",
					widgetValue: "",
					valueNodeValue: "",
					opened: true,
					selectedItemsCount: 0,
					itemRenderersCount: 0,
					inputEventCounter: 0,
					changeEventCounter: 0,
					widgetValueAtLatestInputEvent: undefined,
					valueNodeValueAtLatestInputEvent: undefined,
					widgetValueAtLatestChangeEvent: undefined,
					valueNodeValueAtLatestChangeEvent: undefined
				}, "after typing `w`.");
			})
			.end()
			.findById(comboId + "-list") // List's showNoItems is true.
			.getVisibleText()
			.then(function (visibleText) {
				assert.match(visibleText, /^Nothing to show./, "visibleText");
			})
			.end()
			.findByCssSelector("#" + comboId + " .d-combobox-input")
			.pressKeys(keys.BACKSPACE) // clearing `w`.
			.sleep(250)
			.end()
			.execute("storeTestingInfo(document.getElementById(\"" + comboId + "\"));")
			.findByCssSelector("#" + comboId + "-list [role=option]").click().end() // "Germany"
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) { // We get full list.
				checkComboState(comboId, comboState, { // expected combo state
					inputNodeValue: "Germany",
					widgetValue: "Germany",
					valueNodeValue: "Germany",
					opened: false,
					selectedItemsCount: 1,
					itemRenderersCount: 1, // because nothing happens until dropdown is reopened; then it's 37.
					inputEventCounter: 1, // incremented.
					changeEventCounter: 1, // there was a commit
					widgetValueAtLatestInputEvent: "Germany",
					valueNodeValueAtLatestInputEvent: "Germany",
					widgetValueAtLatestChangeEvent: "Germany",
					valueNodeValueAtLatestChangeEvent: "Germany"
				}, "after selecting `Germany` item.");
			});
	}

	registerSuite("Combobox - functional", {
		afterEach: function () {
			return this.remote.execute(function () {
				Array.prototype.forEach.call(document.querySelectorAll("d-combobox"), function (combo) {
					combo.closeDropDown();
				});
			});
		},

		tests: {
			"Combobox Form submit": function () {
				return loadFile(this.remote, "Combobox-decl.html")
					.findById("form1")
					.submit()
					.end()
					.sleep(100)		// try to avoid intermittent IE11 error
					.setFindTimeout(intern.config.WAIT_TIMEOUT)
					.findById("valueFor_combo1")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "France", "Combobox combo1");
					})
					.end()
					.findById("valueFor_combo2")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "France", "Combobox combo2");
					})
					.end()
					.findById("valueFor_combo3")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "", "Combobox combo3");
					})
					.end()
					.execute("return document.getElementById('valueFor_combo1-disabled');")
					.then(function (value) {
						assert.isNull(value, "disabled Combobox combo1-disabled");
					})
					.execute("return document.getElementById('valueFor_combo2-disabled');")
					.then(function (value) {
						assert.isNull(value, "disabled Combobox combo2-disabled");
					})
					.execute("return document.getElementById('valueFor_combo3-disabled');")
					.then(function (value) {
						assert.isNull(value, "disabled Combobox combo3-disabled");
					})
					.findById("valueFor_combo1-value")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "FR", "Combobox combo1-value");
					})
					.end()
					.findById("valueFor_combo3-value")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "FR", "Combobox combo3-value");
					})
					.end()
					.findById("valueFor_combo1-single-rtl")
					.getVisibleText()
					.then(function (value) {
						assert.strictEqual(value, "France", "Combobox combo1-single-rtl");
					})
					.end();
			},

			"keyboard navigation selectionMode=single, autoFilter=false": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkKeyboardNavigationSingleSelection(remote, "combo1", false);
			},

			"keyboard navigation selectionMode=single, autoFilter=true": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}

				if (remote.environmentType.browserName.toLowerCase() === "internet explorer") {
					// TODO: This test fails on IE because the backspace to clear "France" doesn't work since
					// the caret is at the beginning of the <input> rather than the end.  (Note the test is
					// complicated because it opens the dropdown first and then does backspace.)
					// Actually I'm not sure how the test is passing on other browsers
					// https://github.com/ibm-js/deliteful/issues/689
					return this.skip("caret in wrong position, backspace doesn't work");
				}

				return checkKeyboardNavigationSingleSelection(remote, "combo2", true);
			},

			"blank value initially selected": function () {
				return loadFile(this.remote, "Combobox-decl.html")
					.findByCssSelector("#combo0 .d-combobox-arrow").click().end()
					.findByCssSelector("#combo0-list [role=option]")
					.getAttribute("aria-selected").then(function (val) {
						assert.strictEqual(val, "true", "aria-selected on first list item");
					})
					.end();
			},

			"keyboard navigation selectionMode = multiple": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkKeyboardNavigationMultipleSelection(remote, "combo3");
			},

			"keyboard navigation selectionMode = multiple, initial selection (combo3-value)": function () {
				var remote = this.remote,
					comboId = "combo3-value";
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				var executeExpr = "return getComboState(\"" + comboId + "\");";
				return loadFile(remote, "Combobox-decl.html")
					.execute("document.getElementById('" + comboId + "').focus(); " + executeExpr)
					.then(function (comboState) {
						// France initially selcted
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: "France",
							widgetValue: ["FR"],
							valueNodeValue: "FR",
							opened: false,
							selectedItemsCount: 0,
							itemRenderersCount: 0,
							inputEventCounter: 0,
							changeEventCounter: 0,
							widgetValueAtLatestInputEvent: undefined, // never received
							valueNodeValueAtLatestInputEvent: undefined,
							widgetValueAtLatestChangeEvent: undefined,
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after initial focus");
					})
					.pressKeys(keys.ARROW_DOWN)
					.sleep(2000)
					.execute(executeExpr)
					.then(function (comboState) {
						// ARROW_DOWN opens the dropdown and focuses France
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: "France",
							widgetValue: ["FR"],
							valueNodeValue: "FR",
							opened: true,
							selectedItemsCount: 1,
							itemRenderersCount: 8,
							inputEventCounter: 0,
							changeEventCounter: 0,
							widgetValueAtLatestInputEvent: undefined, // never received
							valueNodeValueAtLatestInputEvent: undefined,
							widgetValueAtLatestChangeEvent: undefined,
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after first ARROW_DOWN");
					})
					.pressKeys(keys.ARROW_DOWN)
					.execute(executeExpr)
					.then(function (comboState) {
						// Change the navigated/highlighted item of the List.
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: "France",
							widgetValue: ["FR"],
							valueNodeValue: "FR",
							opened: true,
							selectedItemsCount: 1,
							itemRenderersCount: 8,
							inputEventCounter: 0,
							changeEventCounter: 0,
							widgetValueAtLatestInputEvent: undefined, // never received
							valueNodeValueAtLatestInputEvent: undefined,
							widgetValueAtLatestChangeEvent: undefined,
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after second ARROW_DOWN");
						assert.match(comboState.activeDescendant, /^Germany/,
							"activeDescendant after second ARROW_DOWN");
					})
					.pressKeys(keys.SPACE)
					.execute(executeExpr)
					.then(function (comboState) {
						// Now France and Germany should be selected.
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: "2 selected",
							widgetValue: ["FR", "DE"],
							valueNodeValue: "FR,DE",
							opened: true,
							selectedItemsCount: 2,
							itemRenderersCount: 8,
							inputEventCounter: 1, // incremented
							changeEventCounter: 0, // still 0 till validation by close popup
							widgetValueAtLatestInputEvent: ["FR", "DE"],
							valueNodeValueAtLatestInputEvent: "FR,DE",
							widgetValueAtLatestChangeEvent: undefined, // never received
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after first SPACE on Germany item");
					})
					.pressKeys(keys.SPACE) // unselect Germany
					.execute(executeExpr)
					.then(function (comboState) {
						// Now only France should be selected.
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: "France",
							widgetValue: ["FR"],
							valueNodeValue: "FR",
							opened: true,
							selectedItemsCount: 1,
							itemRenderersCount: 8,
							inputEventCounter: 1, // incremented
							changeEventCounter: 0, // still 0 till validation by close popup
							widgetValueAtLatestInputEvent: ["FR"],
							valueNodeValueAtLatestInputEvent: "FR",
							widgetValueAtLatestChangeEvent: undefined, // never received
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after second SPACE on Germany item");
					})
					.pressKeys(keys.ARROW_UP)
					.pressKeys(keys.SPACE) // deselect France too
					.execute(executeExpr)
					.then(function (comboState) {
						// Now nothing should be selected.
						checkComboState(comboId, comboState, { // expected combo state
							inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
							widgetValue: [],
							valueNodeValue: "",
							opened: true,
							selectedItemsCount: 0,
							itemRenderersCount: 8,
							inputEventCounter: 1, // incremented
							changeEventCounter: 0, // still 0 till validation by close popup
							widgetValueAtLatestInputEvent: [],
							valueNodeValueAtLatestInputEvent: "",
							widgetValueAtLatestChangeEvent: undefined, // never received
							valueNodeValueAtLatestChangeEvent: undefined
						}, "after first SPACE on France item");
					});
			},

			"keyboard navigation - autoscroll (single)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkKeyboardNavigationAutoscroll(remote, "combo1");
			},

			"keyboard navigation - autoscroll (multiple)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkKeyboardNavigationAutoscroll(remote, "combo3");
			},

			"check navigatedDescendant (multiple, no selection)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkNavigatedDescendantMultipleNoSelection(remote, "combo3");
			},

			"check navigatedDescendant (multiple, with selection)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkNavigatedDescendantMultipleWithSelection(remote, "combo3");
			},

			"mouse navigation selectionMode=single, autoFilter=false": function () {
				return checkMouseNavigationSingleSelection(this.remote, "combo1");
			},

			"mouse navigation selectionMode=multiple": function () {
				return checkMouseNavigationMultipleSelection(this.remote, "combo3");
			},

			"popup position after filter": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}

				return checkPopupPosition(remote, "combo2-custom-sel-single", "above");
			},

			"select item with currently displayed value": function () {
				var remote = this.remote;

				if (remote.environmentType.browserName.toLowerCase() === "internet explorer") {
					// TODO: This test fails on IE because the backspace to clear "France" doesn't work.
					return this.skip("caret in wrong position, backspace doesn't work");
				}
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}

				return loadFile(remote, "Combobox-decl.html")
					.execute("document.getElementById('combo2-value').focus();")
					.pressKeys(keys.BACKSPACE) // "Franc"
					.pressKeys(keys.BACKSPACE) // "Fran"
					.pressKeys(keys.BACKSPACE) // "Fra"
					.pressKeys(keys.BACKSPACE) // "Fr"
					.pressKeys(keys.BACKSPACE) // "F"
					.pressKeys(keys.BACKSPACE) // "" - At this stage the popup should be closed.
					.pressKeys("Germany")		// At this point popup should be open w/one entry marked Germany.
					.execute("return document.getElementById('combo2-value').inputNode.value;").then(function (value) {
						assert.strictEqual(value, "Germany", "<input> after typed Germany");
					})
					.pressKeys(keys.ARROW_DOWN)
					.pressKeys(keys.ENTER)		// Select "Germany".
					.execute("return document.getElementById('combo2-value').inputNode.value;").then(function (value) {
						assert.strictEqual(value, "Germany", "<input> after selected Germany");
					})
					.execute("return document.getElementById('combo2-value').value;").then(function (value) {
						assert.strictEqual(value, "DE", "combo.value after selected Germany");
					});
			},

			"check for number of request (using SlowStore)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkRequestCount(remote, "combo-slowstore");
			},

			"filtering with minimum characters (0)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkFilteringWithZeroFilterChars(remote, "combo-minfilterchars0");
			},

			"filtering with minimum characters (3)": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkFilteringWithThreeFilterChars(remote, "combo-minfilterchars3");
			},

			"filtering in auto complete mode": function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
				return checkFilteringAutoCompleteMode(remote, "combo-autocomplete");
			},

			"programatically setting value": {
				"single select": function () {
					return this.remote
						.execute(function () {
							var combo = document.getElementById("combo1");
							combo.value = combo.displayedValue = "Germany";
						})
						.findByCssSelector("#combo1 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo1-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, ["Germany"]);
						})
						.execute(function () {
							var combo = document.getElementById("combo1");
							combo.closeDropDown();
							combo.value = combo.displayedValue = "France";
						})
						.findByCssSelector("#combo1 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo1-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, ["France"]);
						});
				},

				"single select with filtering": function () {
					return this.remote
						.execute(function () {
							var combo = document.getElementById("combo2");
							combo.value = combo.displayedValue = "Germany";
						})
						.findByCssSelector("#combo2 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo2-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, ["Germany"]);
						})
						.execute(function () {
							var combo = document.getElementById("combo2");
							combo.closeDropDown();
							combo.value = combo.displayedValue = "France";
						})
						.findByCssSelector("#combo2 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo2-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, ["France"]);
						});
				},

				"multi select": function () {
					return this.remote
						.execute(function () {
							document.getElementById("combo3").value = ["Germany", "France"];
						})
						.findByCssSelector("#combo3 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo3-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, ["France", "Germany"]);
						})
						.execute(function () {
							var combo = document.getElementById("combo3");
							combo.closeDropDown();
							combo.value = [];
						})
						.findByCssSelector("#combo3 .d-combobox-arrow").click().end()
						.sleep(500)
						.execute(function () {
							return Array.prototype.map.call(document.querySelectorAll(
								"#combo3-list [role=option][aria-selected=true] .d-list-item-label"), function (label) {
								return label.textContent.trim();
							});
						}).then(function (selectedItems) {
							assert.deepEqual(selectedItems, []);
						});
				}
			}
		}
	});
});
