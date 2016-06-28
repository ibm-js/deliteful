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
			list = new List({source: [{label: "item 1"}, {label: "item 2"}, {label: "item 3"}]});
			list.placeAt(document.body);
			list.deliver();
		},

		"aria properties for role=grid": function () {
			assert.strictEqual(list.type, "grid", "role");
			assert(list.containerNode.hasAttribute("aria-readonly"), "aria-readonly for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.containerNode.children[0].renderNode.getAttribute("role"), "gridcell",
				"first renderNode role");
			assert.strictEqual(list.containerNode.children[1].getAttribute("role"), "row", "second renderer role");
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("role"), "gridcell",
				"second renderNode role");
			assert.strictEqual(list.containerNode.children[2].getAttribute("role"), "row", "third renderer role");
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("role"), "gridcell",
				"third renderNode role");
		},

		"aria properties for role=listbox": function () {
			list.type = "listbox";
			list.deliver();
			assert.strictEqual(list.type, "listbox", "role");
			assert.strictEqual(list.containerNode.hasAttribute("aria-readonly"), false,
				"aria-readonly only for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), null, "first renderer role");
			assert.strictEqual(list.containerNode.children[0].renderNode.getAttribute("role"), "option",
					"first renderNode role");
			assert.strictEqual(list.containerNode.children[1].getAttribute("role"), null, "second renderer role");
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("role"), "option",
					"second renderNode role");
			assert.strictEqual(list.containerNode.children[2].getAttribute("role"), null, "third renderer role");
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("role"), "option",
					"third renderNode role");
		},

		"aria properties when moving from listbox to grid": function () {
			list.type = "listbox";
			list.deliver();
			list.type = "grid";
			list.deliver();
			assert.strictEqual(list.type, "grid", "role");
			assert.strictEqual(list.containerNode.getAttribute("aria-readonly"), "true",
				"aria-readonly for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.containerNode.children[0].renderNode.getAttribute("role"), "gridcell",
					"first renderNode role");
			assert.strictEqual(list.containerNode.children[1].getAttribute("role"), "row", "second renderer role");
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("role"), "gridcell",
					"second renderNode role");
			assert.strictEqual(list.containerNode.children[2].getAttribute("role"), "row", "third renderer role");
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("role"), "gridcell",
					"third renderNode role");
		},

		teardown : function () {
			list.destroy();
		}
	});
});
