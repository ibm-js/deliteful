define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;

	registerSuite({
		name: "list/AriaListbox",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List();
			list.isAriaListbox = true;
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
			list.deliver();
		},
		"aria properties": function () {
			assert.strictEqual(list.getAttribute("role"), "listbox", "role");
			assert.strictEqual(list.firstChild.children[0].getAttribute("role"), null, "first renderer role");
			assert.strictEqual(list.firstChild.children[0].renderNode.getAttribute("role"), "option",
					"first renderNode role");
			assert.strictEqual(list.firstChild.children[1].getAttribute("role"), null, "second renderer role");
			assert.strictEqual(list.firstChild.children[1].renderNode.getAttribute("role"), "option",
					"second renderNode role");
			assert.strictEqual(list.firstChild.children[2].getAttribute("role"), null, "third renderer role");
			assert.strictEqual(list.firstChild.children[2].renderNode.getAttribute("role"), "option",
					"third renderNode role");
		},
		"aria properties when moving from listbox to grid": function () {
			list.isAriaListbox = false;
			list.deliver();
			assert.strictEqual(list.getAttribute("role"), "grid", "role");
			assert.strictEqual(list.firstChild.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.firstChild.children[0].renderNode.getAttribute("role"), "gridcell",
					"first renderNode role");
			assert.strictEqual(list.firstChild.children[1].getAttribute("role"), "row", "second renderer role");
			assert.strictEqual(list.firstChild.children[1].renderNode.getAttribute("role"), "gridcell",
					"second renderNode role");
			assert.strictEqual(list.firstChild.children[2].getAttribute("role"), "row", "third renderer role");
			assert.strictEqual(list.firstChild.children[2].renderNode.getAttribute("role"), "gridcell",
					"third renderNode role");
		},
		"default selectionMode": function () {
			assert.strictEqual(list.selectionMode, "single");
		},
		"selectionMode 'none' is invalid and do not change the current selection mode": function () {
			try {
				list.selectionMode = "none";
				assert.fail("error", "", "error expected");
			} catch (error) {
				assert.strictEqual(error.message,
						"selectionMode 'none' is invalid for an aria lisbox, keeping the previous value of 'single'",
						"error message");
				assert.strictEqual(list.selectionMode, "single", "expected selection mode 1");
			}
			list.selectionMode = "multiple";
			list.deliver();
			try {
				list.selectionMode = "none";
				assert.fail("error", "", "error expected");
			} catch (error) {
				assert.strictEqual(error.message,
					"selectionMode 'none' is invalid for an aria lisbox, keeping the previous value of 'multiple'",
					"error message");
				assert.strictEqual(list.selectionMode, "multiple", "expected selection mode 2");
			}
		},
		teardown : function () {
			list.destroy();
		}
	});
});
