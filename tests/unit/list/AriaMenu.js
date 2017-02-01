define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;
	var data = [{label: "item 1"}, {label: "item 2"}, {label: "item 3"}];

	registerSuite({
		name: "list/AriaMenu",

		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List({source: data});
			list.type = "menu";
			document.body.appendChild(list);
			list.deliver();
		},

		"aria properties for role=menu": function () {
			assert.strictEqual(list.type, "menu", "role");
			assert.strictEqual(list.containerNode.hasAttribute("aria-readonly"), false,
				"aria-readonly only for role=grid");
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

		"programmatic selection": function () {
			// Not sure if you can click menu choices to select them, but you should be able to
			// programatically mark them as selected.  They don't get the aria-selected attribute
			// though because that's not allowed on role=menuitem nodes.

			list.selectionMode = "single";
			list.selectedItem = data[0];
			list.deliver();
			var firstItem = list.containerNode.children[0];
			assert.match(firstItem.className, /d-selected/, "d-selected class on firstItem");

			list.selectedItem = data[1];
			list.deliver();
			assert.notMatch(firstItem.className, /d-selected/, "d-selected class removed from firstItem");
			var secondItem = list.containerNode.children[1];
			assert.match(secondItem.className, /d-selected/, "d-selected class on secondItem");
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
