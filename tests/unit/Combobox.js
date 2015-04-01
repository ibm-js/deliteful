define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"decor/sniff",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"dstore/Memory",
	"dstore/Trackable",
	"deliteful/list/List",
	"deliteful/Combobox",
	"deliteful/Store"
], function (dcl, registerSuite, assert, has, register, $,
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

	// For testing the ability to deal with item value different than item label
	var dataStoreWithValue = new Memory({
		idProperty: "label",
		data: [
			{ label: "France", myValue: "FR", sales: 500, profit: 50, region: "EU" },
			{ label: "Germany", myValue: "DE", sales: 450, profit: 48, region: "EU" },
			{ label: "UK", myValue: "UK", sales: 700, profit: 60, region: "EU" },
			{ label: "USA", myValue: "US", sales: 2000, profit: 250, region: "America" },
			{ label: "Canada", myValue: "CA", sales: 600, profit: 30, region: "America" },
			{ label: "Brazil", myValue: "BA", sales: 450, profit: 30, region: "America" },
			{ label: "China", myValue: "CN", sales: 500, profit: 40, region: "Asia" },
			{ label: "Japan", myValue: "JP", sales: 900, profit: 100, region: "Asia" }
		]
	});

	var outerCSS = "d-combobox";
	var inputCSS = "d-combobox-input";
	var hiddenInputCSS = "d-hidden";
	var nOptions = 10;

	var initCombobox = function (combo, trackable) {
		var TrackableMemoryStore = Memory.createSubclass(Trackable);
		combo.list.store = trackable ?
			new TrackableMemoryStore({}) : new Memory();
		var dataItems = addOptions(combo, 0, nOptions - 1);
		combo._testDataItems = dataItems; // stored for debugging purposes.
		return combo;
	};

	var createCombobox = function (id, trackable, multiple) {
		var selectionMode = multiple ? "multiple" : "single";
		var combo = new Combobox({ id: id, selectionMode: selectionMode });
		initCombobox(combo, trackable);
		container.appendChild(combo);
		combo.attachedCallback();
		combo.deliver();
		return combo;
	};

	var createMyCombobox = function (id, trackable) {
		var combo = new MyCombobox({ id: id });
		initCombobox(combo, trackable);
		container.appendChild(combo);
		combo.attachedCallback();
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

	var checkCombobox = function (combo, test, trackableStore) {
		// These checks are common to both cases: trackable and non-trackable stores
		combo.deliver();

		if (!trackableStore) {
			// With non-trackable stores, adding items to the store does not
			// trigger an invalidation, hence:
			combo.notifyCurrentValue("store");
		}

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
		// By default, the first option is selected for a single-choice (none for a multi-choice)
		assert.isNotNull(combo.list.selectedItem,
				"combo.list.selectedItem should not be null after adding 10 options on combo.id: " +
				combo.id);
		assert.strictEqual(combo.list.selectedItem.label, "Option 0",
				"combo.list.selectedItem.label after adding 10 options on combo.id: " +
				combo.id);
		assert.strictEqual(combo.list.selectedItems.length, 1,
				"combo.list.selectedItems after adding 10 options on combo.id: " + combo.id);

		var d = test.async(1000);

		combo.openDropDown().then(d.rejectOnError(function () {
			var item2 = combo.list.getItemRenderers()[2];
			item2.click();

			// Higher than the 100 delay of Combobox' defer when closing the dropdown
			var delay = 200;
			setTimeout(d.callback(function () {
				assert.strictEqual(combo.valueNode.value, "Option 2",
						"item2.item.label: " + item2.item.label +
							" combo.valueNode.value after selecting item2 on combo.id: " +
						combo.id + " selectionMode: " + combo.selectionMode);
				assert.strictEqual(combo.value, "Option 2",
						"item2.item.label: " + item2.item.label + " combo.value after selecting item2 on combo.id: " +
						combo.id + " selectionMode: " + combo.selectionMode);
				assert.strictEqual(combo.value, combo.valueNode.value,
						"combo.value equal to combo.valueNode.value after selecting item2 on combo.id: " +
						combo.id);
				var dataObj = combo.list.selectedItem.__item;
				var itemLabel = combo.list.labelFunc ?
					combo.list.labelFunc(dataObj) : dataObj[combo.list.labelAttr];
				assert.strictEqual(itemLabel, "Option 2",
						"label of combo.list.selectedItem after selecting item2 on combo.id: " + combo.id);
				assert.strictEqual(combo.list.selectedItems.length, 1,
						"combo.list.selectedItems.length after selecting item2 on combo.id: " +
						combo.id);
				dataObj = combo.list.selectedItems[0].__item;
				itemLabel = combo.list.labelFunc ?
					combo.list.labelFunc(dataObj) : dataObj[combo.list.labelAttr];
				assert.strictEqual(itemLabel, "Option 2",
						"label of combo.list.selectedItems[2] after selecting item2 on combo.id: " +
						combo.id);

				combo.closeDropDown();
			}), delay);
		}));

		return d;
	};

	var checkDefaultValues = function (combo) {
		assert.strictEqual(combo.autoFilter, false, "combo.autoFilter");
		assert.strictEqual(combo.selectionMode, "single", "combo.selectionMode");
		assert.strictEqual(combo.baseClass, outerCSS, "combo.baseClass");
		assert.strictEqual(combo.filterMode, "startsWith", "combo.filterMode");
		assert.isTrue(combo.ignoreCase, "combo.ignoreCase");
	};

	var CommonTestCases = {
		"Default CSS" : function () {
			var combo = document.getElementById("combo1");

			if (!combo) { // for the programmatic case 
				combo = createCombobox("combo1");
			} // else the declarative case

			assert.isTrue($(combo).hasClass(outerCSS),
					"Expecting " + outerCSS +
					" CSS class on outer element of combo.id: " + combo.id);
			assert.isTrue($(combo.inputNode).hasClass(inputCSS),
					"Expecting " + inputCSS +
					" CSS class on inner input element of combo.id: " + combo.id);
			assert.isTrue($(combo.valueNode).hasClass(hiddenInputCSS),
					"Expecting " + hiddenInputCSS +
					" CSS class on inner valueNode (hidden input) of combo.id: " + combo.id);

			combo = document.getElementById("mycombo1");

			if (!combo) { // for the programmatic case 
				combo = createMyCombobox("mycombo1");
			} // else the declarative case

			assert.isTrue($(combo).hasClass(outerCSS),
					"Expecting " + outerCSS +
					" CSS class on outer element of combo.id: " + combo.id);
			assert.isTrue($(combo.inputNode).hasClass(inputCSS),
					"Expecting " + inputCSS +
					" CSS class on inner input element of combo.id: " + combo.id);
			assert.isTrue($(combo.valueNode).hasClass(hiddenInputCSS),
					"Expecting " + hiddenInputCSS +
					" CSS class on inner valueNode (hidden input) of combo.id: " + combo.id);
		},

		"Default values" : function () {
			var combo = document.getElementById("combo1");

			if (!combo) { // for the programmatic case 
				combo = createCombobox("combo1");
			} // else the declarative case

			checkDefaultValues(combo);

			combo = document.getElementById("mycombo1");

			if (!combo) { // for the programmatic case 
				combo = createMyCombobox("mycombo1");
			} // else the declarative case

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
			checkCombobox(combo, this);

			combo = document.getElementById("mycombo1");
			checkCombobox(combo, this);
		},
		"Attribute mapping for label" : function () {
			// Check the attribute mapping for label

			container.innerHTML = htmlMappedAttr;
			register.parse(container);

			var combo = document.getElementById("combo1");
			checkCombobox(combo, this);

			combo = document.getElementById("mycombo1");
			checkCombobox(combo, this);
		}

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
			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}
			var combo = createCombobox("combo-a-1", true);
			checkCombobox(combo, this);

			combo = createMyCombobox("combo-a-2", true);
			checkCombobox(combo, this);
		},

		"Store.add (user's non-trackable Memory store)" : function () {
			// var combo = document.getElementById("combo1");
			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}
			var combo = createCombobox("combo-b-1", false);
			checkCombobox(combo, this);

			combo = createMyCombobox("combo-b-2", false);
			checkCombobox(combo, this);
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
			combo.list.deliver();
			container.appendChild(combo);
			combo.attachedCallback();
			combo.deliver();

			assert.strictEqual(combo.list.getItemRenderers().length, 8,
					"Number of options after adding 8 options on combo.id: " + combo.id);
			assert.strictEqual(combo.value, "France",
					"combo.value after adding 8 options on combo.id: " + combo.id);
		},

		"widget.value, and change and input events (selectionMode=single)": function () {
			var combo = createCombobox("combo-c-1", false /* trackable */);
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

			assert.strictEqual(changeCounter, 0,
				"There should be no change event after initialization, before interaction");
			assert.strictEqual(inputCounter, 0,
				"There should be no input event after initialization, before interaction");

			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}

			var d = this.async(2000);

			// this is required because FormValueWidget initializes initial change & input values
			// on delite-activate event. If not done, this happens when the drop down is closed, too late
			// in the cycle preventing the change & input event being fired. For this reason in theory we must do
			// combo.focus();
			// however for unknown reasons this is not work on IE (fine for Chrome & FF). So we do a first cycle
			// of opening/closing combo first to achieve the same result.
			if (!has("ie")) {
				combo.focus();
			} else {
				var e = document.createEvent("FocusEvent");
				e.initEvent("focus", true, false);
				combo.dispatchEvent(e);
			}

			combo.openDropDown().then(d.rejectOnError(function () {

				assert.strictEqual(changeCounter, 0,
					"Just opening the dropdown should not emit any change event");
				assert.strictEqual(inputCounter, 0,
					"Just opening the dropdown should not emit any input event");

				var checkAfterClickItem = function (changeCounterExpectedValue, inputCounterExpectedValue,
													itemName, expectedValue) {
					assert.strictEqual(inputCounter, inputCounterExpectedValue,
							"inputCounter after clicking " + itemName + " (single)");
					assert.strictEqual(changeCounter, changeCounterExpectedValue,
							"changeCounter after clicking " + itemName + " (single)");
					changeCounter = 0; // reinit
					inputCounter = 0; // reinit
					assert.strictEqual(changeValue, expectedValue,
							"changeValue: wrong value when receiving change event after clicking " +
							itemName + " (single)");
					assert.strictEqual(inputValue, expectedValue,
							"inputValue: wrong value when receiving input event after clicking " +
							itemName + " (single)");
					changeValue = null; // reinit
					inputValue = null; // reinit
				};
				var item2 = combo.list.getItemRenderers()[2];
				item2.click(); // automatically closes the dropdown (asynchronously)

				// Combobox is using Stateful.observe to listen to selection change on the list
				// and update its value, this means the timer below must not only cover for the 100 ms delay on
				// Combobox but also the Sateful.observe asynchronism
				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 400;
				setTimeout(d.rejectOnError(function () {
					checkAfterClickItem(1, 1, "item 2 of " + combo.id, "Option 2");
					combo.openDropDown().then(d.rejectOnError(function () {
						var item3 = combo.list.getItemRenderers()[3];
						item3.click(); // automatically closes the dropdown (asynchronously)
						setTimeout(d.callback(function () {
							checkAfterClickItem(1, 1, "item 3", "Option 3");
						}), delay);
					}));
				}), delay);
			}));

			return d;
		},

		"widget.value, and change and input events (selectionMode=multiple)": function () {
			var combo = createCombobox("combo-d-1", false /* trackable */, true /* selectionMode=multiple */);
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

			assert.strictEqual(changeCounter, 0,
				"There should be no change event after initialization, before interaction");
			assert.strictEqual(inputCounter, 0,
				"There should be no input event after initialization, before interaction");

			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}

			var d = this.async(4000);

			// this is required because FormValueWidget initializes initial change & input values
			// on delite-activate event. If not done, this happens when the drop down is closed, too late
			// in the cycle preventing the change & input event being fired. For this reason in theory we must do
			// combo.focus();
			// however for unknown reasons this is not work on IE (fine for Chrome & FF). So we do a first cycle
			// of opening/closing combo first to achieve the same result.
			if (!has("ie")) {
				combo.focus();
			} else {
				var e = document.createEvent("FocusEvent");
				e.initEvent("focus", true, false);
				combo.dispatchEvent(e);
			}

			combo.openDropDown().then(d.rejectOnError(function () {
				assert.strictEqual(changeCounter, 0,
					"Just opening the dropdown should not emit any change event");
				assert.strictEqual(inputCounter, 0,
					"Just opening the dropdown should not emit any input event");

				var checkAfterClickItem = function (changeCounterExpectedValue, inputCounterExpectedValue, itemName,
													expectedChangeValue, expectedInputValue) {
					assert.strictEqual(inputCounter, inputCounterExpectedValue,
							"inputCounter after clicking " + itemName + " (multiple)");
					assert.strictEqual(changeCounter, changeCounterExpectedValue,
							"changeCounter after clicking " + itemName + " (multiple)");
					assert.deepEqual(changeValue, expectedChangeValue,
							"changeValue: wrong value when receiving change event after clicking " +
							itemName + " (multiple)");
					assert.deepEqual(inputValue, expectedInputValue,
							"inputValue: wrong value when receiving input event after clicking " +
							itemName + " (multiple)");
				};
				var item2 = combo.list.getItemRenderers()[2];
				item2.click();

				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 400;
				setTimeout(d.rejectOnError(function () {
					checkAfterClickItem(0, 1, "item 2", null, ["Option 2"]);
					combo.closeDropDown(); // this commits the change
					combo.openDropDown().then(d.rejectOnError(function () {
						setTimeout(d.rejectOnError(function () {
							checkAfterClickItem(1, 1, "item 2", ["Option 2"], ["Option 2"]);
							var item3 = combo.list.getItemRenderers()[3];
							item3.click();
							setTimeout(d.rejectOnError(function () {
								checkAfterClickItem(1, 2, "item 3", ["Option 2"], ["Option 3", "Option 2"]);
								combo.closeDropDown(); // this commits the change
								setTimeout(d.callback(function () {
									checkAfterClickItem(2, 2, "item 3", ["Option 3", "Option 2"],
										["Option 3", "Option 2"]);
								}));
							}), delay);
						}), delay);
					}));
				}), delay);
			}));

			return d;
		},

		"widget value with item value different than item label (selectionMode=single)": function () {
			// Set List.valueAttr such that the render items contain the myValue field
			// of the store data items.
			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}
			var list = new List({store: dataStoreWithValue, valueAttr: "myValue"});
			var combo = new Combobox({list: list});
			container.appendChild(combo);
			combo.attachedCallback();
			combo.deliver();

			var d = this.async(1000);

			combo.openDropDown().then(d.rejectOnError(function () {

				var item3 = combo.list.getItemRenderers()[3];
				item3.click();

				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 200;
				setTimeout(d.rejectOnError(function () {
					assert.strictEqual(combo.value, "US",
							"(single) Value after clicking item with label USA should be US, " +
							"not USA, as defined in the custom myValue field of the data item");
					combo.openDropDown().then(d.rejectOnError(function () {
						var item4 = combo.list.getItemRenderers()[4];
						item4.click();
						setTimeout(d.callback(function () {
							assert.strictEqual(combo.value, "CA",
									"(single) Value after clicking item with label Canada should be CA, " +
									"not Canada, as defined in the custom myValue field of the data item");
						}), delay);
					}));
				}), delay);
			}));

			return d;
		},

		"widget value with item value different than item label (selectionMode=multiple)": function () {
			// Set List.valueAttr such that the render items contain the myValue field
			// of the store data items.
			if (has("ios")) {
				// For some reason, the testing with click() doesn't pass on iOS for now,
				// although it does seem to work when testing manually on the device.
				// TODO: is it due to intern? other reason?
				//this.skip("Skipping this test on iOS.");
			}
			var list = new List({store: dataStoreWithValue, valueAttr: "myValue"});
			var combo = new Combobox({list: list, selectionMode: "multiple"});
			container.appendChild(combo);
			combo.attachedCallback();
			combo.deliver();

			var d = this.async(1000);

			combo.openDropDown().then(d.rejectOnError(function () {

				var item3 = combo.list.getItemRenderers()[3];
				assert.isNotNull(item3, "item3");

				item3.click();

				var delay = 200;
				setTimeout(d.rejectOnError(function () {
					assert.deepEqual(combo.value, ["US"],
							"(multiple) Value after clicking item with label USA should be ['US'], " +
							"not ['USA'], as defined in the custom myValue field of the data item");
					var item4 = combo.list.getItemRenderers()[4];
					item4.click();
					setTimeout(d.callback(function () {
						combo.closeDropDown();
						assert.deepEqual(combo.value, ["CA", "US"],
								"(multiple) Value after clicking item with label Canada should be ['CA', 'US'], " +
								"not ['Canada', 'USA'], as defined in the custom myValue field " +
								"of the data item");
					}), delay);
				}), delay);
			}));

			return d;
		},
		
		// Test case for #509: initialization of Combobox after List rendering is ready.
		"initialization with List rendering after Combobox initialization": function () {
			var list = new List();
			var combo = new Combobox({list: list}); // single selection mode
			container.appendChild(combo);
			combo.attachedCallback();

			// Add items to the data store after attachedCallback().
			combo.list.store = new Memory(); // triggers async re-rendering of List
			addOptions(combo, 0, nOptions - 1);
			
			combo.deliver();
			combo.list.deliver();
			
			// Check the correct initialization of displayed label, widget value,
			// and submitted value.
			assert.strictEqual(combo.inputNode.value, "Option 0", "combo.inputNode.value");
			assert.strictEqual(combo.value, "Option 0", "combo.value");
			assert.strictEqual(combo.valueNode.value, "Option 0", "combo.valueNode.value");
		},
		
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, CommonTestCases);

	registerSuite(suite);
});
