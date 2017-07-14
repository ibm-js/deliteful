define([
	"intern",
	"intern!object",
	"dojo/string",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, string, pollUntil, assert, keys, require) {
	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
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

	var checkFilter = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.execute(executeExpr)
			.then(function (comboState) {
				// No item should be selected, the popup is closed initially.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						popupInputNodeValue: "",
						widgetValue: "France",
						valueNodeValue: "France",
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
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr) // when the popup opens, focus goes on list's first item.
			.then(function (comboState) {
				// Clicking the root node just opens the ComboPopup. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						popupInputNodeValue: "France",
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
			.findByCssSelector(".d-combo-popup .d-combobox-input[d-hidden='false']")
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
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "jap",
						popupInputNodeValue: "jap",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30,
						inputEventCounter: 1, // removed "france" and typed "jap"
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: "",
						valueNodeValueAtLatestInputEvent: "",
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
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
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
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
					}, "after deleting the filter.");
			})
			.type("u")
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "u",
						popupInputNodeValue: "u",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 2, // USA & UK
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: "",
						valueNodeValueAtLatestInputEvent: "",
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after typed `u` into input field.");
			})
			.end();
	};

	var checkListInPopup = function (remote, comboId, hasFilterInput, isMultiSelect) {
		return loadFile(remote, "./ComboPopup.html")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()
			.sleep(500) // wait for List's loading panel to go away

			// Get the ComboPopup's <input>'s id...
			.findByCssSelector("#" + comboId + "_dropdown input").getAttribute("id").then(function (inputId) {
				// And then get the <label> pointing to that <input>...
				return remote.findByCssSelector("#" + comboId + "_dropdown label[for=" + inputId + "]")
					.getVisibleText().then(function (popupLabel) {
						// And then make sure it matches the Combobox's label.
						return remote.findByCssSelector("label[for=" + comboId + "-input]")
							.getVisibleText().then(function (comboLabel) {
								assert.strictEqual(popupLabel, comboLabel.trim(), "expected label");
							}).end();
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

			.findByCssSelector(".d-combo-popup .d-combobox-input[d-hidden='" + !hasFilterInput + "']")
			.end()
			.findByCssSelector(".d-combo-popup .d-linear-layout[d-hidden='" + !isMultiSelect + "']")
			.end();
	};

	var checkSingleSelection = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the popup is closed initially
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						popupInputNodeValue: "", // popup closed
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
					}, "before open");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the first click just opens the dropdown.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						popupInputNodeValue: "France",
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
			.findById(comboId + "_item1") // "Germany"
			.click()
			.sleep(500) // wait for popup to close
			.execute(executeExpr)
			.then(function (comboState) {
				// The click on the first option does not change the state because it is a category
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "Germany",
						popupInputNodeValue: "", // popup closed
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

	var checkMultiSelection = function (remote, comboId, pressOkButton) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
						widgetValue: [],
						valueNodeValue: "",
						opened: false,
						selectedItemsCount: 0,
						itemRenderersCount: 0,
						inputEventCounter: 0, // no event so far
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "before open");
			})
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()
			.sleep(500) // wait for List's loading panel to go away
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
						widgetValue: [],
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 37,
						inputEventCounter: 0, // no event so far
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after click on root node");
			})
			.findById(comboId + "_item1").click().end() // "Germany"
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "Germany",
						widgetValue: ["Germany"],
						valueNodeValue: "Germany",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 37,
						inputEventCounter: 1,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: ["Germany"],
						valueNodeValueAtLatestInputEvent: "Germany",
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after clicking option (Germany)");
			})
			.findById(comboId + "_item6").click().end() // "China"
			.sleep(500) // wait for popup to close
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["China", "Germany"],
						valueNodeValue: "China,Germany",
						opened: true,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 1,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: ["China", "Germany"],
						valueNodeValueAtLatestInputEvent: "China,Germany",
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after clicking option (China)");
			})
			.sleep(10)
			.findByCssSelector(pressOkButton ? ".d-combo-ok-button" : ".d-combo-cancel-button").click().end()
			.sleep(500) // wait for the async closing of the popup
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState, pressOkButton ?
					{ // expected combo state
						inputNodeValue: string.substitute(comboState.multipleChoiceMsg, {items: 2}),
						widgetValue: ["China", "Germany"],
						valueNodeValue: "China,Germany",
						opened: false,
						selectedItemsCount: 2,
						itemRenderersCount: 37,
						inputEventCounter: 0, // unchanged
						changeEventCounter: 1, // incremented
						widgetValueAtLatestInputEvent: ["China", "Germany"],
						valueNodeValueAtLatestInputEvent: "China,Germany",
						widgetValueAtLatestChangeEvent: ["China", "Germany"],
						valueNodeValueAtLatestChangeEvent: "China,Germany"
					} : { // expected combo state
						inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
						widgetValue: [],
						valueNodeValue: "",
						opened: false,
						selectedItemsCount: 0,
						itemRenderersCount: 37,
						inputEventCounter: 1,
						changeEventCounter: 1, // incremented
						widgetValueAtLatestInputEvent: [],
						valueNodeValueAtLatestInputEvent: "",
						widgetValueAtLatestChangeEvent: [],
						valueNodeValueAtLatestChangeEvent: ""
					}, "after clicking on the " + (pressOkButton ? "Ok" : "cancel") + " button (close)");
			});
	};

	var checkTabNavigation = function (remote, comboId) {
		return loadFile(remote, "./ComboPopup.html")
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(500)
			.setFindTimeout(intern.config.WAIT_TIMEOUT)
			.findByXpath("//d-combo-popup")
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.match(value, /^France/, "initial focus");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.match(value, /^Cancel/, "after first TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.match(value, /^OK/, "after second TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.match(value, /^France/, "after third TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert.match(value, /^Cancel/, "after forth TAB");
			})
			.end();
	};

	var checkFocus = function (remote, comboId, autoFilter) {
		return loadFile(remote, "./ComboPopup.html")
			.findByCssSelector("#" + comboId + " .d-combobox-arrow").click().end()
			.sleep(500)
			.setFindTimeout(intern.config.WAIT_TIMEOUT)
			.findByXpath("//d-combo-popup")
			.getActiveElement()
			.then(function (node) {
				return node.getTagName().then(function (value) {
					if (autoFilter) {
						assert.strictEqual(value, "input", "input node should be focused");
					} else {
						assert.strictEqual(value, "d-list-item-renderer", "a d-list node should be focused");
					}
				});
			});
	};

	var checkAutoCompleteFilteringWithThreeFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
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
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(250)
			.execute(executeExpr) // when the popup opens, focus goes into the inputNode.
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 0,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined, // never received
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after click on root node");
			})
			.findByCssSelector("#" + comboId + "_dropdown")  // context for all following findByCssSelector() calls
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys("j")
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "j",
						popupInputNodeValue: "j",
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
					}, "after typing `j` - no query run yet.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='false']") // list not visible
			.then(function (list) {
				assert.isNotNull(list, "list should be invisible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys("a")
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "ja",
						popupInputNodeValue: "ja",
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
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "jap",
						popupInputNodeValue: "jap",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30, // showing only `jap` matching items.
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after typing `jap` - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list should be visible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing one chars, list must disappear.
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "ja",
						popupInputNodeValue: "ja",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30, // showing only `jap` matching items.
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after deleting `p` from `jap` - query did not run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='false']") // list not visible
			.then(function (list) {
				assert.isNotNull(list, "list should be visible at this stage.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing remaining two chars, list must disappear.
			.pressKeys(keys.BACKSPACE)
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30, // showing only `jap` matching items.
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after deleting `ja` from the inputNode - query did not run.");
			})
			.isDisplayed() // check if popup is still visible.
			.then(function (isVisible) {
				assert.isTrue(isVisible, "popup must be visible at this stage.");
			})
			.end();
	};

	var checkAutoCompleteFilteringWithZeroFilterChars = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
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
			.findByCssSelector("#" + comboId + " .d-combobox-input").click().end()
			.sleep(250)
			.execute(executeExpr) // when the popup opens, focus goes to the inputNode.
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
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
			.findByCssSelector("#" + comboId + "_dropdown") // context for all following findByCssSelector() calls
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys("j")
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "j",
						popupInputNodeValue: "j",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after typing `j` - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #1");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys("a")
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "ja",
						popupInputNodeValue: "ja",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 30,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after typing `a` (ja) - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #2");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys(keys.BACKSPACE) // removing two chars, get full list
			.pressKeys(keys.BACKSPACE)
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 37,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after deleting `ja` from the inputNode - full list shown.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list should be visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #3");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys("g") // 'Germany' item visible
			.end()
			.sleep(100)
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "g",
						popupInputNodeValue: "g",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 1, // showing only `g` matching items.
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
					}, "after typing `g` from the inputNode - query did run.");
			})
			.findByCssSelector(".d-combobox-list[d-shown='true']") // list visible
			.then(function (list) {
				assert.isNotNull(list, "list visible #4.");
			})
			.end()
			.findByCssSelector(".d-combobox-input[d-hidden='false']") // inputNode
			.pressKeys(keys.BACKSPACE) // erase "g", list still visible
			.end()
			.sleep(250)
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "",
						popupInputNodeValue: "",
						widgetValue: "",
						valueNodeValue: "",
						opened: true,
						selectedItemsCount: 0,
						itemRenderersCount: 37,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: undefined,
						valueNodeValueAtLatestInputEvent: undefined,
						widgetValueAtLatestChangeEvent: undefined,
						valueNodeValueAtLatestChangeEvent: undefined
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
		name: "ComboPopup - functional",

		setup: function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				return this.skip("ComboPopup broken on IE");
			}
		},

		readonly: function () {
			// Since clicking the Combobox opens the ComboPopup, the Combobox's <input> should be readonly.
			return loadFile(this.remote, "./ComboPopup.html").execute(function () {
				return document.getElementById("combo2").inputNode.readOnly;
			}).then(function (value) {
				assert(value, "readonly");
			});
		},

		"list in popup (combo1)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo1", false, false);
		},

		"list in popup (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo2", true, false);
		},

		"list in popup (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo3", false, true);
		},

		"filtering (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support");
			}

			return checkFilter(remote, "combo2");
		},

		"single selection (combo1)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkSingleSelection(remote, "combo1");
		},

		"single selection (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkSingleSelection(remote, "combo2");
		},

		"multi selection (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkMultiSelection(remote, "combo3", true);
		},

		"multi selection cancel button (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkMultiSelection(remote, "combo3", false);
		},

		"tab navigation (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.browserName === "safari" || remote.environmentType.brokenSendKeys ||
				!remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkTabNavigation(remote, "combo3");
		},

		"check focused element (combo1)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.browserName === "safari" || remote.environmentType.brokenSendKeys ||
				!remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkFocus(remote, "combo1", false);
		},

		"check focused element (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.browserName === "safari" || remote.environmentType.brokenSendKeys ||
				!remote.environmentType.nativeEvents) {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkFocus(remote, "combo2", true);
		},

		// TODO: merge this into checkAutoCompleteFilteringWithThreeFilterChars().
		"aria-expanded": function () {
			return loadFile(this.remote, "./ComboPopup.html")
				.findByCssSelector("#combo4 .d-combobox-input").click().end()
				.sleep(500) // wait for List's loading panel to go away
				.findByCssSelector("#combo4_dropdown input").getAttribute("aria-expanded").then(function (value) {
					assert.strictEqual(value, "false", "initially not expanded");
				}).end()
				.findByCssSelector("#combo4_dropdown input").type("jap").end()
				.sleep(500)
				.findByCssSelector("#combo4_dropdown input").getAttribute("aria-expanded").then(function (value) {
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
