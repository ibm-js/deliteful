define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"dojo/_base/declare", // TODO: replace (when replacement confirmed)
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"dstore/Memory",
	"dstore/Observable",
	"deliteful/Select"
], function (dcl, registerSuite, assert, register, declare, domClass,
	Memory, Observable, Select, SelectSharedTests) {
	
	var container, MySelect;
	/*jshint multistr: true */
	var html = "<d-select id='select1' \
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
			item = select.store.add({
				text: "Option " + i,
				value: i,
				disabled: i == 5
			});
			dataItems.push(item);
		}
		return dataItems;
	};
	
	var removeOption = function (select, id) {
		select.store.remove(id);
	};
	
	var updateOption = function(select, id) {
		var dataItem = select.store.get(id);
		dataItem.text = "new text";
		select.store.put(dataItem);
	};
			
	var removeAllOptions = function (select) {
		select.renderItems = []; // TODO: is it normal that I need it?
		select.store.setData([]); // This bypasses the notification of Observable??
	};
	
	var checkSelect = function(select, observableStore) {
		// These checks are common to both cases: observable and non-observable stores
		
		assert.strictEqual(select.valueNode.length, 0,
			"Initially the select should be empty! (select.id: " + select.id + ")");
		
		var dataItems = addOptions(select, 0, nOptions - 1);
		
		if (!observableStore) {
			// With non-observable stores, adding items to the store does not
			// trigger an invalidation, hence:
			select.store = select.store;
		}
		select.validate();
		
		// Number of options
		assert.strictEqual(select.valueNode.length, nOptions,
			"Number of options after adding 10 options on select.id: " + select.id);
		
		// value
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value after adding 10 options on select.id: " + select.id);
			
		// selection API (delite/Select: selectedItem, selectedItems)
		// Initially:
		assert.equal(select.value, select.valueNode.value,
			"select.value after adding 10 options on select.id: " + select.id);
		// No item initially selected
		assert.isNull(select.selectedItem, 
			"select.selectedItem after adding 10 options on select.id: " + select.id);
		assert.strictEqual(select.selectedItems.length, 0, 
			"select.selectedItems after adding 10 options on select.id: " + select.id);
		
		// Select an element via delite/Selection's API
		select.setSelected(dataItems[0], true);
		// Or, equivalently:
		// select.setSelected(select.store.get(dataItems[0].id), true);
		
		select.validate();
		
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value after selecting dataItems[0] on select.id: " + select.id);
		assert.equal(select.selectedItem.value, 0,
			"select.selectedItem.value after selecting dataItems[0] on select.id: " + select.id);
		assert.equal(select.selectedItem.text, select.valueNode.options[0].text,
			"select.selectedItem.text after selecting dataItems[0] on select.id: " + select.id);
		assert.strictEqual(select.selectedItems.length, 1,
			"select.selectedItems.length after selecting dataItems[0] on select.id: " + select.id);
		assert.equal(select.selectedItems[0].value, 0,
			"select.selectedItems[0].value after selecting dataItems[0] on select.id: " + select.id);
		
		// Select another element via delite/Selection's API
		select.setSelected(dataItems[1], true);
		select.validate();
		
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value after selecting dataItems[1] on select.id: " + select.id);
		assert.equal(select.selectedItem.value, 1,
			"select.selectedItem.value after selecting dataItems[1] on select.id: " + select.id);
		assert.equal(select.selectedItem.text, select.valueNode.options[1].text,
			"select.selectedItem.text after selecting dataItems[1] on select.id: " + select.id);
		// selectionMode being "single", still one selected element
		assert.strictEqual(select.selectedItems.length, 1,
			"select.selectedItems.length after selecting dataItems[1] on select.id: " + select.id);
		assert.equal(select.selectedItems[0].value, 1,
			"select.selectedItems[0].value after selecting dataItems[0] on select.id: " + select.id);
		
		// Now check in multiple selection mode
		select.selectionMode = "multiple";
		select.setSelected(dataItems[0], true);
		select.setSelected(dataItems[1], true);
		select.validate();
		
		assert.strictEqual(select.value, select.valueNode.value,
			"select.value after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.equal(select.selectedItem.value, 0, // the value of the first selected option
			"select.selectedItem.value after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.equal(select.selectedItem.text, select.valueNode.options[0].text, // the text of the first selected option
			"select.selectedItem.text after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.strictEqual(select.selectedItems.length, 2,
			"select.selectedItems.length after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.equal(select.selectedItems[0].value, 0,
			"select.selectedItems[0].value after selecting dataItems[0] and [1] on select.id: " + select.id);
		assert.equal(select.selectedItems[1].value, 1,
			"select.selectedItems[1].value after selecting dataItems[0] and [1] on select.id: " + select.id);
		
		// Restore the initial selection state
		select.selectionMode = "single";
		select.setSelected(dataItems[0], false);
		select.setSelected(dataItems[1], false);
		select.validate();
	};
	
	var checkObservableSelect = function(select) {
		checkSelect(select, true);
		
		// The following additional checks are specific to observable stores:
		var dataItems = addOptions(select);
		select.validate();
		assert.strictEqual(select.valueNode.length, nOptions + 1,
			"After adding one more option on select.id: " + select.id);
		
		var idOfLastAdded = dataItems[dataItems.length - 1].id;
		updateOption(select, idOfLastAdded);
		select.validate();
		// Check that the corresponding DOM node has been updated accordingly 
		var lastOption = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(lastOption.text, "new text",
			"Update of data item (select.id: " + select.id + ")");
		
		removeOption(select, idOfLastAdded); // remove one option
		select.validate();
		assert.strictEqual(select.valueNode.length, nOptions,
			"After removing one option on select.id: " + select.id);
		
		// Test custom mapping (via delite/StoreMap)
		select.textAttr = "text1";
		select.valueAttr = "value1";
		select.disabledAttr = "disabled1";
		select.validate();
		var newDataItem1 = select.store.add({
			text1: "custom mapping",
			value1: 7,
			disabled1: false
		});
		
		select.validate();
		var optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, "7",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isFalse(!!optionWithCustomMapping.getAttribute("disabled"), // "false",
			"Custom mapping (disabled) (select.id: " + select.id + ")");
			
		// Once again with disabled at true
		var newDataItem2 = select.store.add({
			text1: "custom mapping2",
			value1: 8,
			disabled1: true
		});
		
		select.validate();
		optionWithCustomMapping = select.valueNode[select.valueNode.length - 1];
		assert.strictEqual(optionWithCustomMapping.text, "custom mapping2",
			"Custom mapping (text) (select.id: " + select.id + ")");
		assert.strictEqual(optionWithCustomMapping.value, "8",
			"Custom mapping (value) (select.id: " + select.id + ")");
		assert.isTrue(!!optionWithCustomMapping.getAttribute("disabled"), // "true",
			"Custom mapping (disabled) (select.id: " + select.id + ")");

		// Remove the newly added items
		select.store.remove(newDataItem1.id);
		select.store.remove(newDataItem2.id);
		
		// Restore the default mapping
		select.textAttr = "text";
		select.valueAttr = "value";
		select.disabledAttr = "disabled";
		select.validate();
	};
	
	var checkDefaultValues = function (select) {
		assert.isNotNull(select.store, 
			"After validation cycle, the default store should not be null on select.id: " +
			select.id);
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
			select.validate();
			assert.isTrue(domClass.contains(select, outerCSS),
				"Expecting " + outerCSS + 
				" CSS class on outer element of select.id: " + select.id);
			assert.isTrue(domClass.contains(select.valueNode, innerCSS),
				"Expecting " + innerCSS + 
				" CSS class on inner element of select.id: " + select.id);

			select = document.getElementById("myselect1");
			select.validate();
			assert.isTrue(domClass.contains(select, outerCSS),
				"Expecting " + outerCSS + 
				" CSS class on outer element of select.id: " + select.id);
			assert.isTrue(domClass.contains(select.valueNode, innerCSS),
				"Expecting " + innerCSS + 
				" CSS class on inner element of select.id: " + select.id);
		},
		
		"Default values" : function () {
			var select = document.getElementById("select1");
			select.validate();
			checkDefaultValues(select);
				
			select = document.getElementById("myselect1");
			select.validate();
			assert.isNotNull(select.store, 
				"After validation cycle, the default store should not be null on select.id: " +
				select.id);
		},
		
		"Store.add/remove/put (default store)" : function () {
			var select = document.getElementById("select1");
			select.validate();
			checkObservableSelect(select); // the default store is observable
			
			select = document.getElementById("myselect1");
			select.validate();
			checkObservableSelect(select); // the default store is observable
		},
		
		"Store.add/remove/put (user's observable Memory store)" : function () {
			var select = document.getElementById("select1");
			var store = new (declare([Memory, Observable]))({});
			select.store = store;
			select.validate();
			checkObservableSelect(select);
			
			select = document.getElementById("myselect1");
			store = new (declare([Memory, Observable]))({});
			select.store = store;
			select.validate();
			checkObservableSelect(select);
		},
		
		"Store.add (user's non-observable Memory store)" : function () {
			var select = document.getElementById("select1");
			var store = new (declare([Memory]))({});
			select.store = store;
			select.validate();
			checkSelect(select);
			
			select = document.getElementById("myselect1");
			store = new (declare([Memory]))({});
			select.store = store;
			select.validate();
			checkSelect(select);
		}
	};

	// Markup use-case
	
	var suite = {
		name: "deliteful/Select: markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register("my-select", [Select], {});
			register.parse();
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, CommonTestCases);

	registerSuite(suite);
	
	// Programatic creation 
	
	suite = {
		name: "deliteful/Select: programatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			
			MySelect = register("my-select-prog", [Select], {});
			
			var w = new Select({ id: "select1" });
			container.appendChild(w);
			w.startup();
			
			w = new MySelect({ id: "myselect1" });
			container.appendChild(w);
			w.startup();
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, CommonTestCases);

	registerSuite(suite);
});
