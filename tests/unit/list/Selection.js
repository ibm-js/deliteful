define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List",
	"dstore/Memory",
	"dstore/Trackable"
], function (registerSuite, assert, List, Memory, Trackable) {

	var list = null;

	var Store = Memory.createSubclass([Trackable], {});

	var testHelper = {
		"Helper selectionMode 'multiple'": function (isListBox) {
			if (isListBox) {
				list.type = "listbox";
			}
			list.selectionMode = "multiple";
			list.deliver();
			var selectionChangeEvent = null;
			var firstItem = list.containerNode.children[0];
			var secondItem = list.containerNode.children[1];
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.strictEqual(firstItem.className, "d-list-item");

			// Selection event on first item (select)
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.isNull(selectionChangeEvent.oldValue, 0, "event1 old selection");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection label");
			assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event1 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");

			// Selection event on second item (select)
			secondItem.emit("keydown", {key: "Spacebar"});
			secondItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection label");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection label 1");
			assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event2 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");

			// Selection event on first item (deselect)
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection label 1");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event3 new selection label");
			assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event3 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event3 triggerEvent");
			selectionChangeEvent = null;
			//
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
		},

		"Helper selectionMode 'single'": function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "single";
			list.deliver();
			var selectionChangeEvent = null;
			var firstItem = list.containerNode.children[0];
			var secondItem = list.containerNode.children[1];
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.strictEqual(firstItem.className, "d-list-item");

			// Selection event on first item (select)
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
			assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event1 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");

			// Selection event on second item (select)
			secondItem.emit("keydown", {key: "Spacebar"});
			secondItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
			assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event2 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");

			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");

			// Selection event on second item (deselect)
			secondItem.emit("keydown", {key: "Spacebar"});
			secondItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection");
			assert.strictEqual(selectionChangeEvent.newValue, null, "event3 new selection");
			assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event3 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event3 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");
		},

		"Helper selectionMode 'radio'": function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "radio";
			list.deliver();
			var selectionChangeEvent = null;
			var firstItem = list.containerNode.children[0];
			var secondItem = list.containerNode.children[1];
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.strictEqual(firstItem.className, "d-list-item");

			// Selection event on first item (select)
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue, null, "event1 old selection");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
			assert.strictEqual(selectionChangeEvent.renderer, firstItem, "event1 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event1 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "false");

			// Selection event on second item (select)
			secondItem.emit("keydown", {key: "Spacebar"});
			secondItem.emit("keyup", {key: "Spacebar"});

			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
			assert.strictEqual(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
			assert.strictEqual(selectionChangeEvent.renderer, secondItem, "event2 renderer");
			assert.strictEqual(selectionChangeEvent.triggerEvent.key, "Spacebar", "event2 triggerEvent");
			selectionChangeEvent = null;
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");

			// Selection event on second item (does not deselect)
			secondItem.emit("keydown", {key: "Spacebar"});
			secondItem.emit("keyup", {key: "Spacebar"});

			assert.isNull(selectionChangeEvent);
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false");
			assert.strictEqual(secondItem.renderNode.getAttribute("aria-selected"), "true");
		},

		"Helper delete selected item": function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "single";
			list.deliver();
			var selectionChangeEvent = null;
			var firstItem = list.containerNode.children[0];

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			// now listen to selection-change event and remove the selected item from the store
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			list.source.remove(firstItem.item.id);
			assert.isNotNull(selectionChangeEvent);
			assert.strictEqual("item 1", selectionChangeEvent.oldValue.label);
			assert.isNull(selectionChangeEvent.newValue);
		},

		"Helper move selected item": function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "single";
			list.deliver();
			var firstItem = list.containerNode.children[0];
			var thirdItem = list.containerNode.children[2];

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert(list.isSelected(firstItem.item), "item selected before move");
			list.source.put(firstItem.item, {beforeId: thirdItem.item.id});
			var secondItem = list.containerNode.children[1];
			assert(list.isSelected(secondItem.item), "item selected after move");
			assert(secondItem.renderNode.getAttribute("aria-selected"),
					"item selected after move (aria-selected attribute)");
		},

		"Helper aria properties and classes when selection mode is single": function (isListbox) {
			if (isListbox) {
				list.isListbox = true;
			}
			list.selectionMode = "single";
			list.deliver();
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") >= 0, "d-selectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") === -1,
				"d-multiselectable class");
			assert.isFalse(list.containerNode.hasAttribute("aria-multiselectable"),
					"no aria-multiselectable attribute expected");
			var firstItem = list.containerNode.children[0];
			assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
					"no aria-selected attribute 'false' expected on first item");

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
					"aria-selected attribute 'true' expected on first item after selection");
		},

		"Helper aria properties and classes when selection mode is radio": function (isListbox) {
			if (isListbox) {
				list.isListbox = true;
			}
			list.selectionMode = "radio";
			list.deliver();
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") >= 0, "d-selectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") === -1,
				"d-multiselectable class");
			assert.isFalse(list.hasAttribute("aria-multiselectable"),
					"no aria-multiselectable attribute expected");
			var firstItem = list.containerNode.children[0];
			assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
					"no aria-selected attribute 'false' expected on first item");

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
					"aria-selected attribute 'true' expected on first item after selection");
		},

		"Helper aria properties and classes when selection mode is multiple":
			function (isListbox) {
			if (isListbox) {
				list.type = "listbox";
			}
			list.selectionMode = "multiple";
			list.deliver();
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") === -1, "d-selectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") >= 0,
				"d-multiselectable class");
			assert.strictEqual(list.containerNode.getAttribute("aria-multiselectable"), "true",
					"aria-multiselectable attribute expected");
			var firstItem = list.containerNode.children[0];
			assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "false",
					"aria-selected attribute expected on first item");

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "d-selected class expected");
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
					"aria-selected attribute expected on first item after selection");
		}
	};

	registerSuite({
		name: "list/Selection",

		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List({source: new Store()});
			list.placeAt(document.body);

			list.source.filter();
			list.source.add({label: "item 1"});
			list.source.add({label: "item 2"});
			list.source.add({label: "item 3"});
			list.deliver();
		},

		"aria listbox with selectionMode 'multiple'": function () {
			testHelper["Helper selectionMode 'multiple'"](true);
		},

		"selectionMode 'multiple'": function () {
			testHelper["Helper selectionMode 'multiple'"]();
		},

		"aria listbox with selectionMode 'single'": function () {
			testHelper["Helper selectionMode 'single'"](true);
		},

		"selectionMode 'single'": function () {
			testHelper["Helper selectionMode 'single'"]();
		},

		"aria listbox with selectionMode 'radio'": function () {
			testHelper["Helper selectionMode 'radio'"](true);
		},

		"selectionMode 'radio'": function () {
			testHelper["Helper selectionMode 'radio'"]();
		},

		"selectionMode 'none'": function () {
			var selectionChangeEvent = null;
			var firstItem = list.containerNode.children[0];
			list.selectionMode = "none";
			list.deliver();
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.strictEqual(firstItem.className, "d-list-item");

			// Selection event on first item (no effect)
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			assert.isNull(selectionChangeEvent);
			assert.strictEqual(firstItem.className, "d-list-item");
		},

		"revert selection to 'none' clears selection": function () {
			list.selectionMode = "multiple";
			list.deliver();
			list.setSelected(list.getItemRendererByIndex(0).item, true);
			list.setSelected(list.getItemRendererByIndex(1).item, true);
			assert.deepEqual(list.selectedItems,
					[list.getItemRendererByIndex(1).item, list.getItemRendererByIndex(0).item]);
			list.selectionMode = "none";
			list.deliver();
			assert.deepEqual(list.selectedItems, []);
		},

		"aria listbox delete selected item": function () {
			testHelper["Helper delete selected item"](true);
		},

		"delete selected item": function () {
			testHelper["Helper delete selected item"]();
		},

		"aria listbox move selected item": function () {
			testHelper["Helper move selected item"](true);
		},

		"move selected item": function () {
			testHelper["Helper move selected item"]();
		},

		"aria listbox aria properties and classes when selection mode is single": function () {
			testHelper["Helper aria properties and classes when selection mode is single"](true);
		},

		"aria properties and classes when selection mode is single": function () {
			testHelper["Helper aria properties and classes when selection mode is single"]();
		},

		"aria listbox aria properties and classes when selection mode is radio": function () {
			testHelper["Helper aria properties and classes when selection mode is radio"](true);
		},

		"aria properties and classes when selection mode is radio": function () {
			testHelper["Helper aria properties and classes when selection mode is radio"]();
		},

		"aria listbox aria properties and classes when selection mode is multiple": function () {
			testHelper["Helper aria properties and classes when selection mode is multiple"](true);
		},

		"aria properties and classes when selection mode is multiple": function () {
			testHelper["Helper aria properties and classes when selection mode is multiple"]();
		},

		"aria properties and classes when selection mode is none": function () {
			list.selectionMode = "none";
			list.deliver();
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") === -1, "d-selectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") === -1, "d-multiselectable class");
			var firstItem = list.containerNode.children[0];
			assert.isTrue(firstItem.className.indexOf("d-selected") === -1, "no d-selected class expected");
		},

		"aria properties and classes updated when selection mode is changed": function () {
			list.selectionMode = "single";
			list.deliver();
			var firstItem = list.containerNode.children[0];

			// select first item
			firstItem.emit("keydown", {key: "Spacebar"});
			firstItem.emit("keyup", {key: "Spacebar"});

			// list
			assert.isFalse(list.containerNode.hasAttribute("aria-multiselectable"),
					"A: no aria-multiselectable attribute expected");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") === -1,
			 "A: d-multiselectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") >= 0, "A: d-selectable class");
			// first item
			assert.strictEqual(firstItem.renderNode.getAttribute("aria-selected"), "true",
			"A: aria-selected attribute expected on first item");
			assert.isTrue(firstItem.className.indexOf("d-selected") >= 0, "A: d-selected class on first item");
			// second item
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("aria-selected"), "false",
					"A: aria-selected 'false' expected on second item");
			assert.isTrue(list.containerNode.children[1].className.indexOf("d-selected") === -1,
					"A: no d-selected class on second item");
			// third item
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("aria-selected"), "false",
					"A: aria-selected 'false' expected on third item");
			assert.isTrue(list.containerNode.children[2].className.indexOf("d-selected") === -1,
					"A: no d-selected class on third item");
			list.selectionMode = "multiple";
			list.deliver();
			// list
			assert.isTrue(list.containerNode.hasAttribute("aria-multiselectable"),
					"B: aria-multiselectable attribute expected");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") >= 0, "B: d-multiselectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") === -1, "B: d-selectable class");
			// first item
			assert.strictEqual(list.containerNode.children[0].renderNode.getAttribute("aria-selected"), "true",
				"B: aria-selected attribute expected on first item");
			assert.isTrue(list.containerNode.children[0].className.indexOf("d-selected") >= 0,
					"B: d-selected class on first item");
			// second item
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("aria-selected"), "false",
			"B: aria-selected attribute expected on second item");
			assert.isTrue(list.containerNode.children[1].className.indexOf("d-selected") === -1,
			"B: d-selected class on second item");
			// third item
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("aria-selected"), "false",
			"B: aria-selected attribute expected on third item");
			assert.isTrue(list.containerNode.children[2].className.indexOf("d-selected") === -1,
			"B: d-selected class on third item");
			list.selectionMode = "none";
			list.deliver();
			// list
			assert.isFalse(list.containerNode.hasAttribute("aria-multiselectable"),
					"C: no aria-multiselectable attribute expected");
			assert.isTrue(list.containerNode.className.indexOf("d-multiselectable") === -1,
				"C: d-multiselectable class");
			assert.isTrue(list.containerNode.className.indexOf("d-selectable") === -1, "C: d-selectable class");
			// first item
			assert.isFalse(list.containerNode.children[0].renderNode.hasAttribute("aria-selected"),
			"C: no aria-selected attribute expected on first item");
			assert.isTrue(list.containerNode.children[0].className.indexOf("d-selected") === -1,
			"C: d-selected class on first item");
			// second item
			assert.isFalse(list.containerNode.children[1].renderNode.hasAttribute("aria-selected"),
			"C: no aria-selected attribute expected on second item");
			assert.isTrue(list.containerNode.children[1].className.indexOf("d-selected") === -1,
			"C: d-selected class on second item");
			// third item
			assert.isFalse(list.containerNode.children[2].renderNode.hasAttribute("aria-selected"),
			"C: no aria-selected attribute expected on third item");
			assert.isTrue(list.containerNode.children[2].className.indexOf("d-selected") === -1,
			"C: d-selected class on third item");
		},

		teardown: function () {
			list.destroy();
		}
	});
});
