define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {
	
	// TODO: add more test cases
	
	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};
	
	// Check the state of the widget after selecting options using the keyboard.
	var checkKeyboardNavigationSingleSelection = function (remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget.
		var executeExpr = "return {" +
			"displayedLabel: " + comboId + ".inputNode.value, " +
			"value: " + comboId + ".value, " +
			"valueNodeValue: " + comboId + ".valueNode.value " +
			"};";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus(); " + executeExpr)
			.then(function (value) {
				// The first option is initially selected by default
				assert.strictEqual(value.displayedLabel, "France",
					"(single) after focus, " + comboId + ".inputNode.value");
				assert.strictEqual(value.value, "France",
					"(single) after focus, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "France",
					"(single) after focus, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// The first option should still be the one selected,
				// the first ARROW_DOWN only opens the dropdown.
				assert.strictEqual(value.displayedLabel, "France",
					"(single) first ARROW_DOWN, " + comboId + ".inputNode.value");
				assert.strictEqual(value.value, "France",
					"(single) first ARROW_DOWN, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "France",
					"(single) first ARROW_DOWN, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// Now the second option should be selected
				assert.strictEqual(value.displayedLabel, "Germany",
					"(single) after second ARROW_DOWN, " + comboId + ".inputNode.value");
				assert.strictEqual(value.value, "Germany",
					"(single) after second ARROW_DOWN, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "Germany",
					"(single) after second ARROW_DOWN, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.ARROW_UP)
			.execute(executeExpr)
			.then(function (value) {
				// Now the first option should be selected again
				assert.strictEqual(value.displayedLabel, "France",
					"(single) after second ARROW_DOWN, " + comboId + ".inputNode.value");
				assert.strictEqual(value.value, "France",
					"(single) after second ARROW_DOWN, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "France",
					"(single) after second ARROW_DOWN, " + comboId + ".valueNode.value");
			});
	};
	
	var checkKeyboardNavigationMultipleSelection = function (remote, comboId) {
		// Expression executed in the browser for collecting data allowing to
		// check the state of the widget.
		var executeExpr = "return {" +
			"displayedLabel: " + comboId + ".inputNode.value, " +
			"value: " + comboId + ".value, " +
			"valueNodeValue: " + comboId + ".valueNode.value, " +
			"multipleChoiceNoSelectionMsg: " + comboId + ".multipleChoiceNoSelectionMsg" +
			"};";
		return loadFile(remote, "./Combobox-decl.html")
			.execute(comboId + ".focus(); " + executeExpr)
			.then(function (value) {
				// In a multiple-select no option is selected initially
				// (holds for the widget's delite/Selection API just as for the
				// native select).
				assert.strictEqual(value.displayedLabel, value.multipleChoiceNoSelectionMsg,
					"(multiple) after focus, " + comboId + ".inputNode.value");
				assert.deepEqual(value.value, [],
					"(multiple) after focus, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "",
					"(multiple) after focus, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// For now there should still be no option selected, the first
				// ARROW_DOWN only opens the dropdown
				assert.strictEqual(value.displayedLabel, value.multipleChoiceNoSelectionMsg,
					"(multiple) after first ARROW_DOWN, " + comboId + ".inputNode.value");
				assert.deepEqual(value.value, [],
					"(multiple) after first ARROW_DOWN, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "",
					"(multiple) after first ARROW_DOWN, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.ARROW_DOWN)
			.execute(executeExpr)
			.then(function (value) {
				// Still no selection after the second ARROW_DOWN; in multiple
				// mode it only changes the navigated/highlighted item of the List.
				assert.strictEqual(value.displayedLabel, value.multipleChoiceNoSelectionMsg,
					"(multiple) after second ARROW_DOWN, " + comboId + ".inputNode.value");
				assert.deepEqual(value.value, [],
					"(multiple) after second ARROW_DOWN, " + comboId + ".value");
				assert.strictEqual(value.valueNodeValue, "",
					"(multiple) after first ARROW_DOWN, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.SPACE) // toggles selection state of the navigated item
			.execute(executeExpr)
			.then(function (value) {
				// Now the first item should be selected
				assert.strictEqual(value.displayedLabel, "France",
					"(multiple) after first SPACE, " + comboId + ".inputNode.value");
				assert.deepEqual(value.value, ["France"],
					"(multiple) after first SPACE, " + comboId + ".value");
				assert.deepEqual(value.valueNodeValue, "France",
					"(multiple) after first SPACE, " + comboId + ".valueNode.value");
			})
			.pressKeys(keys.SPACE) // toggles the navigated item back to unselected state
			.execute(executeExpr)
			.then(function (value) {
				// Now there should be no selection again
				assert.strictEqual(value.displayedLabel, value.multipleChoiceNoSelectionMsg,
					"(multiple) after second SPACE, " + comboId + ".inputNode.value");
				assert.deepEqual(value.value, [],
					"(multiple) after second SPACE, " + comboId + ".value");
				assert.deepEqual(value.valueNodeValue, "",
					"(multiple) after second SPACE, " + comboId + ".valueNode.value");
			});
	};
	
	registerSuite({
		name: "Combobox - functional",

		"Combobox Form submit": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
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
		
		"keyboard navigation selectionMode = single": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/safari|iOS|selendroid/.test(this.remote.environmentType.browserName)) {
				// The feature does work when testing in Safari/Mac, but it fails on sauce:
				// an unexpected question mark character gets appended into widget.inputNode.value,
				// thus for instance the test finds the label "France?" to be different than "France".
				return this.skip("skip keyboard navigation testing on Safari/Mac and mobile for now");
			}
			return checkKeyboardNavigationSingleSelection(remote, "combo1");
		},
		
		"keyboard navigation selectionMode = multiple": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			if (/safari|iOS|selendroid/.test(remote.environmentType.browserName)) {
				// The feature does work when testing in Safari/Mac, but it fails on sauce:
				// an unexpected question mark character gets appended into widget.inputNode.value,
				// thus for instance the test finds the label "France?" to be different than "France".
				return this.skip("skip keyboard navigation testing on Safari/Mac and mobile for now");
			}
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkKeyboardNavigationMultipleSelection(remote, "combo3");
		}
	});
});
