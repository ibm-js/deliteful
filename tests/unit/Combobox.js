var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

import has from "ibm-decor/sniff";
import register from "delite/register";
import Memory from "dojo-dstore/Memory";
import Trackable from "dojo-dstore/Trackable";
import Combobox from "deliteful/Combobox";

var container;

var html1 = "<d-combobox id=\"combo1\" righttextAttr=\"sales\"> \
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
	</d-combobox>";

var html2 = "<my-combobox id=\"mycombo1\" righttextAttr=\"sales\"> \
	{ \"label\": \"Option 0\", \"sales\": 500, \"profit\": 50, \"region\": \"EU\" }, \
	{ \"label\": \"Option 1\", \"sales\": 450, \"profit\": 48, \"region\": \"EU\" }, \
	{ \"label\": \"Option 2\", \"sales\": 700, \"profit\": 60, \"region\": \"EU\" }, \
	{ \"label\": \"Option 3\", \"sales\": 2000, \"profit\": 250, \"region\": \"America\" }, \
	{ \"label\": \"Option 4\", \"sales\": 600, \"profit\": 30, \"region\": \"America\" }, \
	{ \"label\": \"Option 5\", \"sales\": 450, \"profit\": 30, \"region\": \"America\" }, \
	{ \"label\": \"Option 6\", \"sales\": 500, \"profit\": 40, \"region\": \"Asia\" }, \
	{ \"label\": \"Option 7\", \"sales\": 900, \"profit\": 100, \"region\": \"Asia\" }, \
	{ \"label\": \"Option 8\", \"sales\": 500, \"profit\": 40, \"region\": \"EU\" }, \
	{ \"label\": \"Option 9\", \"sales\": 900, \"profit\": 100, \"region\": \"EU\" }\
	</my-combobox>";

// Second variant to test attribute mapping for label

var htmlMappedAttr1 = "<d-combobox id=\"combo1\" labelAttr=\"name\" righttextAttr=\"sales\"> \
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
	</d-combobox>";

var htmlMappedAttr2 = "<my-combobox id=\"mycombo1\" labelAttr=\"name\" righttextAttr=\"sales\"> \
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
	</my-combobox>";

// For testing the ability to deal with item value different than item label
var dataSourceWithValue =  [
	{ label: "France", myValue: "FR", sales: 500, profit: 50, region: "EU" },
	{ label: "Germany", myValue: "DE", sales: 450, profit: 48, region: "EU" },
	{ label: "UK", myValue: "UK", sales: 700, profit: 60, region: "EU" },
	{ label: "USA", myValue: "US", sales: 2000, profit: 250, region: "America" },
	{ label: "Canada", myValue: "CA", sales: 600, profit: 30, region: "America" },
	{ label: "Brazil", myValue: "BA", sales: 450, profit: 30, region: "America" },
	{ label: "China", myValue: "CN", sales: 500, profit: 40, region: "Asia" },
	{ label: "Japan", myValue: "JP", sales: 900, profit: 100, region: "Asia" }
];

var inputCSS = "d-combobox-input";
var nOptions = 10;

function initSource(combo, trackable) {
	var TrackableMemoryStore = Memory.createSubclass(Trackable);
	var source = trackable ? new TrackableMemoryStore({}) : new Memory();
	combo.source = source;
	var dataItems = addOptions(combo, 0, nOptions - 1);
	combo._testDataItems = dataItems; // stored for debugging purposes.
	return combo;
}

function createCombobox(id, trackable, multiple) {
	var selectionMode = multiple ? "multiple" : "single";
	var combo = new Combobox({id: id, selectionMode: selectionMode});
	initSource(combo, trackable);
	combo.placeAt(container);
	combo.deliver();
	return combo;
}

function createMyCombobox(id, trackable) {
	var combo = new MyCombobox({ id: id });
	initSource(combo, trackable);
	//container.appendChild(combo);
	combo.placeAt(container);
	combo.deliver();
	return combo;
}

function addOptions(combo, min, max) {
	if (!min && !max) {
		min = combo.source.data.length;
		max = min;
	}
	var dataItems = [];
	var item;
	var source = combo.source;
	for (var i = min; i <= max; i++) {
		item = source.addSync({
			label: "Option " + i
		});
		dataItems.push(item);
	}

	if (combo) {
		var observe = combo.observe(function (oldValues) {
			if ("value" in oldValues) {
				// Store the value for testing purposes
				combo._notifiedComboboxValue = combo.value;
			}
		});
		combo._notifiedComboboxValue = null; // init
		combo._observe = observe; // to be able to deliver
	}

	return dataItems;
}

function checkCombobox(combo, test, trackableStore) {
	// These checks are common to both cases: trackable and non-trackable stores

	if (!trackableStore) {
		// With non-trackable stores, adding items to the store does not
		// trigger an invalidation, hence:
		combo.notifyCurrentValue("source");
	}

	var d = test.async(5000);

	// Make sure combobox is rendered.
	combo.deliver();

	var handle = combo.list.on("query-success", d.rejectOnError(function () {
		handle.remove();

		combo.list.deliver();

		var item2 = combo.list.querySelectorAll("[role=option]")[2];
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
			var itemLabel = combo.labelFunc ?
				combo.labelFunc(dataObj) : dataObj[combo.labelAttr];
			assert.strictEqual(itemLabel, "Option 2",
				"label of combo.list.selectedItem after selecting item2 on combo.id: " + combo.id);
			assert.strictEqual(combo.list.selectedItems.length, 1,
				"combo.list.selectedItems.length after selecting item2 on combo.id: " +
					combo.id);
			dataObj = combo.list.selectedItems[0].__item;
			itemLabel = combo.labelFunc ?
				combo.labelFunc(dataObj) : dataObj[combo.labelAttr];
			assert.strictEqual(itemLabel, "Option 2",
				"label of combo.list.selectedItems[2] after selecting item2 on combo.id: " +
					combo.id);

			combo.closeDropDown();
		}), delay);
	}));

	// Open dropdown and trigger list to load.
	combo.openDropDown();

	return d;
}

function checkDefaultValues(combo) {
	assert.strictEqual(combo.autoFilter, false, "combo.autoFilter");
	assert.strictEqual(combo.selectionMode, "single", "combo.selectionMode");
	assert.strictEqual(combo.filterMode, "startsWith", "combo.filterMode");
	assert.isTrue(combo.ignoreCase, "combo.ignoreCase");
	assert.strictEqual(combo.focusNode.placeholder, "Search", combo.focusNode.placeholder);
}

var CommonTestCases = {
	"Default CSS": function () {
		var combo = document.getElementById("combo1");
		assert.isTrue(combo.focusNode.classList.contains(inputCSS),
			"Expecting " + inputCSS +
				" CSS class on inner input element of combo.id: " + combo.id);
		assert.isTrue(combo.valueNode.hasAttribute("hidden"),
			"Expecting hidden attribute on inner valueNode (hidden input) of combo.id: " + combo.id);

		combo = document.getElementById("mycombo1");

		if (!combo) { // for the programmatic case
			combo = createMyCombobox("mycombo1");
		} // else the declarative case

		assert.isTrue(combo.focusNode.classList.contains(inputCSS),
			"Expecting " + inputCSS +
				" CSS class on inner input element of combo.id: " + combo.id);
		assert.isTrue(combo.valueNode.hasAttribute("hidden"),
			"Expecting hidden attribute on inner valueNode (hidden input) of combo.id: " + combo.id);
	},

	"Default values": function () {
		var combo = document.getElementById("combo1");
		checkDefaultValues(combo);

		var mycombo = document.getElementById("mycombo1");
		checkDefaultValues(mycombo);
	}
};

// Markup use-case

register("my-combobox", [Combobox], {});

registerSuite("deliteful/Combobox: markup", {
	beforeEach: function () {
		container = document.createElement("div");
		document.body.appendChild(container);
	},

	afterEach: function () {
		container.parentNode.removeChild(container);
	},

	tests: {
		"Initialization 1": function () {
			container.innerHTML = html1;
			register.deliver();

			var combo = document.getElementById("combo1");
			return checkCombobox(combo, this);
		},

		"Initialization 2": function () {
			container.innerHTML = html2;
			register.deliver();

			var combo = document.getElementById("mycombo1");
			return checkCombobox(combo, this);
		},

		"Attribute mapping for label 1": function () {
			// Check the attribute mapping for label

			container.innerHTML = htmlMappedAttr1;
			register.deliver();

			var combo = document.getElementById("combo1");
			return checkCombobox(combo, this);
		},


		"Attribute mapping for label 2": function () {
			// Check the attribute mapping for label

			container.innerHTML = htmlMappedAttr2;
			register.deliver();

			var combo = document.getElementById("mycombo1");
			return checkCombobox(combo, this);
		}
	}
});

registerSuite("deliteful/Combobox: markup (common tests)", {
	beforeEach: function () {
		container = document.createElement("div");
		document.body.appendChild(container);
		container.innerHTML = html1 + html2;
		register.deliver();
	},

	afterEach: function () {
		container.parentNode.removeChild(container);
	},

	tests: CommonTestCases
});

// Programatic creation

var MyCombobox = register("my-combo-prog", [Combobox], {});

registerSuite("deliteful/Combobox: programatic", {
	beforeEach: function () {
		container = document.createElement("div");
		document.body.appendChild(container);
	},

	tests: {
		"Store.add/remove/put (user's trackable Memory store) 1": function () {
			var combo = createCombobox("combo-a-1", true);
			return checkCombobox(combo, this);
		},

		"Store.add/remove/put (user's trackable Memory store) 2": function () {
			var combo = createMyCombobox("combo-a-2", true);
			return checkCombobox(combo, this);
		},

		"Store.add (user's non-trackable Memory store) 1": function () {
			var combo = createCombobox("combo-b-1", false);
			return checkCombobox(combo, this);
		},

		"Store.add (user's non-trackable Memory store) 2": function () {
			var combo = createMyCombobox("combo-b-2", false);
			return checkCombobox(combo, this);
		},

		"Attribute mapping for label": function () {
			// Check the attribute mapping for label
			var combo = new Combobox({labelAttr: "name"});
			var dataSource = new Memory({
				idProperty: "name",
				data: [
					{ name: "Japan", sales: 900, profit: 100, region: "Asia" },
					{ name: "France", sales: 500, profit: 50, region: "EU" },
					{ name: "Germany", sales: 450, profit: 48, region: "EU" },
					{ name: "UK", sales: 700, profit: 60, region: "EU" },
					{ name: "USA", sales: 2000, profit: 250, region: "America" },
					{ name: "Canada", sales: 600, profit: 30, region: "America" },
					{ name: "Brazil", sales: 450, profit: 30, region: "America" },
					{ name: "China", sales: 500, profit: 40, region: "Asia" }
				]
			});
			combo.source = dataSource;
			combo.placeAt(container);
			combo.deliver();

			var d = this.async(2000);

			combo.on("query-success", d.rejectOnError(function () {
				assert.strictEqual(combo.list.querySelectorAll("[role=option]").length, 8,
					"Number of options after adding 8 options on combo.id: " + combo.id);
				assert.strictEqual(combo.value, "",
					"combo.value after adding 8 options on combo.id: " + combo.id);

				var item0 = combo.list.querySelectorAll("[role=option]")[0];
				item0.click();

				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 200;
				setTimeout(d.callback(function () {
					assert.strictEqual(combo.value, "Japan",
						"combo.value after adding 8 options on combo.id: " + combo.id);
				}), delay);
			}));

			// need to open the popup so the list gets the source.
			combo.openDropDown();

			return d;
		},

		"programmatically set value and displayedValue (selectionMode=single)": {
			"simple": function () {
				// Simple Combobox, displayedValue not specified but it defaults to value.
				var source = new Memory({
					data: [
						{name: "Japan", sales: 900, profit: 100, region: "Asia"},
						{name: "France", sales: 500, profit: 50, region: "EU"},
						{name: "Germany", sales: 450, profit: 48, region: "EU"},
						{name: "UK", sales: 700, profit: 60, region: "EU"},
						{name: "USA", sales: 2000, profit: 250, region: "America"},
						{name: "Canada", sales: 600, profit: 30, region: "America"},
						{name: "Brazil", sales: 450, profit: 30, region: "America"},
						{name: "China", sales: 500, profit: 40, region: "Asia"}
					]
				});
				var combo = new Combobox({
					source: source,
					labelAttr: "name",
					displayedValue: "Germany",
					value: "Germany"
				});
				combo.placeAt(container);
				combo.deliver();
				assert.strictEqual(combo.displayedValue, "Germany", "initial displayedValue");
				assert.strictEqual(combo.focusNode.value, "Germany", "initial focusNode.value");

				combo.value = "Japan";
				combo.displayedValue = "Japan";
				combo.deliver();
				assert.strictEqual(combo.displayedValue, "Japan", "changed displayedValue");
				assert.strictEqual(combo.focusNode.value, "Japan", "changed focusNode.value");
			},

			"label": function () {
				// Combobox where value and displayedValue are different, so at creation both
				// displayedValue and value are specified.
				var source = new Memory({
					idProperty: "id",
					data: [
						{id: "JP", name: "Japan", sales: 900, profit: 100, region: "Asia"},
						{id: "FR", name: "France", sales: 500, profit: 50, region: "EU"},
						{id: "DE", name: "Germany", sales: 450, profit: 48, region: "EU"},
						{id: "UK", name: "UK", sales: 700, profit: 60, region: "EU"},
						{id: "US", name: "USA", sales: 2000, profit: 250, region: "America"},
						{id: "CA", name: "Canada", sales: 600, profit: 30, region: "America"},
						{id: "BR", name: "Brazil", sales: 450, profit: 30, region: "America"},
						{id: "CN", name: "China", sales: 500, profit: 40, region: "Asia"}
					]
				});
				var combo = new Combobox({
					source: source,
					labelAttr: "name",
					value: "DE",
					displayedValue: "Germany"
				});
				combo.placeAt(container);
				combo.deliver();
				assert.strictEqual(combo.value, "DE", "initial value");
				assert.strictEqual(combo.displayedValue, "Germany", "initial displayedValue");
				assert.strictEqual(combo.focusNode.value, "Germany", "initial focusNode.value");

				combo.value = "CA";
				combo.displayedValue = "Canada";
				combo.deliver();
				assert.strictEqual(combo.value, "CA", "changed value");
				assert.strictEqual(combo.displayedValue, "Canada", "changed displayedValue");
				assert.strictEqual(combo.focusNode.value, "Canada", "changed focusNode.value");
			},

			"blank label": function () {
				// Make sure that you can specify a blank displayedValue and it doesn't default to the value.
				var source = new Memory({
					idProperty: "id",
					data: [
						{ id: "blank", name: "" },
						{ id: "M", name: "male" },
						{ id: "F", name: "female" }
					]
				});
				var combo = new Combobox({
					source: source,
					labelAttr: "name",
					value: "blank",
					displayedValue: ""
				});
				combo.placeAt(container);
				combo.deliver();
				assert.strictEqual(combo.value, "blank", "initial value");
				assert.strictEqual(combo.displayedValue, "", "initial displayedValue");
				assert.strictEqual(combo.focusNode.value, "", "initial focusNode.value");

				combo.value = "M";
				combo.displayedValue = "male";
				combo.deliver();

				combo.value = "blank";
				combo.displayedValue = "";
				combo.deliver();

				assert.strictEqual(combo.value, "blank", "changed value");
				assert.strictEqual(combo.displayedValue, "", "changed displayedValue");
				assert.strictEqual(combo.focusNode.value, "", "changed focusNode.value");
			}
		},

		"programmatically set value and displayedValue (selectionMode=multiple)": {
			simple: function () {
				var source = new Memory({
					data: [
						{name: "Japan", sales: 900, profit: 100, region: "Asia"},
						{name: "France", sales: 500, profit: 50, region: "EU"},
						{name: "Germany", sales: 450, profit: 48, region: "EU"},
						{name: "UK", sales: 700, profit: 60, region: "EU"},
						{name: "USA", sales: 2000, profit: 250, region: "America"},
						{name: "Canada", sales: 600, profit: 30, region: "America"},
						{name: "Brazil", sales: 450, profit: 30, region: "America"},
						{name: "China", sales: 500, profit: 40, region: "Asia"}
					]
				});

				// When value is empty array, displayedValue gets set automatically.
				var combo1 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					value: []
				});
				combo1.placeAt(container);
				combo1.deliver();
				assert.strictEqual(combo1.displayedValue, combo1.multipleChoiceNoSelectionMsg, "value = []");

				var combo2 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					displayedValue: "Japan",
					value: ["Japan"]
				});
				combo2.placeAt(container);
				combo2.deliver();
				assert.strictEqual(combo2.displayedValue, "Japan", "value = ['Japan']");

				// When value is array with multiple entries, displayedValue gets set automatically.
				var combo3 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					value: ["Canada", "Brazil"]
				});
				combo3.placeAt(container);
				combo3.deliver();
				assert.strictEqual(combo3.displayedValue, combo3.multipleChoiceMsg.replace("${items}", 2),
					"value = [a, b]");
			},

			label: function () {
				// Combobox where value and displayedValue are different, so at creation both
				// displayedValue and value are specified.
				var source = new Memory({
					idProperty: "id",
					data: [
						{id: "JP", name: "Japan", sales: 900, profit: 100, region: "Asia"},
						{id: "FR", name: "France", sales: 500, profit: 50, region: "EU"},
						{id: "DE", name: "Germany", sales: 450, profit: 48, region: "EU"},
						{id: "UK", name: "UK", sales: 700, profit: 60, region: "EU"},
						{id: "US", name: "USA", sales: 2000, profit: 250, region: "America"},
						{id: "CA", name: "Canada", sales: 600, profit: 30, region: "America"},
						{id: "BR", name: "Brazil", sales: 450, profit: 30, region: "America"},
						{id: "CN", name: "China", sales: 500, profit: 40, region: "Asia"}
					]
				});

				// When value is empty array, displayedValue gets set automatically.
				var combo1 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					value: [],
					displayedValue: "should be ignored"
				});
				combo1.placeAt(container);
				combo1.deliver();
				assert.strictEqual(combo1.displayedValue, combo1.multipleChoiceNoSelectionMsg, "value = []");

				// When value is array with one entry, app should specify displayedValue.
				var combo2 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					value: ["DE"],
					displayedValue: "Germany"
				});
				combo2.placeAt(container);
				combo2.deliver();
				assert.strictEqual(combo2.displayedValue, "Germany", "initial displayedValue");

				// When value is array with multiple entries, displayedValue gets set automatically.
				var combo3 = new Combobox({
					selectionMode: "multiple",
					source: source,
					labelAttr: "name",
					value: ["JP", "FR"],
					displayedValue: "should be ignored"
				});
				combo3.placeAt(container);
				combo3.deliver();
				assert.strictEqual(combo3.displayedValue, combo3.multipleChoiceMsg.replace("${items}", 2),
					"value = [a, b]");
			}
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

			var handle = combo.list.on("query-success", d.rejectOnError(function () {
				handle.remove();

				combo.list.deliver();

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
				var item2 = combo.list.querySelectorAll("[role=option]")[2];
				item2.click(); // automatically closes the dropdown (asynchronously)

				// Combobox is using Stateful.observe to listen to selection change on the list
				// and update its value, this means the timer below must not only cover for the 100 ms delay on
				// Combobox but also the Sateful.observe asynchronism
				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 400;
				setTimeout(d.rejectOnError(function () {
					checkAfterClickItem(1, 1, "item 2 of " + combo.id, "Option 2");
					combo.openDropDown().then(d.rejectOnError(function () {
						combo.list.deliver();
						var item3 = combo.list.querySelectorAll("[role=option]")[3];
						item3.click(); // automatically closes the dropdown (asynchronously)
						setTimeout(d.callback(function () {
							checkAfterClickItem(1, 1, "item 3", "Option 3");
						}), delay);
					}));
				}), delay);
			}));

			// Open dropdown and trigger list to load.
			combo.openDropDown();

			return d;
		},

		"widget.value, and change and input events (selectionMode=multiple)": function () {
			var combo = createCombobox("combo-d-1", false /* trackable */, true /* selectionMode=multiple */);

			// While we are here, make sure that multiselection Combobox's <input> is readonly.
			assert(combo.focusNode.readOnly, "readonly");

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

			var handle = combo.list.on("query-success", d.rejectOnError(function () {
				handle.remove();

				combo.list.deliver();

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
				var item2 = combo.list.querySelectorAll("[role=option]")[2];
				item2.click();

				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 400;
				setTimeout(d.rejectOnError(function () {
					checkAfterClickItem(0, 1, "item 2", null, ["Option 2"]);
					combo.closeDropDown(); // this commits the change

					combo.openDropDown().then(d.rejectOnError(function () {
						setTimeout(d.rejectOnError(function () {
							checkAfterClickItem(1, 1, "item 2", ["Option 2"], ["Option 2"]);
							var item3 = combo.list.querySelectorAll("[role=option]")[3];
							item3.click();
							setTimeout(d.rejectOnError(function () {
								checkAfterClickItem(1, 2, "item 3", ["Option 2"], ["Option 2", "Option 3"]);
								combo.closeDropDown(); // this commits the change
								setTimeout(d.callback(function () {
									checkAfterClickItem(2, 2, "item 3", ["Option 2", "Option 3"],
										["Option 2", "Option 3"]);
								}));
							}), delay);
						}), delay);
					}));
				}), delay);
			}));

			// Open dropdown and trigger list to load.
			combo.openDropDown();

			return d;
		},

		"widget value with item value different than item label (selectionMode=single)": function () {
			// Set List.valueAttr such that the render items contain the myValue field
			// of the store data items.
			var combo = new Combobox({valueAttr: "myValue", source: dataSourceWithValue});
			combo.placeAt(container);
			combo.deliver();

			var d = this.async(1000);

			var handle = combo.list.on("query-success", d.rejectOnError(function () {
				handle.remove();

				combo.list.deliver();

				var item3 = combo.list.querySelectorAll("[role=option]")[3];
				item3.click();

				// Higher than the 100 delay of Combobox' defer when closing the dropdown
				var delay = 200;
				setTimeout(d.rejectOnError(function () {
					assert.strictEqual(combo.value, "US",
						"(single) Value after clicking item with label USA should be US, " +
						"not USA, as defined in the custom myValue field of the data item");
					combo.openDropDown().then(d.rejectOnError(function () {
						combo.list.deliver();
						var item4 = combo.list.querySelectorAll("[role=option]")[4];
						item4.click();
						setTimeout(d.callback(function () {
							assert.strictEqual(combo.value, "CA",
								"(single) Value after clicking item with label Canada should be CA, " +
								"not Canada, as defined in the custom myValue field of the data item");
						}), delay);
					}));
				}), delay);
			}));

			// Open dropdown and trigger list to reload.
			combo.openDropDown();

			return d;
		},

		"widget value with item value different than item label (selectionMode=multiple)": function () {
			// Set List.valueAttr such that the render items contain the myValue field
			// of the store data items.
			var combo = new Combobox({
				valueAttr: "myValue",
				source: dataSourceWithValue,
				selectionMode: "multiple"
			});
			combo.placeAt(container);
			combo.deliver();

			var d = this.async(1000);

			combo.list.on("query-success", d.rejectOnError(function () {
				combo.list.deliver();
				var item3 = combo.list.querySelectorAll("[role=option]")[3];
				assert.isNotNull(item3, "item3");

				item3.click();

				var delay = 200;
				setTimeout(d.rejectOnError(function () {
					assert.deepEqual(combo.value, ["US"],
						"(multiple) Value after clicking item with label USA should be ['US'], " +
						"not ['USA'], as defined in the custom myValue field of the data item");
					var item4 = combo.list.querySelectorAll("[role=option]")[4];
					item4.click();
					setTimeout(d.callback(function () {
						combo.closeDropDown();
						assert.deepEqual(combo.value, ["US", "CA"],
							"(multiple) Value after clicking item with label Canada should be ['US', 'CA'], " +
							"not ['USA', 'Canada'], as defined in the custom myValue field " +
							"of the data item");
					}), delay);
				}), delay);
			}));
			combo.openDropDown();

			return d;
		}

		// Test case for #509: initialization of Combobox after List rendering is ready.
		// "initialization with List rendering after Combobox initialization": function () {
		// 	var combo = new Combobox(); // single selection mode
		// 	container.appendChild(combo);
		// 	combo.connectedCallback();

		// 	// Add items to the data store after connectedCallback().
		// 	var list = new List({source: new Memory()});
		// 	addOptions(null, list, 0, nOptions - 1);
		// 	combo.list = list;
		// 	combo.deliver();

		// 	// Check displayed label, widget value and submitted value are still null.
		// 	assert.strictEqual(combo.focusNode.value, "", "combo.focusNode.value");
		// 	assert.strictEqual(combo.value, "", "combo.value");
		// 	assert.strictEqual(combo.valueNode.value, "", "combo.valueNode.value");
		// 	// Check widget source got list'source while the latter was set to null.
		// 	assert.isNotNull(combo.source, "combo.source");
		// 	assert.isNull(combo.list.source, "combo.list.source");
		// }
	},

	afterEach: function () {
		container.parentNode.removeChild(container);
	}
});

registerSuite("deliteful/Combobox: programmatic (common tests)", {
	beforeEach: function () {
		container = document.createElement("div");
		document.body.appendChild(container);
		createCombobox("combo1");
		createMyCombobox("mycombo1");
	},
	afterEach: function () {
		container.parentNode.removeChild(container);
	},

	tests: CommonTestCases
});

