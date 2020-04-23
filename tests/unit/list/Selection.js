import List from "deliteful/list/List";
import Memory from "dojo-dstore/Memory";
import Trackable from "dojo-dstore/Trackable";

var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

var list = null;

var Store = Memory.createSubclass([ Trackable ], {});

var testHelper = {
	"selectionMode 'multiple'": function (isListBox) {
		if (isListBox) {
			list.type = "listbox";
		}
		list.selectionMode = "multiple";
		list.deliver();
		var selectionChangeEvent = null;
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
		list.on("selection-change", function (event) {
			selectionChangeEvent = event;
		});
		assert.isTrue(firstItem.classList.contains("d-list-item"));

		// Selection event on first item (select)
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent, "selectionChangeEvent 1");
		assert.deepEqual(selectionChangeEvent.oldValue, [], "event1 old selection");
		assert.deepEqual(selectionChangeEvent.newValue, [ list.source.fetchSync()[0] ], "event1 new select");
		assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "false");

		// Selection event on second item (select)
		list.emit("keydown", { key: "Spacebar" }, secondItem);
		list.emit("keyup", { key: "Spacebar" }, secondItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent, "selectionChangeEvent 2");
		assert.deepEqual(selectionChangeEvent.oldValue,
			[ list.source.fetchSync()[0] ], "event2 oldValue");
		assert.deepEqual(selectionChangeEvent.newValue,
			[ list.source.fetchSync()[0], list.source.fetchSync()[1] ], "event2 newValue");
		assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "true");

		// Selection event on first item (deselect)
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent, "selectionChangeEvent 3");
		assert.deepEqual(selectionChangeEvent.oldValue,
			[ list.source.fetchSync()[0], list.source.fetchSync()[1] ], "event3 oldValue");
		assert.deepEqual(selectionChangeEvent.newValue,
			[ list.source.fetchSync()[1] ], "event3 newValue");
		assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event3 renderer");
		selectionChangeEvent = null;

		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false", "firstItem aria-selected");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "true", "secondItem aria-selected");
	},

	"selectionMode 'single'": function (isListbox) {
		if (isListbox) {
			list.type = "listbox";
		}
		list.selectionMode = "single";
		list.deliver();
		var selectionChangeEvent = null;
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
		list.on("selection-change", function (event) {
			selectionChangeEvent = event;
		});
		assert.isTrue(firstItem.classList.contains("d-list-item"));

		// Selection event on first item (select)
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent);
		assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
		assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
		assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "false");

		// Selection event on second item (select)
		list.emit("keydown", { key: "Spacebar" }, secondItem);
		list.emit("keyup", { key: "Spacebar" }, secondItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent);
		assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
		assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
		assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false");

		assert.strictEqual(secondItem.getAttribute("aria-selected"), "true");

		// Selection event on second item (deselect)
		list.emit("keydown", { key: "Spacebar" }, secondItem);
		list.emit("keyup", { key: "Spacebar" }, secondItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent);
		assert.strictEqual(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection");
		assert.strictEqual(selectionChangeEvent.newValue, null, "event3 new selection");
		assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event3 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "false");
	},

	"selectionMode 'radio'": function (isListbox) {
		if (isListbox) {
			list.type = "listbox";
		}
		list.selectionMode = "radio";
		list.deliver();
		var selectionChangeEvent = null;
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
		list.on("selection-change", function (event) {
			selectionChangeEvent = event;
		});
		assert.isTrue(firstItem.classList.contains("d-list-item"));

		// Selection event on first item (select)
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent);
		assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
		assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
		assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "false");

		// Selection event on second item (select)
		list.emit("keydown", { key: "Spacebar" }, secondItem);
		list.emit("keyup", { key: "Spacebar" }, secondItem);
		list.deliver();

		assert.isNotNull(selectionChangeEvent);
		assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
		assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
		assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
		selectionChangeEvent = null;
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false", "firstItem aria-selected");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "true", "secondItem aria-selected");

		// Selection event on second item (does not deselect)
		list.emit("keydown", { key: "Spacebar" }, secondItem);
		list.emit("keyup", { key: "Spacebar" }, secondItem);
		list.deliver();

		assert.isNull(selectionChangeEvent);
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false", "firstItem aria-selected");
		assert.strictEqual(secondItem.getAttribute("aria-selected"), "true", "secondItem aria-selected");
	},

	"delete selected item": function (isListbox) {
		if (isListbox) {
			list.type = "listbox";
		}
		list.selectionMode = "single";
		list.deliver();
		var selectionChangeEvent = null;
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);

		// select first item
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		// now listen to selection-change event and remove the selected item from the store
		list.on("selection-change", function (event) {
			selectionChangeEvent = event;
		});
		list.source.remove(list.source.fetchSync()[0].id);
		assert.isNotNull(selectionChangeEvent, "selectionChangeEvent");
		assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1");
		assert.isNull(selectionChangeEvent.newValue, "selectionChangeEvent.newValue");
	},

	"move selected item": function (isListbox) {
		if (isListbox) {
			list.type = "listbox";
		}
		list.selectionMode = "single";
		list.deliver();

		// select first item
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();
		assert(list.isSelected(firstItem.item), "item selected before move");

		// move first item
		var thirdItem = list.querySelector(`[role=${list.type}] > *:nth-child(3)`);
		list.source.put(firstItem.item, { beforeId: thirdItem.item.id });
		list.deliver();

		var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
		assert(list.isSelected(secondItem.item), "item selected after move");
		assert(secondItem.getAttribute("aria-selected"),
			"item selected after move (aria-selected attribute)");
	},

	"aria properties and classes when selection mode is single": function (isListbox) {
		if (isListbox) {
			list.isListbox = true;
		}
		list.selectionMode = "single";
		list.deliver();
		assert.include(list.querySelector(`[role=${list.type}]`).className, "d-selectable", "list class");
		assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
			"list class");
		assert.isFalse(list.querySelector(`[role=${list.type}]`).hasAttribute("aria-multiselectable"),
			"no aria-multiselectable attribute expected");
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		assert.notInclude(firstItem.className, "d-selected", "firstItem class");
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false",
			"no aria-selected attribute 'false' expected on first item");

		// select first item
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.include(firstItem.className, "d-selected", "firstItem class");
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true",
			"aria-selected attribute 'true' expected on first item after selection");
	},

	"aria properties and classes when selection mode is radio": function (isListbox) {
		if (isListbox) {
			list.isListbox = true;
		}
		list.selectionMode = "radio";
		list.deliver();
		assert.include(list.querySelector(`[role=${list.type}]`).className, "d-selectable", "list className");
		assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
			"list className");
		assert.isFalse(list.hasAttribute("aria-multiselectable"),
			"no aria-multiselectable attribute expected");
		var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
		assert.notInclude(firstItem.className, "d-selected", "no d-selected class expected");
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "false",
			"no aria-selected attribute 'false' expected on first item");

		// select first item
		list.emit("keydown", { key: "Spacebar" }, firstItem);
		list.emit("keyup", { key: "Spacebar" }, firstItem);
		list.deliver();

		assert.include(firstItem.className, "d-selected", "d-selected class expected");
		assert.strictEqual(firstItem.getAttribute("aria-selected"), "true",
			"aria-selected attribute 'true' expected on first item after selection");
	},

	"aria properties and classes when selection mode is multiple":
		function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "multiple";
			list.deliver();
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-selectable", "list class");
			assert.include(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
				"list class");
			assert.strictEqual(list.querySelector(`[role=${list.type}]`).getAttribute("aria-multiselectable"), "true",
				"aria-multiselectable attribute expected");
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			assert.notInclude(firstItem.className, "d-selected", "firstItem.className");
			assert.strictEqual(firstItem.getAttribute("aria-selected"), "false",
				"aria-selected attribute expected on first item");

			// select first item
			list.emit("keydown", { key: "Spacebar" }, firstItem);
			list.emit("keyup", { key: "Spacebar" }, firstItem);
			list.deliver();

			assert.include(firstItem.className, "d-selected", "firstItem.className");
			assert.strictEqual(firstItem.getAttribute("aria-selected"), "true",
				"aria-selected attribute expected on first item after selection");
		}
};

registerSuite("list/Selection", {
	beforeEach: function () {
		if (list) {
			list.destroy();
		}
		list = new List({ source: new Store() });
		list.placeAt(document.body);

		list.source.filter();
		list.source.add({ label: "item 1" });
		list.source.add({ label: "item 2" });
		list.source.add({ label: "item 3" });
		list.deliver();
	},

	tests: {
		"aria listbox with selectionMode 'multiple'": function () {
			testHelper["selectionMode 'multiple'"](true);
		},

		"selectionMode 'multiple'": function () {
			testHelper["selectionMode 'multiple'"]();
		},

		"aria listbox with selectionMode 'single'": function () {
			testHelper["selectionMode 'single'"](true);
		},

		"selectionMode 'single'": function () {
			testHelper["selectionMode 'single'"]();
		},

		"aria listbox with selectionMode 'radio'": function () {
			testHelper["selectionMode 'radio'"](true);
		},

		"selectionMode 'radio'": function () {
			testHelper["selectionMode 'radio'"]();
		},

		"selectionMode 'none'": function () {
			var selectionChangeEvent = null;
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			list.selectionMode = "none";
			list.deliver();
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.include(firstItem.className, "d-list-item", "firstItem.className");

			// Selection event on first item (no effect)
			list.emit("keydown", { key: "Spacebar" }, firstItem);
			list.emit("keyup", { key: "Spacebar" }, firstItem);

			assert.isNull(selectionChangeEvent);
			assert.include(firstItem.className, "d-list-item", "firstItem.className again");
		},

		"revert selection to 'none' clears selection": function () {
			list.selectionMode = "multiple";
			list.deliver();
			list.setSelected(list.source.fetchSync()[0], true);
			list.setSelected(list.source.fetchSync()[1], true);
			assert.deepEqual(list.selectedItems,
				[ list.source.fetchSync()[0], list.source.fetchSync()[1] ]);
			list.selectionMode = "none";
			list.deliver();
			assert.deepEqual(list.selectedItems, []);
		},

		"aria listbox delete selected item": function () {
			testHelper["delete selected item"](true);
		},

		"delete selected item": function () {
			testHelper["delete selected item"]();
		},

		"aria listbox move selected item": function () {
			testHelper["move selected item"](true);
		},

		"move selected item": function () {
			testHelper["move selected item"]();
		},

		"aria listbox aria properties and classes when selection mode is single": function () {
			testHelper["aria properties and classes when selection mode is single"](true);
		},

		"aria properties and classes when selection mode is single": function () {
			testHelper["aria properties and classes when selection mode is single"]();
		},

		"aria listbox aria properties and classes when selection mode is radio": function () {
			testHelper["aria properties and classes when selection mode is radio"](true);
		},

		"aria properties and classes when selection mode is radio": function () {
			testHelper["aria properties and classes when selection mode is radio"]();
		},

		"aria listbox aria properties and classes when selection mode is multiple": function () {
			testHelper["aria properties and classes when selection mode is multiple"](true);
		},

		"aria properties and classes when selection mode is multiple": function () {
			testHelper["aria properties and classes when selection mode is multiple"]();
		},

		"aria properties and classes when selection mode is none": function () {
			list.selectionMode = "none";
			list.deliver();
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-selectable", "list.className");
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
				"list.className");
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			assert.notInclude(firstItem.className, "d-selected", "firstItem.className");
		},

		"aria properties and classes updated when selection mode is changed": function () {
			list.selectionMode = "single";
			list.deliver();

			// select first item
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			list.emit("keydown", { key: "Spacebar" }, firstItem);
			list.emit("keyup", { key: "Spacebar" }, firstItem);
			list.deliver();

			// list
			assert.isFalse(list.querySelector(`[role=${list.type}]`).hasAttribute("aria-multiselectable"),
				"A: no aria-multiselectable attribute expected");
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
				"A: d-multiselectable class");
			assert.include(list.querySelector(`[role=${list.type}]`).className, "d-selectable", "A: d-selectable class");

			// first item
			assert.strictEqual(firstItem.getAttribute("aria-selected"), "true",
				"A: aria-selected attribute expected on first item");
			assert.include(firstItem.className, "d-selected", "A: d-selected class on first item");

			// second item
			var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
			assert.strictEqual(secondItem.getAttribute("aria-selected"), "false",
				"A: aria-selected 'false' expected on second item");
			assert.notInclude(secondItem.className, "d-selected", "A: no d-selected class on second item");

			// third item
			var thirdItem = list.querySelector(`[role=${list.type}] > *:nth-child(3)`);
			assert.strictEqual(thirdItem.getAttribute("aria-selected"), "false",
				"A: aria-selected 'false' expected on third item");
			assert.notInclude(thirdItem.className, "d-selected", "A: no d-selected class on third item");

			list.selectionMode = "multiple";
			list.deliver();

			// list
			assert(list.querySelector(`[role=${list.type}]`).hasAttribute("aria-multiselectable"),
				"B: aria-multiselectable attribute expected");
			assert.include(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
				"B: d-multiselectable class");
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-selectable",
				"B: d-selectable class");

			// first item
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			assert.strictEqual(firstItem.getAttribute("aria-selected"), "true",
				"B: aria-selected attribute expected on first item");
			assert.include(firstItem.className, "d-selected", "B: d-selected class on first item");

			// second item
			var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
			assert.strictEqual(secondItem.getAttribute("aria-selected"), "false",
				"B: aria-selected attribute expected on second item");
			assert.notInclude(secondItem.className, "d-selected", "B: d-selected class on second item");

			// third item
			var thirdItem = list.querySelector(`[role=${list.type}] > *:nth-child(3)`);
			assert.strictEqual(thirdItem.getAttribute("aria-selected"), "false",
				"B: aria-selected attribute expected on third item");
			assert.notInclude(thirdItem.className, "d-selected", "B: d-selected class on third item");

			list.selectionMode = "none";
			list.deliver();

			// list
			assert.isFalse(list.querySelector(`[role=${list.type}]`).hasAttribute("aria-multiselectable"),
				"C: no aria-multiselectable attribute expected");
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-multiselectable",
				"C: d-multiselectable class");
			assert.notInclude(list.querySelector(`[role=${list.type}]`).className, "d-selectable",
				"C: d-selectable class");

			// first item
			var firstItem = list.querySelector(`[role=${list.type}] > *:nth-child(1)`);
			assert.isFalse(firstItem.hasAttribute("aria-selected"),
				"C: no aria-selected attribute expected on first item");
			assert.notInclude(firstItem.className, "d-selected", "C: d-selected class on first item");

			// second item
			var secondItem = list.querySelector(`[role=${list.type}] > *:nth-child(2)`);
			assert.isFalse(secondItem.hasAttribute("aria-selected"),
				"C: no aria-selected attribute expected on second item");
			assert.notInclude(secondItem.className, "d-selected", "C: d-selected class on second item");

			// third item
			var thirdItem = list.querySelector(`[role=${list.type}] > *:nth-child(3)`);
			assert.isFalse(thirdItem.hasAttribute("aria-selected"),
				"C: no aria-selected attribute expected on third item");
			assert.notInclude(thirdItem.className, "d-selected", "C: d-selected class on third item");
		}
	},

	after: function () {
		if (list) {
			list.destroy();
		}
	}
});

