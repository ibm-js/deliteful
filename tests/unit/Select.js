define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"dstore/Memory",
	"dstore/Trackable",
	"deliteful/Select"
], function (dcl, registerSuite, assert, register, $,
	Memory, Trackable, Select) {

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var Store = Memory.createSubclass([Trackable], {});

	var container, MySelect;
	/*jshint multistr: true */
	var html = "<d-select id='select1'> \
			</d-select>\
			<my-select id='myselect1'> \
			</my-select>";
	
	var outerCSS = "d-select";
	var innerCSS = "d-select-inner";
	var nOptions = 10;
	
	var addOptions = function (select, min, max) {
		if (!min && !max) {
			min = select.valueNode.length + 1;
			max = min;
		}
		var dataItems = [];
		var item;
		for (var i = min; i <= max; i++) {
			item = select.source.addSync({
				text: "Option " + i,
				value: i,
				disabled: i === 5
			});
			dataItems.push(item);
		}
		
		var observe = select.observe(function (oldValues) {
			if ("value" in oldValues) {
				// Store the value for testing purposes
				select._notifiedSelectValue = select.value;
			}
		});
		select._notifiedSelectValue = null; // init
		select._observe = observe; // to be able to deliver
		
		return dataItems;
	};
	
	var removeOption = function (select, id) {
		select.source.removeSync(id);
	};
	
	var updateOption = function (select, id) {
		var source = select.source;
		var dataItem = source.getSync(id);
		dataItem.text = "new text";
		select.source.putSync(dataItem);
	};
	
	var checkSelect = function (select, observableSource) {
		// These checks are common to both cases: observable and non-observable sources
		
		assert.strictEqual(select.valueNode.length, 0,
			"Initially the select should be empty! (select.id: " + select.id + ")");
		
		var dataItems = addOptions(select, 0, nOptions - 1);
		
		if (!observableSource) {
			// With non-observable sources, adding items to the source does not
			// trigger an invalidation, hence:
			select.notifyCurrentValue("source");
		}
		select.deliver();
		
		// Number of options
		assert.strictEqual(select.valueNode.length, nOptions,
			"Number of options after adding 10 options on select.id: " + select.id);
		
		// selection API (delite/Select: selectedItem, selectedItems)
		// Initially:
		// value
		assert.strictEqual(select.value, "0",
			"select.value after adding 10 options on select.id: " + select.id);
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value equal to select.valueNode.value after adding 10 options on select.id: " +
			select.id);
		// By default, the first option is selected for a
		// single-select (none for a multi-select)
		assert.isNotNull(select.selectedItem,
			"select.selectedItem should not be null after adding 10 options on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.text, "Option 0",
			"select.selectedItem after adding 10 options on select.id: " + select.id);
		assert.strictEqual(select.selectedItems.length, 1,
			"select.selectedItems after adding 10 options on select.id: " + select.id);
		
		// Select an element via delite/Selection's API
		select.setSelected(dataItems[0], true);
		// Or, equivalently:
		// select.setSelected(select.source.getSync(dataItems[0].id), true);
		
		select.deliver();
		
		assert.strictEqual(select.value, "0",
			"select.value after selecting dataItems[0] on select.id: " +
			select.id);
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value equal to select.valueNode.value after selecting dataItems[0] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.value, 0,
			"select.selectedItem.value after selecting dataItems[0] on select.id: " + select.id);
		assert.strictEqual(select.selectedItem.text, select.valueNode.options[0].text,
			"select.selectedItem.text after selecting dataItems[0] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems.length, 1,
			"select.selectedItems.length after selecting dataItems[0] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems[0].value, 0,
			"select.selectedItems[0].value after selecting dataItems[0] on select.id: " +
			select.id);
		
		// Select another element via delite/Selection's API
		select.setSelected(dataItems[1], true);
		select.deliver();
		if (select._observe) {
			// select.deliver() calls computeProperties() etc. but not observer from addOptions()
			select._observe.deliver();
		}
		
		assert.strictEqual(select.value, "1",
			"select.value after selecting dataItems[1] on select.id: " +
			select.id);
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value equal to select.valueNode.value after selecting dataItems[1] on select.id: " +
			select.id);
		assert.strictEqual(select._notifiedSelectValue, "1",
			"select.value notified value after selecting dataItems[1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.value, 1,
			"select.selectedItem.value after selecting dataItems[1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.text, select.valueNode.options[1].text,
			"select.selectedItem.text after selecting dataItems[1] on select.id: " +
			select.id);
		// selectionMode being "single", still one selected element
		assert.strictEqual(select.selectedItems.length, 1,
			"select.selectedItems.length after selecting dataItems[1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems[0].value, 1,
			"select.selectedItems[0].value after selecting dataItems[0] on select.id: " +
			select.id);
		
		// Now check in multiple selection mode
		select.selectionMode = "multiple";
		select.setSelected(dataItems[0], true);
		select.setSelected(dataItems[1], true);
		select.deliver();
		if (select._observe) {
			// select.deliver() calls computeProperties() etc. but not observer from addOptions()
			select._observe.deliver();
		}
		
		assert.strictEqual(select.value, select.valueNode.value,
			"(multiple) select.value equal to select.valueNode.value after selecting " +
			"dataItems[0] and [1] on select.id: " + select.id);
		assert.strictEqual(select.value, "0", // the value of the first selected option
			"(multiple) select.value after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.strictEqual(select._notifiedSelectValue, "0",
			"(multiple) select.value notified value after selecting dataItems[0] and [1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.value, 0, // the value of the first selected option
			"(multiple) select.selectedItem.value after selecting dataItems[0] and [1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItem.text,
			select.valueNode.options[0].text, // the text of the first selected option
			"(multiple) select.selectedItem.text after selecting dataItems[0] and [1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems.length, 2,
			"(multiple) select.selectedItems.length after selecting dataItems[0] and [1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems[0].value, 0,
			"(multiple) select.selectedItems[0].value after selecting dataItems[0] and [1] on select.id: " +
			select.id);
		assert.strictEqual(select.selectedItems[1].value, 1,
			"(multiple) select.selectedItems[1].value after selecting dataItems[0] and [1] on select.id: " +
			select.id);
	};
	
	var checkTrackableSelect = function (select) {
		checkSelect(select, true);
		
		// The following additional checks are specific to trackable stores:
		var dataItems = addOptions(select);
		select.deliver();
		assert.strictEqual(select.valueNode.length, nOptions + 1,
			"After adding one more option on select.id: " + select.id);
		
		var idOfLastAdded = dataItems[dataItems.length - 1].id;
		updateOption(select, idOfLastAdded);
		select.deliver();
		// Check that the corresponding DOM node has been updated accordingly 
		var lastOption = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(lastOption.text, "new text",
			"Update of data item (select.id: " + select.id + ")");
		
		removeOption(select, idOfLastAdded); // remove one option
		select.deliver();
		assert.strictEqual(select.valueNode.length, nOptions,
			"After removing one option on select.id: " + select.id);
		
		// Test custom mapping (via delite/StoreMap)
		select.textAttr = "text1";
		select.valueAttr = "value1";
		select.disabledAttr = "disabled1";
		select.deliver();
		select.source.addSync({
			text1: "", // check handling of empty string for text
			value1: 7,
			disabled1: false
		});
		
		select.deliver();
		var optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, "7",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isFalse(!!optionWithCustomMapping.getAttribute("disabled"),
			"Custom mapping (disabled) (select.id: " + select.id + ")");
			
		// Once again with disabled at true (boolean) and text and value at empty string
		select.source.addSync({
			text1: "custom mapping",
			value1: "",
			disabled1: true
		});
		
		select.deliver();
		optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping",
			"Custom mapping (text) (select.id: " + select.id + ")");
		// Check that with dataItem.value = "", widget's value is "" as expected
		// and does not default to option's text.
		// dataItem.text
		assert.strictEqual(optionWithCustomMapping.value, "",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isTrue(!!optionWithCustomMapping.getAttribute("disabled"),
			"Custom mapping (disabled) (select.id: " + select.id + ")");
			
		// Now with disabled at "false" (string) and value at " "
		select.source.addSync({
			text1: "custom mapping3",
			value1: " ",
			disabled1: "false"
		});
		
		select.deliver();
		optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping3",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, " ",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isFalse(!!optionWithCustomMapping.getAttribute("disabled"),
			"Custom mapping (disabled) (select.id: " + select.id + ")");
		
		// Now with disabled at "true" (string)
		select.source.addSync({
			text1: "custom mapping4",
			value1: 10,
			disabled1: "true"
		});
		
		select.deliver();
		optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping4",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, "10",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isTrue(!!optionWithCustomMapping.getAttribute("disabled"),
			"Custom mapping (disabled) (select.id: " + select.id + ")");

		// Test custom mapping (via delite/StoreMap)
		select.textAttr = "text1";
		select.valueAttr = "value1";
		select.disabledAttr = "disabled1";
		select.deliver();
		select.source.addSync({
			text1: "custom mapping",
			value1: 7,
			disabled1: false
		});
		
		select.deliver();
		optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, "7",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isFalse(!!optionWithCustomMapping.getAttribute("disabled"),
			"Custom mapping (disabled) (select.id: " + select.id + ")");
	};
	
	var checkDefaultValues = function (select) {
		assert.isNull(select.source, "source default is null");
		assert.strictEqual(select.selectionMode, "single", "Select.selectionMode");
		assert.strictEqual(select.size, 0, "Select.size");
		assert.strictEqual(select.textAttr, "text", "Select.textAttr");
		assert.strictEqual(select.valueAttr, "value", "Select.valueAttr");
		assert.strictEqual(select.disabledAttr, "disabled", "Select.disabledAttr");
		assert.strictEqual(select.baseClass, outerCSS, "Select.baseClass");
	};
	
	var CommonTestCases = {
		"Default CSS" : function () {
			var select = document.getElementById("select1");
			select.deliver();
			assert.isTrue($(select).hasClass(outerCSS),
				"Expecting " + outerCSS +
				" CSS class on outer element of select.id: " + select.id);
			assert.isTrue($(select.valueNode).hasClass(innerCSS),
				"Expecting " + innerCSS +
				" CSS class on inner element of select.id: " + select.id);

			select = document.getElementById("myselect1");
			select.deliver();
			assert.isTrue($(select).hasClass(outerCSS),
				"Expecting " + outerCSS +
				" CSS class on outer element of select.id: " + select.id);
			assert.isTrue($(select.valueNode).hasClass(innerCSS),
				"Expecting " + innerCSS +
				" CSS class on inner element of select.id: " + select.id);
		},
		
		"Default values" : function () {
			var select = document.getElementById("select1");
			select.deliver();
			checkDefaultValues(select);
				
			select = document.getElementById("myselect1");
			select.deliver();
			assert.isNull(select.source, "source default is null");
		},
		
		"Store.add/remove/put (user's observable Memory store)" : function () {
			var select = document.getElementById("select1");
			var source = new Store();
			select.source = source;
			select.deliver();
			if (select._observe) {
				// select.deliver() calls computeProperties() etc. but not observer from addOptions()
				select._observe.deliver();
			}
			checkTrackableSelect(select); // the default source is observable
			
			select = document.getElementById("myselect1");
			source = new Store();
			select.source = source;
			select.deliver();
			if (select._observe) {
				// select.deliver() calls computeProperties() etc. but not observer from addOptions()
				select._observe.deliver();
			}
			checkTrackableSelect(select); // the default source is observable
		},
		
		"Store.add (user's non-observable Memory store)" : function () {
			var select = document.getElementById("select1");
			var source = new Memory({});
			select.source = source;
			select.deliver();
			checkSelect(select);
			
			select = document.getElementById("myselect1");
			source = new Memory({});
			select.source = source;
			select.deliver();
			checkSelect(select);
		}
	};

	// Markup use-case
	
	var suite = {
		name: "deliteful/Select: markup",
		setup: function () {
			register("my-select", [Select], {});
		},
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		},
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	mix(suite, CommonTestCases);

	registerSuite(suite);
	
	// Programatic creation 
	
	suite = {
		name: "deliteful/Select: programatic",
		setup: function () {
			MySelect = register("my-select-prog", [Select], {});
		},
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			
			var w = new Select({ id: "select1" });
			w.placeAt(container);
			
			w = new MySelect({ id: "myselect1" });
			w.placeAt(container);
		},
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	mix(suite, CommonTestCases);

	registerSuite(suite);
});
