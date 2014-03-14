define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;

	registerSuite({
		name: "list/Selection",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List();
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
		},
		"selectionMode 'multiple'" : function () {
			var dfd = this.async(1000);
			list.selectionMode = "multiple";
			setTimeout(dfd.callback(function () {
				var selectionChangeEvent = null;
				var firstItem = list.getChildren()[0];
				var secondItem = list.getChildren()[1];
				var event = null;
				list.on("selection-change", function (event) {
					selectionChangeEvent = event;
				});
				assert.equal(firstItem.className, "d-list-item");
				// Selection event on first item (select)
				event = {target: firstItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.isNotNull(selectionChangeEvent);
				assert.equal(selectionChangeEvent.oldValue.length, 0, "event1 old selection length");
				assert.equal(selectionChangeEvent.newValue.length, 1, "event1 new selection length");
				assert.equal(selectionChangeEvent.newValue[0].label, "item 1", "event1 new selection label");
				assert.equal(selectionChangeEvent.renderer, firstItem, "event1 renderer");
				assert.equal(selectionChangeEvent.triggerEvent, event, "event1 triggerEvent");
				selectionChangeEvent = null;
				assert.equal(firstItem.getAttribute("aria-selected"), "true");
				assert.equal(secondItem.getAttribute("aria-selected"), "false");
				// Selection event on second item (select)
				event = {target: secondItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.isNotNull(selectionChangeEvent);
				assert.equal(selectionChangeEvent.oldValue.length, 1, "event2 old selection length");
				assert.equal(selectionChangeEvent.oldValue[0].label, "item 1", "event2 old selection label");
				assert.equal(selectionChangeEvent.newValue.length, 2, "event2 new selection length");
				assert.equal(selectionChangeEvent.newValue[0].label, "item 2", "event2 new selection label 1");
				assert.equal(selectionChangeEvent.newValue[1].label, "item 1", "event2 new selection label 2");
				assert.equal(selectionChangeEvent.renderer, secondItem, "event2 renderer");
				assert.equal(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
				selectionChangeEvent = null;
				assert.equal(firstItem.getAttribute("aria-selected"), "true");
				assert.equal(secondItem.getAttribute("aria-selected"), "true");
				// Selection event on first item (deselect)
				event = {target: firstItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.isNotNull(selectionChangeEvent);
				assert.equal(selectionChangeEvent.oldValue.length, 2, "event3 old selection length");
				assert.equal(selectionChangeEvent.oldValue[0].label, "item 2", "event3 old selection label 1");
				assert.equal(selectionChangeEvent.oldValue[1].label, "item 1", "event3 old selection label 2");
				assert.equal(selectionChangeEvent.newValue.length, 1, "event3 new selection length");
				assert.equal(selectionChangeEvent.newValue[0].label, "item 2", "event3 new selection label");
				assert.equal(selectionChangeEvent.renderer, firstItem, "event3 renderer");
				assert.equal(selectionChangeEvent.triggerEvent, event, "event3 triggerEvent");
				selectionChangeEvent = null;
				// 
				assert.equal(firstItem.getAttribute("aria-selected"), "false");
				assert.equal(secondItem.getAttribute("aria-selected"), "true");
			}), 100);
			return dfd;
		},
		"selectionMode 'single'" : function () {
			var selectionChangeEvent = null;
			var firstItem = list.getChildren()[0];
			var secondItem = list.getChildren()[1];
			var event = null;
			list.selectionMode = "single";
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.equal(firstItem.className, "d-list-item");
			// Selection event on first item (select)
			event = {target: firstItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNotNull(selectionChangeEvent);
			assert.equal(selectionChangeEvent.oldValue, null, "event1 old selection");
			assert.equal(selectionChangeEvent.newValue.label, "item 1", "event1 new selection");
			assert.equal(selectionChangeEvent.renderer, firstItem, "event1 renderer");
			assert.equal(selectionChangeEvent.triggerEvent, event, "event1 triggerEvent");
			selectionChangeEvent = null;
			assert.equal(firstItem.getAttribute("aria-selected"), "true");
			assert.isFalse(secondItem.hasAttribute("aria-selected"));
			// Selection event on second item (select)
			event = {target: secondItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNotNull(selectionChangeEvent);
			assert.equal(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
			assert.equal(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
			assert.equal(selectionChangeEvent.renderer, secondItem, "event2 renderer");
			assert.equal(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
			selectionChangeEvent = null;
			assert.isFalse(firstItem.hasAttribute("aria-selected"));
			assert.equal(secondItem.getAttribute("aria-selected"), "true");
			// Selection event on second item (deselect)
			event = {target: secondItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNotNull(selectionChangeEvent);
			assert.equal(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection");
			assert.equal(selectionChangeEvent.newValue, null, "event3 new selection");
			assert.equal(selectionChangeEvent.renderer, secondItem, "event3 renderer");
			assert.equal(selectionChangeEvent.triggerEvent, event, "event3 triggerEvent");
			selectionChangeEvent = null;
			assert.isFalse(firstItem.hasAttribute("aria-selected"));
			assert.isFalse(secondItem.hasAttribute("aria-selected"));
		},
		"selectionMode 'none'" : function () {
			var selectionChangeEvent = null;
			var firstItem = list.getChildren()[0];
			var event = null;
			list.selectionMode = "none";
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			assert.equal(firstItem.className, "d-list-item");
			// Selection event on first item (no effect)
			event = {target: firstItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNull(selectionChangeEvent);
			assert.equal(firstItem.className, "d-list-item");
		},
		"revert selection to 'none' remove event handler": function () {
			var dfd = this.async(1000);
			list.selectionMode = "single";
			setTimeout(function () {
				assert.isNotNull(list._selectionClickHandle, "single");
				assert.isDefined(list._selectionClickHandle, "single");
				list.selectionMode = "none";
				setTimeout(function () {
					assert.isNull(list._selectionClickHandle, "first none");
					list.selectionMode = "multiple";
					setTimeout(function () {
						assert.isNotNull(list._selectionClickHandle, "multiple");
						assert.isDefined(list._selectionClickHandle, "multiple");
						list.selectionMode = "none";
						setTimeout(function () {
							assert.isNull(list._selectionClickHandle, "second none");
							dfd.resolve();
						}, 0);
					}, 0);
				}, 0);
			}, 0);
			return dfd;
		},
		"delete selected item": function () {
			var selectionChangeEvent = null;
			var firstItem = list.getChildren()[0];
			list.selectionMode = "single";
			// select first item
			var event = {target: firstItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			// now listen to selection-change event and remove the selected item from the store
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			list.store.remove(firstItem.item.id);
			assert.isNotNull(selectionChangeEvent);
			assert.equal("item 1", selectionChangeEvent.oldValue.label);
			assert.isNull(selectionChangeEvent.newValue);
		},
		"move selected item": function () {
			var firstItem = list.getChildren()[0];
			var thirdItem = list.getChildren()[2];
			list.selectionMode = "single";
			// select first item
			var event = {target: firstItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert(list.isSelected(firstItem.item), "item selected before move");
			list.store.put(firstItem.item, {before: thirdItem.item});
			var secondItem = list.getChildren()[1];
			assert(list.isSelected(secondItem.item), "item selected after move");
			assert(secondItem.getAttribute("aria-selected"), "item selected after move (aria-selected attribute)");
		},
		"aria properties when selection mode is single": function () {
			var dfd = this.async(1000);
			list.selectionMode = "single";
			setTimeout(dfd.callback(function () {
				assert.equal(list.getAttribute("aria-selectable"), "true", "aria-selectable attribute expected");
				assert.isFalse(list.hasAttribute("aria-multiselectable"), "no aria-multiselectable attribute expected");
				var firstItem = list.getChildren()[0];
				assert.isFalse(firstItem.hasAttribute("aria-selected"),
						"no aria-selected attribute expected on first item");
				// select first item
				var event = {target: firstItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.equal(firstItem.getAttribute("aria-selected"), "true",
						"aria-selected attribute expected on first item after selection");
			}), 100);
			return dfd;
		},
		"aria properties when selection mode is multiple": function () {
			var dfd = this.async(1000);
			list.selectionMode = "multiple";
			setTimeout(dfd.callback(function () {
				assert.equal(list.getAttribute("aria-multiselectable"), "true",
						"aria-multiselectable attribute expected");
				assert.isFalse(list.hasAttribute("aria-selectable"), "no aria-selectable attribute expected");
				var firstItem = list.getChildren()[0];
				assert.equal(firstItem.getAttribute("aria-selected"), "false",
						"aria-selected attribute expected on first item");
				// select first item
				var event = {target: firstItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.equal(firstItem.getAttribute("aria-selected"), "true",
						"aria-selected attribute expected on first item after selection");
			}), 100);
			return dfd;
		},
		"aria properties when selection mode is none": function () {
			var dfd = this.async(1000);
			list.selectionMode = "none";
			setTimeout(dfd.callback(function () {
				assert.isFalse(list.hasAttribute("aria-multiselectable"), "no aria-multiselectable attribute expected");
				assert.isFalse(list.hasAttribute("aria-selectable"), "no aria-selectable attribute expected");
			}), 100);
			return dfd;
		},
		"aria properties updated when selection mode is changed": function () {
			var dfd = this.async(1000);
			list.selectionMode = "single";
			setTimeout(dfd.rejectOnError(function () {
				var firstItem = list.children[0];
				// select first item
				var event = {target: firstItem, preventDefault: function () {}};
				list._actionKeydownHandler(event);
				assert.isFalse(list.hasAttribute("aria-multiselectable"),
						"A: no aria-multiselectable attribute expected");
				assert.isTrue(list.hasAttribute("aria-selectable"), "A: aria-selectable attribute expected");
				assert.equal(firstItem.getAttribute("aria-selected"), "true",
				"A: aria-selected attribute expected on first item");
				assert.isFalse(list.children[1].hasAttribute("aria-selected"),
						"A: no aria-selected attribute expected on second item");
				assert.isFalse(list.children[2].hasAttribute("aria-selected"),
						"A: no aria-selected attribute expected on third item");
				list.selectionMode = "multiple";
				setTimeout(dfd.rejectOnError(function () {
					assert.isTrue(list.hasAttribute("aria-multiselectable"),
							"B: aria-multiselectable attribute expected");
					assert.isFalse(list.hasAttribute("aria-selectable"), "B: no aria-selectable attribute expected");
					assert.equal(list.children[0].getAttribute("aria-selected"), "true",
					"B: aria-selected attribute expected on first item");
					assert.equal(list.children[1].getAttribute("aria-selected"), "false",
					"B: aria-selected attribute expected on second item");
					assert.equal(list.children[2].getAttribute("aria-selected"), "false",
					"B: aria-selected attribute expected on third item");
					list.selectionMode = "none";
					setTimeout(dfd.callback(function () {
						assert.isFalse(list.hasAttribute("aria-multiselectable"),
								"C: no aria-multiselectable attribute expected");
						assert.isFalse(list.hasAttribute("aria-selectable"),
								"C: no aria-selectable attribute expected");
						assert.isFalse(list.children[0].hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on first item");
						assert.isFalse(list.children[1].hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on second item");
						assert.isFalse(list.children[2].hasAttribute("aria-selected"),
						"C: no aria-selected attribute expected on third item");
					}), 100);
				}), 100);
			}), 100);
			return dfd;
		},
		teardown : function () {
			list.destroy();
		}
	});
});
