define([
	"intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};
	
	var checkComboState = function (comboId, comboState, expectedComboState, stepName) {
		// comboState is an object retrieved from the browser, containing
		// the state of the Combobox.
		var selectionMode = "(" + comboState.selectionMode + ")";
		var assertEqualValue = function (value, expectedValue, msg) {
			if (expectedValue === undefined) {
				// Note that, for a variable which is undefined in the browser,
				// remote.execute() brings a null value, not undefined. Hence,
				// since in the tested page the variables that store widget.value
				// and widget.valueNode.value at the latest input/change moment the valueCombobox-decl.html
				expectedValue = null;
			}
			if (Array.isArray(expectedValue)) {
				assert.deepEqual(value, expectedValue, msg + " deepEqual");
			} else {
				assert.strictEqual(value, expectedValue, msg + " strictEqual");
			}
		};
		
		assert.strictEqual(comboState.inputNodeValue, expectedComboState.inputNodeValue,
			selectionMode + " combo.inputNode.value " + stepName + " " +
			comboId + ".inputNode.value");
		assertEqualValue(comboState.widgetValue, expectedComboState.widgetValue,
				selectionMode + " combo.value " + stepName + " " +
				comboId + ".value");
		assertEqualValue(comboState.valueNodeValue, expectedComboState.valueNodeValue,
				selectionMode + " combo.valueNode.value " + stepName + " " +
				comboId + ".value");
		assert.strictEqual(comboState.opened, expectedComboState.opened,
			selectionMode + " combo.opened " + stepName);
		
		assert.strictEqual(comboState.selectedItemsCount, expectedComboState.selectedItemsCount,
			selectionMode + " combo.selectedItemsCount " + stepName);
		assert.strictEqual(comboState.itemRenderersCount, expectedComboState.itemRenderersCount,
			selectionMode + " combo.opened " + stepName);
		
		// The event counters count the new events since the previous check.
		assert.strictEqual(comboState.inputEventCounter, expectedComboState.inputEventCounter,
			selectionMode + " combo.inputEventCounter " + stepName);
		assert.strictEqual(comboState.changeEventCounter, expectedComboState.changeEventCounter,
			selectionMode + " combo.changeEventCounter " + stepName);
			
		assertEqualValue(comboState.widgetValueAtLatestInputEvent,
			expectedComboState.widgetValueAtLatestInputEvent,
			selectionMode + " combo.value at latest input event " + stepName);
		assertEqualValue(comboState.valueNodeValueAtLatestInputEvent,
			expectedComboState.valueNodeValueAtLatestInputEvent,
			selectionMode + " combo.valueNode.value at latest input event " + stepName);

		assertEqualValue(comboState.widgetValueAtLatestChangeEvent,
			expectedComboState.widgetValueAtLatestChangeEvent,
			selectionMode + " combo.value at latest change event " + stepName);
		assertEqualValue(comboState.valueNodeValueAtLatestChangeEvent,
			expectedComboState.valueNodeValueAtLatestChangeEvent,
			selectionMode + " combo.valueNode.value at latest change event " + stepName);
	};
	
	// Check the state of the widget after selecting options using the keyboard.
	var checkKeyboardNavigationSingleSelection = function (remote, comboId, autoFilter) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget. The function getComboState() is defined in
		// the loaded HTML file. Note that each call of getComboState() resets the
		// event counters (inputEventCounter and changeEventCounter).
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		var res = loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus(); " + executeExpr)
			.then(function (comboState) {
				// The first option is initially selected by default
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						widgetValue: "France",
						valueNodeValue: "France",
						opened: false,
						selectedItemsCount: 1,
						itemRenderersCount: 37, // full list
						inputEventCounter: 0, // no event so far
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after initial focus");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should still be the one selected,
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
				assert(/^France/.test(comboState.activeDescendant),
					"activeDescendant after first ARROW_DOWN: " + comboState.activeDescendant);
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
				assert(/^Germany/.test(comboState.activeDescendant),
					"activeDescendant after second ARROW_DOWN: " + comboState.activeDescendant);
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
				assert(/^France/.test(comboState.activeDescendant),
					"activeDescendant after first ARROW_UP: " + comboState.activeDescendant);
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
				assert(/^Germany/.test(comboState.activeDescendant),
					"activeDescendant after third ARROW_DOWN: " + comboState.activeDescendant);
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
					assert(/^Germany/.test(comboState.activeDescendant),
						"activeDescendant after after ARROW_DOWN following ESCAPE: " + comboState.activeDescendant);
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
					// Just reopens the dropdown. No other state change, except the
					// input node now showing just the "u" character, and the list now
					// has only 2 item renderers (UK and USA).
					checkComboState(comboId, comboState,
						{ // expected combo state
							inputNodeValue: "u",
							widgetValue: "Germany",
							valueNodeValue: "Germany",
							opened: true,
							selectedItemsCount: 1,
							itemRenderersCount: 2,
							inputEventCounter: 0, // unchanged
							changeEventCounter: 0, // unchanged
							widgetValueAtLatestInputEvent: "Germany",
							valueNodeValueAtLatestInputEvent: "Germany",
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
							widgetValue: "Germany",
							valueNodeValue: "Germany",
							opened: true,
							selectedItemsCount: 1,
							itemRenderersCount: 0,
							inputEventCounter: 0, // unchanged
							changeEventCounter: 0, // unchanged
							widgetValueAtLatestInputEvent: "Germany",
							valueNodeValueAtLatestInputEvent: "Germany",
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
							itemRenderersCount: 2, // UK and USA
							inputEventCounter: 1, // incremented
							changeEventCounter: 0, // unchanged
							widgetValueAtLatestInputEvent: "UK",
							valueNodeValueAtLatestInputEvent: "UK",
							widgetValueAtLatestChangeEvent: "Germany",
							valueNodeValueAtLatestChangeEvent: "Germany"
						}, "after ARROW_DOWN with filtered list");
					assert(/^UK/.test(comboState.activeDescendant),
						"activeDescendant after ARROW_DOWN with filtered list: " + comboState.activeDescendant);
				})
				.pressKeys(keys.ENTER) // closes the popup and validates the changes
				.sleep(1000) // wait for async closing
				.execute(executeExpr)
				.then(function (comboState) {
					checkComboState(comboId, comboState,
						{ // expected combo state
							inputNodeValue: "UK",
							widgetValue: "UK",
							valueNodeValue: "UK",
							opened: false,
							selectedItemsCount: 1,
							itemRenderersCount: 37, // closing resets the filtering
							inputEventCounter: 0, // unchanged
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
						itemRenderersCount: 37,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after initial focus");
			})
			.pressKeys(keys.ARROW_DOWN)
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
				assert(/^France/.test(comboState.activeDescendant),
					"activeDescendant after second ARROW_DOWN: " + comboState.activeDescendant);
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
				assert(/^Germany/.test(comboState.activeDescendant),
					"activeDescendant after second ARROW_DOWN after reopening: " + comboState.activeDescendant);
			})
			.pressKeys(keys.SPACE) // toggles the navigated item (Germany) to selected state
			.execute(executeExpr)
			.then(function (comboState) {
				// Now the first item should be selected
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceMsg,
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
						inputNodeValue: comboState.multipleChoiceMsg,
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
						selectedItemsCount: 1,
						itemRenderersCount: 37,
						inputEventCounter: 0, // no event so far
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "right after load");
			})
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
				// The click on the first option does not change the state because it is a category
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
					}, "after clicking the third option (Germany))");
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
			.findById(comboId)
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
						itemRenderersCount: 37,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "right after load");
			})
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
		*/	.findById(comboId + "_item0") // second item, which is "France"
			.click()
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
			.findById(comboId + "_item1") // third item, which is "Germany"
			.click()
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the third item adds "Germany" to the selected items
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceMsg,
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
			.findById(comboId)
			.click()
			.sleep(500) // wait for the async closing of the popup
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the root node closes the popup
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceMsg,
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
			.execute(comboId + ".focus();")
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
	
	registerSuite({
		name: "Combobox - functional",

		"Combobox Form submit": function () {
			var remote = this.remote;
			if (/iOS|selendroid/.test(remote.environmentType.browserName)) {
				return this.skip();
			}
			return loadFile(this.remote, "./Combobox-decl.html")
				.findById("form1")
				.submit()
				.end()
				.setFindTimeout(intern.config.WAIT_TIMEOUT)
				.find("id", "parameters")
				.end()
				.findById("valueFor_combo1")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo1");
				})
				.end()
				.findById("valueFor_combo2")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo2");
				})
				.end()
				.findById("valueFor_combo3")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "", "Unexpected value for Combobox combo3");
				})
				.end()
				.execute("return document.getElementById('valueFor_combo1-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo1-disabled");
				})
				.execute("return document.getElementById('valueFor_combo2-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo2-disabled");
				})
				.execute("return document.getElementById('valueFor_combo3-disabled');")
				.then(function (value) {
					assert.isNull(value, "Unexpected value for disabled Combobox combo3-disabled");
				})
				.findById("valueFor_combo1-value")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "FR", "Unexpected value for Combobox combo1-value");
				})
				.end()
				.findById("valueFor_combo3-value")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "", "Unexpected value for Combobox combo3-value");
				})
				.end()
				.findById("valueFor_combo1-single-rtl")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, "France", "Unexpected value for Combobox combo1-single-rtl");
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
			return checkKeyboardNavigationSingleSelection(remote, "combo2", true);
		},
		
		"keyboard navigation selectionMode = multiple": function () {
			var remote = this.remote;
			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}
			return checkKeyboardNavigationMultipleSelection(remote, "combo3");
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
		
		"mouse navigation selectionMode=single, autoFilter=false": function () {
			var remote = this.remote;
			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (/iOS|selendroid/.test(this.remote.environmentType.browserName)) {
				// The feature does work when testing in Safari/Mac, but it fails on sauce:
				// an unexpected question mark character gets appended into widget.inputNode.value,
				// thus for instance the test finds the label "France?" to be different than "France".
				return this.skip("skip mouse navigation testing on Safari/Mac and mobile for now");
			}
			return checkMouseNavigationSingleSelection(remote, "combo1");
		},
		
		"mouse navigation selectionMode=multiple": function () {
			var remote = this.remote;
			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (/iOS|selendroid/.test(this.remote.environmentType.browserName)) {
				// The feature does work when testing in Safari/Mac, but it fails on sauce:
				// an unexpected question mark character gets appended into widget.inputNode.value,
				// thus for instance the test finds the label "France?" to be different than "France".
				return this.skip("skip mouse navigation testing on Safari/Mac and mobile for now");
			}
			return checkMouseNavigationMultipleSelection(remote, "combo3");
		}
	});
});
