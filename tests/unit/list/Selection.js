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
			list.startup();
			list.store.query();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
		},
		"selectionMode 'multiple'" : function () {
			var selectionChangeEvent = null;
			var firstItem = list.getChildren()[0];
			var secondItem = list.getChildren()[1];
			var event = null;
			list.selectionMode = "multiple";
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
			assert.equal(firstItem.className, "d-list-item d-selected");
			assert.equal(secondItem.className, "d-list-item");
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
			assert.equal(firstItem.className, "d-list-item d-selected");
			assert.equal(secondItem.className, "d-list-item d-selected");
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
			assert.equal(firstItem.className, "d-list-item");
			assert.equal(secondItem.className, "d-list-item d-selected");
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
			assert.equal(firstItem.className, "d-list-item d-selected");
			assert.equal(secondItem.className, "d-list-item");
			// Selection event on second item (select)
			event = {target: secondItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNotNull(selectionChangeEvent);
			assert.equal(selectionChangeEvent.oldValue.label, "item 1", "event2 old selection");
			assert.equal(selectionChangeEvent.newValue.label, "item 2", "event2 new selection");
			assert.equal(selectionChangeEvent.renderer, secondItem, "event2 renderer");
			assert.equal(selectionChangeEvent.triggerEvent, event, "event2 triggerEvent");
			selectionChangeEvent = null;
			assert.equal(firstItem.className, "d-list-item");
			assert.equal(secondItem.className, "d-list-item d-selected");
			// Selection event on second item (deselect)
			event = {target: secondItem, preventDefault: function () {}};
			list._actionKeydownHandler(event);
			assert.isNotNull(selectionChangeEvent);
			assert.equal(selectionChangeEvent.oldValue.label, "item 2", "event3 old selection");
			assert.equal(selectionChangeEvent.newValue, null, "event3 new selection");
			assert.equal(selectionChangeEvent.renderer, secondItem, "event3 renderer");
			assert.equal(selectionChangeEvent.triggerEvent, event, "event3 triggerEvent");
			selectionChangeEvent = null;
			assert.equal(firstItem.className, "d-list-item");
			assert.equal(secondItem.className, "d-list-item");
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
			// now listen to selection-cnahge event and remove the selected item from the store
			list.on("selection-change", function (event) {
				selectionChangeEvent = event;
			});
			list.store.remove(firstItem.item.id);
			assert.isNotNull(selectionChangeEvent);
			assert.equal("item 1", selectionChangeEvent.oldValue.label);
			assert.isNull(selectionChangeEvent.newValue);
		},
		teardown : function () {
			list.destroy();
			list = null;
		}
	});
});
