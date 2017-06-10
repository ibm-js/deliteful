define([
	"intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require",
	"dojo/string"
], function (intern, registerSuite, pollUntil, assert, keys, require, string) {

	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.execute("document.body.className = 'webdriver';");
	};

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
	var checkKeyboardNavigationSingleSelection = function (remote, comboId, autoFilter) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		var res = loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus();  " + executeExpr)
			.then(function (comboState) {
				// No selection by default
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
					checkComboState(comboId, comboState,
						{ // expected combo state
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
					checkComboState(comboId, comboState,
						{ // expected combo state
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
					checkComboState(comboId, comboState,
						{ // expected combo state
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
					checkComboState(comboId, comboState,
						{ // expected combo state
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
					checkComboState(comboId, comboState,
						{ // expected combo state
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
	};

	// Check the state of the widget after selecting options using the keyboard.
	var checkKeyboardNavigationMultipleSelection = function (remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus(); " + executeExpr)
			.then(function (comboState) {
				// In a multiple-select no option is selected initially
				// (holds for the widget's delite/Selection API just as for the
				// native select).
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				// For now there should still be no option selected, the first
				// ARROW_DOWN only opens the dropdown
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// Still no selection after the second ARROW_DOWN; in multiple
				// mode it only changes the navigated/highlighted item of the List.
				checkComboState(comboId, comboState,
					{ // expected combo state
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
					}, "after second ARROW_DOWN");
				assert.match(comboState.activeDescendant, /^France/, "activeDescendant after second ARROW_DOWN");
			})
			.pressKeys(keys.SPACE) // toggles selection state of the navigated item
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first item should be selected
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["Germany", "France"],
						valueNodeValue: "Germany,France",
						opened: true,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 1, // incremented
						changeEventCounter: 0, // unchanged till validation by close popup
						widgetValueAtLatestInputEvent: ["Germany", "France"],
						valueNodeValueAtLatestInputEvent: "Germany,France",
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
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["Germany", "France"],
						valueNodeValue: "Germany,France",
						opened: false,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 0, // unchanged
						changeEventCounter: 1, // incremented
						widgetValueAtLatestInputEvent: ["Germany", "France"],
						valueNodeValueAtLatestInputEvent: "Germany,France",
						widgetValueAtLatestChangeEvent: ["Germany", "France"],
						valueNodeValueAtLatestChangeEvent: "Germany,France"
					}, "after ESCAPE");
			});
	};

	// Check the state of the widget after selecting options using the mouse (clicks).
	var checkMouseNavigationSingleSelection = function (remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.findById(comboId)
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the popup is closed initially
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			// .findById(comboId + "_category0") // first item, which is a category
			// .click()
			// going with the click() method called in the browser:
			// elc now that click is also causing problems on all browsers, so skipping this step
		/*	.execute(comboId + "_category0.click();")
			.sleep(500) // wait before checking because events are triggered async
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the first item does not change the state because it is a category
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			.end()
		*/	.findById(comboId + "_item1") // third option, which is "Germany"
			.click()
			.sleep(500) // wait for popup to close
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			.end();
	};

	// Check the state of the widget after selecting options using the mouse (clicks).
	var checkMouseNavigationMultipleSelection = function (remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(executeExpr)
			.then(function (comboState) {
				// No item should be selected, the popup is closed initially.
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			// For some reason, using remote.click() for a category leads to this error
			// (at least with ChromeDriver):
			// "unknown error: Element is not clickable at point (118, 136). Other element
			// would receive the click". Hence, instead of
			// .findById(comboId + "_category0") // first item, which is a category
			// .click()
			// going with the click() method called in the browser:
			// elc now that click is also causing problems on all browsers, so skipping this step
		/*	.execute(comboId + "_category0.click();")
			.sleep(500) // wait before checking because events are triggered async
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the first item does not change the state because it is a category
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			.end()
		*/	.findById(comboId + "_item0")  // first item, which is "France"
			.click()
			.sleep(10)
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the second item selects "France"
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			.end()
			.findById(comboId + "_item1")  // third item, which is "Germany"
			.click()
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the third item adds "Germany" to the selected items
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["Germany", "France"],
						valueNodeValue: "Germany,France",
						opened: true,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 1, // incremented
						changeEventCounter: 0, // unchanged till validation by close popup
						widgetValueAtLatestInputEvent: ["Germany", "France"],
						valueNodeValueAtLatestInputEvent: "Germany,France",
						widgetValueAtLatestChangeEvent: undefined, // never received
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after clicking the third item (Germany))");
			})
			.end()
			.findByCssSelector("#" + comboId + " .d-combobox-input")	// try <input> instead of the down arrow
			.click()
			.sleep(500) // wait for the async closing of the popup
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the root node closes the popup
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["Germany", "France"],
						valueNodeValue: "Germany,France",
						opened: false,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 0, // unchanged
						changeEventCounter: 1, // incremented
						widgetValueAtLatestInputEvent: ["Germany", "France"],
						valueNodeValueAtLatestInputEvent: "Germany,France",
						widgetValueAtLatestChangeEvent: ["Germany", "France"],
						valueNodeValueAtLatestChangeEvent: "Germany,France"
					}, "after clicking again the root node (close)");
			})
			.end();
	};

	// Check the autoscroll mechanism
	var checkKeyboardNavigationAutoscroll = function (remote, comboId) {
		return loadFile(remote, "./Combobox-decl.html")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow")
			.click()
			.sleep(500)
			.pressKeys(keys.END)
			.sleep(500)
			// combo1.list.getBottomDistance(combo1.list.getItemRenderers()
			// [combo1.list.getItemRenderers().length - 1]);
			.execute("return " + comboId + ".list.getBottomDistance(" + comboId +
				".list.getItemRenderers()[" + comboId +
				".list.getItemRenderers().length - 1]);")
			.then(function (value) {
				assert.strictEqual(value, 0,
					"After navigating to last list item, list should be at max. " +
					"scroll on the bottom");
			})
			.execute(comboId + ".closeDropDown();");
	};

	var checkNavigatedDescendantNoSelection = function (remote, comboId) {
		var executeExpr = "return getNavigatedDescendant(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus();")
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.isNull(navigatedDescendant, "navigatedDescendant should be still null.");
			})
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^France/, "navigatedDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN) // focus on Cananda
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after forth ARROW_DOWN");
			})
			.pressKeys(keys.ESCAPE)
			.sleep(500) // wait for async closing
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// note: even if the popup it's closed, list should maintain its navigatedDescendant set.
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after closing the popup");
			})
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500) // wait for async opening
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after opening the popup");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN) // focus on Cananda
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^China/, "navigatedDescendant after two ARROW_DOWN");
			});
	};

	var checkNavigatedDescendantWithSelection = function (remote, comboId) {
		var executeExpr = "return getNavigatedDescendant(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus();")
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.isNull(navigatedDescendant, "navigatedDescendant should be still null.");
			})
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
			.sleep(500) // wait for async closing
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// note: even if the popup it's closed, list should maintain its navigatedDescendant set.
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after closing the popup");
			})
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500) // wait for async opening
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// note: on opening, the widget does focus on the navigated descendant
				assert.match(navigatedDescendant, /^Canada/, "navigatedDescendant after opening the popup");
			})
			.pressKeys(keys.ARROW_DOWN)
			.pressKeys(keys.ARROW_DOWN) // focus on Cananda
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^China/, "navigatedDescendant after two ARROW_DOWN");
			});
	};

	var checkNavigatedDescendantWithPreSelection = function (remote, comboId) {
		var executeExpr = "return getNavigatedDescendant(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.execute("document.getElementById(\"" + comboId + "\").focus();")
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// note: Germany is preselected.
				assert.match(navigatedDescendant, /^Germany/, "navigatedDescendant after first ARROW_DOWN");
			})
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500)
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				assert.match(navigatedDescendant, /^UK/, "navigatedDescendant after second ARROW_DOWN");
			})
			.pressKeys(keys.ESCAPE)
			.sleep(500) // wait for async closing
			.pressKeys(keys.ARROW_DOWN)
			.sleep(500) // wait for async opening
			.execute(executeExpr)
			.then(function (navigatedDescendant) {
				// note: on opening, the widget does focus on the first selected element
				assert.match(navigatedDescendant, /^Germany/, "navigatedDescendant after opening the popup");
			});
	};

	var checkPopupPosition = function (remote, comboId, position) {
		return loadFile(remote, "./Combobox-decl.html")
			.execute("return moveToBottom(\"" + comboId + "\");")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()  // opens popup
			.sleep(500)
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup is not aligned as expected.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 2 chars of "France" -> "Fran"
			.pressKeys(keys.BACKSPACE)
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup is not aligned as expected.");
			})
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE)
			.pressKeys(keys.BACKSPACE) // input field cleared.
			.pressKeys("c") // Canada & China as result.
			.execute("return isAligned(\"" + comboId + "\", \"" + position + "\")")
			.then(function (value) {
				assert.isTrue(value.isAligned, comboId + "'s popup is not aligned as expected.");
			})
			.end();
	};

	var checkRequestCount = function (remote, comboId) {
		// NOTE: filterDelay = 100ms.
		return loadFile(remote, "./Combobox-decl.html")
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
	};

	var checkFilteringWithZeroFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.findById(comboId)
			.click() // popup opens.
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
	};

	var checkFilteringWithThreeFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.findById(comboId)
			.click()
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
	};

	var checkFilteringAutoCompleteMode = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./Combobox-decl.html")
			.findByCssSelector("#" + comboId + " .d-combobox-input")
			.getAttribute("readonly")
			.then(function (value) {
				assert.strictEqual(value, null, comboId + ": readonly attribute after page load");
			})
			.click()
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			.findByCssSelector("#" + comboId + "_item0")
			.click() // Germany selected
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) { // We get full list.
				checkComboState(comboId, comboState,
					{ // expected combo state
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
			})
			.end();
	};

	registerSuite({
		name: "Combobox - functional",

		setup: function () {
			if (this.remote.environmentType.platformName === "iOS") {
				// Skip all the tests on mobile because they aren't designed to interact w/the ComboPopup.
				return this.skip("test designed for desktop Combobox, not mobile");
			}
		},

		"Combobox Form submit": function () {
			return loadFile(this.remote, "./Combobox-decl.html")
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

			if (remote.environmentType.browserName === "internet explorer") {
				// TODO: This test fails on IE because the backspace to clear "France" doesn't work since
				// the caret is at the beginning of the <input> rather than the end.  (Note the test is
				// complicated because it opens the dropdown first and then does backspace.)
				// Actually I'm not sure how the test is passing on other browsers
				// https://github.com/ibm-js/deliteful/issues/689
				return this.skip("caret in wrong position, backspace doesn't work");
			}

			return checkKeyboardNavigationSingleSelection(remote, "combo2", true);
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
			return loadFile(remote, "./Combobox-decl.html")
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
					assert.match(comboState.activeDescendant, /^Germany/, "activeDescendant after second ARROW_DOWN");
				})
				.pressKeys(keys.SPACE)
				.execute(executeExpr)
				.then(function (comboState) {
					// Now France and Germany should be selected.
					checkComboState(comboId, comboState, { // expected combo state
						inputNodeValue: "2 selected",
						widgetValue: ["DE", "FR"],
						valueNodeValue: "DE,FR",
						opened: true,
						selectedItemsCount: 2,
						itemRenderersCount: 8,
						inputEventCounter: 1, // incremented
						changeEventCounter: 0, // still 0 till validation by close popup
						widgetValueAtLatestInputEvent: ["DE", "FR"],
						valueNodeValueAtLatestInputEvent: "DE,FR",
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

		"check navigatedDescendant (no selection)": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return checkNavigatedDescendantNoSelection(remote, "combo3");
		},

		"check navigatedDescendant (with selection)": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return checkNavigatedDescendantWithSelection(remote, "combo3");
		},

		"check navigatedDescendant (with pre-selection)": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return checkNavigatedDescendantWithPreSelection(remote, "combo2-custom-sel-multiple");
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

			if (remote.environmentType.browserName === "internet explorer") {
				// TODO: This test fails on IE because the backspace to clear "France" doesn't work.
				return this.skip("caret in wrong position, backspace doesn't work");
			}
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			var comboId = "combo2-value";

			return loadFile(remote, "./Combobox-decl.html")
				.execute("document.getElementById('" + comboId + "').focus();")
				.pressKeys(keys.BACKSPACE) // "Franc"
				.pressKeys(keys.BACKSPACE) // "Fran"
				.pressKeys(keys.BACKSPACE) // "Fra"
				.pressKeys(keys.BACKSPACE) // "Fr"
				.pressKeys(keys.BACKSPACE) // "F"
				.pressKeys(keys.BACKSPACE) // "" - At this stage the popup should be closed.
				.pressKeys("Germany")		// At this point popup should be open w/one entry marked Germany.
				.execute("return document.getElementById('" + comboId + "').inputNode.value;").then(function (value) {
					assert.strictEqual(value, "Germany", "<input> after typed Germany");
				})
				.pressKeys(keys.ARROW_DOWN)
				.pressKeys(keys.ENTER)		// Select "Germany".
				.execute("return document.getElementById('" + comboId + "').inputNode.value;").then(function (value) {
					assert.strictEqual(value, "Germany", "<input> after selected Germany");
				})
				.execute("return document.getElementById('" + comboId + "').value;").then(function (value) {
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
		}
	});
});
