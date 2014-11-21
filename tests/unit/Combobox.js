define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"dstore/Memory",
	"dstore/Trackable",
	"deliteful/list/List",
	"deliteful/Combobox",
	"deliteful/Store"
], function (dcl, registerSuite, assert, register, domClass,
	Memory, Trackable, List, Combobox) {
	
	var container, MyCombobox;
	
	/*jshint multistr: true */
	var html = "<d-store id=\"store\"> \
		{ \"label\": \"Option 0\", \"sales\": 500, \"profit\": 50, \"region\": \"EU\" }, \
		{ \"label\": \"Option 1\", \"sales\": 450, \"profit\": 48, \"region\": \"EU\" }, \
		{ \"label\": \"Option 2\", \"sales\": 700, \"profit\": 60, \"region\": \"EU\" }, \
		{ \"label\": \"Option 3\", \"sales\": 2000, \"profit\": 250, \"region\": \"America\" }, \
		{ \"label\": \"Option 4\", \"sales\": 600, \"profit\": 30, \"region\": \"America\" }, \
		{ \"label\": \"Option 5\", \"sales\": 450, \"profit\": 30, \"region\": \"America\" }, \
		{ \"label\": \"Option 6\", \"sales\": 500, \"profit\": 40, \"region\": \"Asia\" }, \
		{ \"label\": \"Option 7\", \"sales\": 900, \"profit\": 100, \"region\": \"Asia\" }, \
		{ \"label\": \"Option 8\", \"sales\": 500, \"profit\": 40, \"region\": \"EU\" }, \
		{ \"label\": \"Option 9\", \"sales\": 900, \"profit\": 100, \"region\": \"EU\" } \
		</d-store> \
		<d-combobox id=\"combo1\"> \
		<d-list righttextAttr=\"sales\" store=\"store\"></d-list> \
		</d-combobox> \
		<my-combobox id=\"mycombo1\"> \
		<d-list righttextAttr=\"sales\" store=\"store\"></d-list> \
		</my-combobox>";
	
	// Second variant to test attribute mapping for label
	
	/*jshint multistr: true */
	var htmlMappedAttr = "<d-store id=\"store\"> \
		{ \"name\": \"Option 0\", \"sales\": 500, \"profit\": 50, \"region\": \"EU\" }, \
		{ \"name\": \"Option 1\", \"sales\": 450, \"profit\": 48, \"region\": \"EU\" }, \
		{ \"name\": \"Option 2\", \"sales\": 700, \"profit\": 60, \"region\": \"EU\" }, \
		{ \"name\": \"Option 3\", \"sales\": 2000, \"profit\": 250, \"region\": \"America\" }, \
		{ \"name\": \"Option 4\", \"sales\": 600, \"profit\": 30, \"region\": \"America\" }, \
		{ \"name\": \"Option 5\", \"sales\": 450, \"profit\": 30, \"region\": \"America\" }, \
		{ \"name\": \"Option 6\", \"sales\": 500, \"profit\": 40, \"region\": \"Asia\" }, \
		{ \"name\": \"Option 7\", \"sales\": 900, \"profit\": 100, \"region\": \"Asia\" }, \
		{ \"name\": \"Option 8\", \"sales\": 500, \"profit\": 40, \"region\": \"EU\" }, \
		{ \"name\": \"Option 9\", \"sales\": 900, \"profit\": 100, \"region\": \"EU\" } \
		</d-store> \
		<d-combobox id=\"combo1\"> \
		<d-list labelAttr=\"name\" righttextAttr=\"sales\" store=\"store\"></d-list> \
		</d-combobox> \
		<my-combobox id=\"mycombo1\"> \
		<d-list labelAttr=\"name\" righttextAttr=\"sales\" store=\"store\"></d-list> \
		</my-combobox>";
				
	var outerCSS = "d-combobox";
	var innerCSS = "d-combobox-input";
	var nOptions = 10;
	
	var initCombobox = function (combo, trackable) {
		var TrackableMemoryStore = Memory.createSubclass(Trackable);
		combo.list.store = trackable ?
			new TrackableMemoryStore({}) : new Memory();
		var dataItems = addOptions(combo, 0, nOptions - 1);
		combo._testDataItems = dataItems; // Used by the test
		combo.startup();
		return combo;
	};
	
	var createCombobox = function (id, trackable, multiple) {
		var selectionMode = multiple ? "multiple" : "single";
		var combo = new Combobox({ id: id, selectionMode: selectionMode });
		initCombobox(combo, trackable);
		return combo;
	};
	
	var createMyCombobox = function (id, trackable) {
		var combo = new MyCombobox({ id: id });
		initCombobox(combo, trackable);
		return combo;
	};
	
	var addOptions = function (combo, min, max) {
		if (!min && !max) {
			min = combo.list.getItemRenderers().length + 1;
			max = min;
		}
		var dataItems = [];
		var item;
		var store = combo.list.store;
		for (var i = min; i <= max; i++) {
			item = store.addSync({
				label: "Option " + i
			});
			dataItems.push(item);
		}
		
		var observe = combo.observe(function (oldValues) {
			if ("value" in oldValues) {
				// Store the value for testing purposes
				combo._notifiedComboboxValue = combo.value;
			}
		});
		combo._notifiedComboboxValue = null; // init
		combo._observe = observe; // to be able to deliver
		
		combo.list.store = combo.list.store;
		return dataItems;
	};
	
	var checkCombobox = function (combo, trackableStore) {
		// These checks are common to both cases: trackable and non-trackable stores
		
		if (!trackableStore) {
			// With non-trackable stores, adding items to the store does not
			// trigger an invalidation, hence:
			combo.notifyCurrentValue("store");
		}
		combo.deliver();
		
		// Number of options
		assert.strictEqual(combo.list.getItemRenderers().length, nOptions,
			"Number of options after adding 10 options on combo.id: " + combo.id);
		
		// selection API of List
		// Initially:
		// value
		assert.strictEqual(combo.value, "Option 0",
			"combo.value after adding 10 options on combo.id: " + combo.id);
		assert.strictEqual(combo.value, combo.valueNode.value,
			"combo.value equal to combo.valueNode.value after adding 10 options on combo.id: " +
			combo.id);
		// By default, the first option is selected for a
		// single-choice (none for a multi-choice)
		assert.isNull(combo.list.selectedItem,
			"combo.list.selectedItem should be null after adding 10 options on combo.id: " +
			combo.id);
		assert.strictEqual(combo.list.selectedItems.length, 0,
			"combo.list.selectedItems after adding 10 options on combo.id: " + combo.id);

		var dataItems = combo._testDataItems; // Programmatic case
		if (!dataItems) {
			dataItems = combo.list.store.data; // Declarative case
		}
		
		// Select an element via delite/Selection's API
		combo.list.setSelected(dataItems[0], true);
		// Or, equivalently:
		// combo.list.setSelected(combo.list.store.getSync(dataItems[0].id), true);
		
		combo.deliver();
		combo.list.deliver();
		
		assert.strictEqual(combo.value, "Option 0",
			"combo.value after selecting dataItems[0] on combo.id: " +
			combo.id);
		assert.strictEqual(combo.value, combo.valueNode.value,
			"combo.value equal to combo.valueNode.value after selecting dataItems[0] on combo.id: " +
			combo.id);
		var dataObj = combo.list.selectedItem;
		var itemLabel = combo.list.labelFunc ?
			combo.list.labelFunc(dataObj) : dataObj[combo.list.labelAttr];
		assert.strictEqual(itemLabel, "Option 0",
			"label of combo.list.selectedItem after selecting dataItems[0] on combo.id: " + combo.id);
		assert.strictEqual(combo.list.selectedItems.length, 1,
			"combo.list.selectedItems.length after selecting dataItems[0] on combo.id: " +
			combo.id);
		dataObj = combo.list.selectedItems[0];
		itemLabel = combo.list.labelFunc ?
			combo.list.labelFunc(dataObj) : dataObj[combo.list.labelAttr];
		assert.strictEqual(itemLabel, "Option 0",
			"label of combo.list.selectedItems[0] after selecting dataItems[0] on combo.id: " +
			combo.id);
	};

	var checkDefaultValues = function (combo) {
		assert.strictEqual(combo.autoFilter, false, "combo.autoFilter");
		assert.strictEqual(combo.selectionMode, "single", "combo.selectionMode");
		assert.strictEqual(combo.baseClass, outerCSS, "combo.baseClass");
	};
	
	var CommonTestCases = {
		"Default CSS" : function () {
			var combo = document.getElementById("combo1");
			
			if (!combo) { // for the programmatic case 
				combo = createCombobox("combo1");
			} // else the declarative case
			
			combo.deliver();
			assert.isTrue(domClass.contains(combo, outerCSS),
				"Expecting " + outerCSS +
				" CSS class on outer element of combo.id: " + combo.id);
			assert.isTrue(domClass.contains(combo.valueNode, innerCSS),
				"Expecting " + innerCSS +
				" CSS class on inner element of combo.id: " + combo.id);

			combo = document.getElementById("mycombo1");
			
			if (!combo) { // for the programmatic case 
				combo = createMyCombobox("mycombo1");
			} // else the declarative case
			
			combo.deliver();
			assert.isTrue(domClass.contains(combo, outerCSS),
				"Expecting " + outerCSS +
				" CSS class on outer element of combo.id: " + combo.id);
			assert.isTrue(domClass.contains(combo.valueNode, innerCSS),
				"Expecting " + innerCSS +
				" CSS class on inner element of combo.id: " + combo.id);
		},
		
		"Default values" : function () {
			var combo = document.getElementById("combo1");
			
			if (!combo) { // for the programmatic case 
				combo = createCombobox("combo1");
			} // else the declarative case
			
			combo.deliver();
			checkDefaultValues(combo);
				
			combo = document.getElementById("mycombo1");
			
			if (!combo) { // for the programmatic case 
				combo = createMyCombobox("mycombo1");
			} // else the declarative case
			
			combo.deliver();
			checkDefaultValues(combo);
		}
	};

	// Markup use-case
	
	var suite = {
		name: "deliteful/Combobox: markup",
		setup: function () {
			register("my-combobox", [Combobox], {});
		},
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.parse(container);
		},
		afterEach: function () {
			container.parentNode.removeChild(container);
		},
		"Store.add/remove/put (custom element store)" : function () {
			var combo = document.getElementById("combo1");
			combo.deliver();
			checkCombobox(combo);
			
			combo = document.getElementById("mycombo1");
			combo.deliver();
			checkCombobox(combo);
		},
		"Attribute mapping for label" : function () {
			// Check the attribute mapping for label
			
			container.innerHTML = htmlMappedAttr;
			register.parse(container);
			
			var combo = document.getElementById("combo1");
			combo.deliver();
			checkCombobox(combo);
			
			combo = document.getElementById("mycombo1");
			combo.deliver();
			checkCombobox(combo);
		},
		
	};

	dcl.mix(suite, CommonTestCases);

	registerSuite(suite);
	
	// Programatic creation 

	suite = {
		name: "deliteful/Combobox: programatic",
		setup: function () {
			MyCombobox = register("my-combo-prog", [Combobox], {});
		},
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
		},
		
		"Store.add/remove/put (user's trackable Memory store)" : function () {
			// var combo = document.getElementById("combo1");
			var combo = createCombobox("combo1", true /* trackable */);
			combo.deliver();
			checkCombobox(combo);
			
			combo = createMyCombobox("mycombo1", true /* trackable */);
			combo.deliver();
			checkCombobox(combo);
		},
		
		"Store.add (user's non-trackable Memory store)" : function () {
			// var combo = document.getElementById("combo1");
			var combo = createCombobox("combo1", false /* trackable */);
			combo.deliver();
			checkCombobox(combo);
			
			combo = createMyCombobox("mycombo1", false /* trackable */);
			combo.deliver();
			checkCombobox(combo);
		},
		
		"Attribute mapping for label" : function () {
			// Check the attribute mapping for label
			
			var combo = new Combobox();
			var dataStore = new Memory(
				{idProperty: "name",
				data: [
					{ name: "France", sales: 500, profit: 50, region: "EU" },
					{ name: "Germany", sales: 450, profit: 48, region: "EU" },
					{ name: "UK", sales: 700, profit: 60, region: "EU" },
					{ name: "USA", sales: 2000, profit: 250, region: "America" },
					{ name: "Canada", sales: 600, profit: 30, region: "America" },
					{ name: "Brazil", sales: 450, profit: 30, region: "America" },
					{ name: "China", sales: 500, profit: 40, region: "Asia" },
					{ name: "Japan", sales: 900, profit: 100, region: "Asia" }
				]});
			combo.list.labelAttr = "name";
			combo.list.store = dataStore;
			combo.startup();
			combo.deliver();
			
			assert.strictEqual(combo.list.getItemRenderers().length, 8,
				"Number of options after adding 10 options on combo.id: " + combo.id);
			assert.strictEqual(combo.value, "France",
				"combo.value after adding 10 options on combo.id: " + combo.id);
		},
		
		"widget.value, and change and input events (selectionMode=single)": function () {
			var combo = createCombobox("combo1", false /* trackable */);
			var changeCounter = 0, inputCounter = 0;
			var changeValue = null, inputValue = null;
			combo.on("change", function () {
				changeCounter++;
				changeValue = combo.value;
			});
			combo.on("input", function () {
				inputCounter++;
				inputValue = combo.value;
			});
			combo.deliver();
			
			assert.strictEqual(changeCounter, 0,
				"There should be no change event after initialization, before interaction");
			assert.strictEqual(inputCounter, 0,
				"There should be no input event after initialization, before interaction");
			
			combo.openDropDown();
			
			assert.strictEqual(changeCounter, 0,
				"Just opening the dropdown should not emit any change event");
			assert.strictEqual(inputCounter, 0,
				"Just opening the dropdown should not emit any input event");
			
			var checkAfterClickItem = function (changeCounterExpectedValue, inputCounterExpectedValue,
				itemName, expectedValue) {
				assert.strictEqual(changeCounter, changeCounterExpectedValue,
					"After clicking " + itemName);
				assert.strictEqual(inputCounter, inputCounterExpectedValue,
					"After clicking " + itemName);
				changeCounter = 0; // reinit
				inputCounter = 0; // reinit
				assert.strictEqual(changeValue, expectedValue,
					"Wrong value when receiving change event after clicking " + itemName);
				assert.strictEqual(inputValue, expectedValue,
					"Wrong value when receiving input event after clicking " + itemName);
			};
			var item2 = combo.list.getItemRenderers()[2];
			item2.click();
			
			var d = this.async(1000);
			setTimeout(d.rejectOnError(function () {
				checkAfterClickItem(1, 1, "item 2", "Option 2");
				combo.openDropDown(); // reopen
				var item3 = combo.list.getItemRenderers()[3];
				item3.click();
				setTimeout(d.callback(function () {
					checkAfterClickItem(1, 1, "item 3", "Option 3");
				}));
			}));
			return d;
		},
		
		"widget.value, and change and input events (selectionMode=multiple)": function () {
			var combo = createCombobox("combo1", false /* trackable */, true /* selectionMode=multiple */);
			var changeCounter = 0, inputCounter = 0;
			var changeValue = null, inputValue = null;
			combo.on("change", function () {
				changeCounter++;
				changeValue = combo.value;
			});
			combo.on("input", function () {
				inputCounter++;
				inputValue = combo.value;
			});
			combo.deliver();
			
			assert.strictEqual(changeCounter, 0,
				"There should be no change event after initialization, before interaction");
			assert.strictEqual(inputCounter, 0,
				"There should be no input event after initialization, before interaction");
			
			combo.openDropDown();
			
			assert.strictEqual(changeCounter, 0,
				"Just opening the dropdown should not emit any change event");
			assert.strictEqual(inputCounter, 0,
				"Just opening the dropdown should not emit any input event");
			
			var checkAfterClickItem = function (changeCounterExpectedValue, inputCounterExpectedValue,
				itemName, expectedChangeValue, expectedInputValue) {
				assert.strictEqual(inputCounter, inputCounterExpectedValue,
					"After clicking " + itemName);
				assert.strictEqual(changeCounter, changeCounterExpectedValue,
					"After clicking " + itemName);
				assert.deepEqual(changeValue, expectedChangeValue,
					"Wrong value when receiving change event after clicking " + itemName);
				assert.deepEqual(inputValue, expectedInputValue,
					"Wrong value when receiving input event after clicking " + itemName);
			};
			var item2 = combo.list.getItemRenderers()[2];
			item2.click();
			
			var d = this.async(1000);
			setTimeout(d.rejectOnError(function () {
				checkAfterClickItem(0, 1, "item 2", null, ["Option 2"]);
				combo.closeDropDown(); // this commits the change
				combo.openDropDown(); // reopen
				setTimeout(d.rejectOnError(function () {
					checkAfterClickItem(1, 1, "item 2", ["Option 2"], ["Option 2"]);
					var item3 = combo.list.getItemRenderers()[3];
					item3.click();
					setTimeout(d.rejectOnError(function () {
						checkAfterClickItem(1, 2, "item 3", ["Option 2"], ["Option 3", "Option 2"]);
						combo.closeDropDown(); // this commits the change
						setTimeout(d.callback(function () {
							checkAfterClickItem(2, 2, "item 3", ["Option 3", "Option 2"], ["Option 3", "Option 2"]);
						}));
					}));
				}));
			}));
			return d;
		},
		
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, CommonTestCases);

	registerSuite(suite);
});
