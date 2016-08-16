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
			selectionMode + " combo.itemRenderersCount " + stepName);

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

	var checkFilter = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.findById(comboId)
			.execute(executeExpr)
			.then(function (comboState) {
				// No item should be selected, the popup is closed initially.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						widgetValue: "France",
						valueNodeValue: "France",
						opened: false,
						selectedItemsCount: 1,
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
			.end()
			.execute(executeExpr) // when the popup opens, focus goes on list's first item.
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
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
			.findByCssSelector(".d-combo-popup .d-linear-layout .d-combobox-input[d-hidden='false']")
			.type("j")
			.type("a")
			.type("p")
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						widgetValue: "France",
						valueNodeValue: "France",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 30,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: null, // never received
						valueNodeValueAtLatestInputEvent: null,
						widgetValueAtLatestChangeEvent: null,
						valueNodeValueAtLatestChangeEvent: null
					}, "after searching `jap` into input field.");
			})
			.pressKeys(keys.BACKSPACE) // Delete the 5 chars of "Japan"
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
						inputNodeValue: "France",
						widgetValue: "France",
						valueNodeValue: "France",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 37,
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: null, // never received
						valueNodeValueAtLatestInputEvent: null,
						widgetValueAtLatestChangeEvent: null,
						valueNodeValueAtLatestChangeEvent: null
					}, "after deleting the filter.");
			})
			.type("u")
			.sleep(500)
			.execute(executeExpr)
			.then(function (comboState) {
				// Clicking the root node just opens the dropdown. No other state change.
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: "France",
						widgetValue: "France",
						valueNodeValue: "France",
						opened: true,
						selectedItemsCount: 1,
						itemRenderersCount: 2, // USA & UK
						inputEventCounter: 0,
						changeEventCounter: 0,
						widgetValueAtLatestInputEvent: null, // never received
						valueNodeValueAtLatestInputEvent: null,
						widgetValueAtLatestChangeEvent: null,
						valueNodeValueAtLatestChangeEvent: null
					}, "after typed `u` into input field.");
			})
			.end();
	};

	var checkListInPopup = function (remote, comboId, hasFilterInput, isMultiSelect) {
		var label = null;
		return loadFile(remote, "./ComboPopup.html")
			.findById(comboId)
			.click()
			.sleep(500) // wait for List's loading panel to go away
			.end()
			.findByCssSelector("#" + comboId + "_dropdown_wrapper .d-combo-popup .d-combo-popup-header")
				.getVisibleText()
				.then(function (value) {
					label = value;
				})
			.end()
			.findByCssSelector("label[for='" + comboId + "-input']")
				.getVisibleText()
				.then(function (value) {
					assert.strictEqual(value, label);
					label = null;
				})
			.end()
			.findByXpath("//d-combo-popup//d-list//div//d-list-item-renderer[7]")
				.getVisibleText()
				.then(function (value) {
					assert(/^China/.test(value), "item rendender #8 : " + value);
				})
			.end()
			.findByCssSelector(".d-combo-popup .d-linear-layout .d-combobox-input[d-hidden='" + !hasFilterInput + "']")
			.end()
			.findByCssSelector(".d-combo-popup .d-linear-layout .d-linear-layout[d-hidden='" + !isMultiSelect + "']")
			.end();
	};

	var checkSingleSelection = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
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
			.findById(comboId + "_item1") // "Germany"
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


	var checkMultiSelection = function (remote, comboId) {
		var executeExpr = "return getComboState(\"" + comboId + "\");";
		return loadFile(remote, "./ComboPopup.html")
			.findById(comboId)
			.execute(executeExpr)
			.then(function (comboState) {
				// The first option should be the one selected,
				// the popup is closed initially
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceNoSelectionMsg,
						widgetValue: [],
						valueNodeValue: "",
						opened: false,
						selectedItemsCount: 0,
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
			.end()
			.findById(comboId + "_item1") // "Germany"
			.click()
			.sleep(500) // wait for popup to close
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
					}, "after clicking option (Germany))");
			})
			.end()
			.findById(comboId + "_item6") // "China"
			.click()
			.sleep(500) // wait for popup to close
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceMsg,
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
						valueNodeValueAtLatestChangeEvent: undefined,
					}, "after clicking option (China))");
			})
			.end()
			.findByCssSelector(".d-combo-ok-button")
			.click()
			.sleep(500) // wait for the async closing of the popup
			.execute(executeExpr)
			.then(function (comboState) {
				checkComboState(comboId, comboState,
					{ // expected combo state
						inputNodeValue: comboState.multipleChoiceMsg,
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
					}, "after clicking again the root node (close)");
			})
			.end();
	};

	var checkTabNavigation = function (remote, comboId) {
		return loadFile(remote, "./ComboPopup.html")
			.findById(comboId)
			.click()
			.sleep(500)
			.end()
			.setFindTimeout(intern.config.WAIT_TIMEOUT)
			.findByXpath("//d-combo-popup")
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert(/^Cancel/.test(value), "after first TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert(/^OK/.test(value), "after second TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert(/^France/.test(value), "after third TAB");
			})
			.pressKeys(keys.TAB)
			.getActiveElement()
			.getVisibleText()
			.then(function (value) {
				assert(/^Cancel/.test(value), "after forth TAB");
			})
			.end();
	};

	registerSuite({
		name: "ComboPopup - functional",

		"list in popup (combo1)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo1", false, false);
		},

		"list in popup (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo2", true, false);
		},

		"list in popup (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkListInPopup(remote, "combo3", false, true);
		},

		"filtering (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.broserName === "safari") {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkFilter(remote, "combo2");
		},

		"single selection (combo1)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkSingleSelection(remote, "combo1");
		},

		"single selection (combo2)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkSingleSelection(remote, "combo2");
		},

		"multi selection selection (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS") {
				// https://github.com/theintern/leadfoot/issues/61
				return this.skip("click() doesn't generate touchstart/touchend, so popup won't open");
			}

			return checkMultiSelection(remote, "combo3");
		},

		"tab navigation (combo3)": function () {
			var remote = this.remote;

			if (remote.environmentType.browserName === "internet explorer") {
				// https://github.com/theintern/leadfoot/issues/17
				return this.skip("click() doesn't generate mousedown/mouseup, so popup won't open");
			}
			if (remote.environmentType.platformName === "iOS" || remote.environmentType.safari ||
				remote.environmentType.broserName === "safari") {
				return this.skip("no keyboard support - brokenSendKeys");
			}

			return checkTabNavigation(remote, "combo3");
		}
	});
});
