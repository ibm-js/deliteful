define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;

	registerSuite({
		name: "list/AriaMenu",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List({source: [{label: "item 1"}, {label: "item 2"}, {label: "item 3"}]});
			list.type = "menu";
			document.body.appendChild(list);
			list.deliver();
		},
		"aria properties": function () {
			assert.strictEqual(list.type, "menu", "role");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), null, "first renderer role");
			assert.strictEqual(list.containerNode.children[0].renderNode.getAttribute("role"), "menuitem",
					"first renderNode role");
			assert.strictEqual(list.containerNode.children[1].getAttribute("role"), null, "second renderer role");
			assert.strictEqual(list.containerNode.children[1].renderNode.getAttribute("role"), "menuitem",
					"second renderNode role");
			assert.strictEqual(list.containerNode.children[2].getAttribute("role"), null, "third renderer role");
			assert.strictEqual(list.containerNode.children[2].renderNode.getAttribute("role"), "menuitem",
					"third renderNode role");
		},
		"aria properties when moving from menu to grid": function () {
			list.type = "grid";
			list.deliver();
			assert.strictEqual(list.type, "grid", "role");
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
