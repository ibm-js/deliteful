import List from "deliteful/list/List";

var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

var list = null;

registerSuite("list/AriaList", {
	beforeEach: function () {
		if (list) {
			list.destroy();
		}
		list = new List({ source: [ { label: "item 1" }, { label: "item 2" }, { label: "item 3" } ] });
		list.placeAt(document.body);
		list.deliver();
	},

	tests: {
		"aria properties for role=grid": function () {
			assert.strictEqual(list.type, "grid", "role");
			assert(list.containerNode.hasAttribute("aria-readonly"), "aria-readonly for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.containerNode.children[0].firstElementChild.getAttribute("role"), "gridcell",
				"first gridcell role");
		},

		"aria properties for role=list": function () {
			list.type = "list";
			list.deliver();
			assert.strictEqual(list.type, "list", "role");
			assert.strictEqual(list.containerNode.hasAttribute("aria-readonly"), false,
				"aria-readonly only for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "listitem",
				"first renderer role");
		},

		"aria properties when moving from list to grid": function () {
			list.type = "list";
			list.deliver();
			list.type = "grid";
			list.deliver();
			assert.strictEqual(list.type, "grid", "role");
			assert.strictEqual(list.containerNode.getAttribute("aria-readonly"), "true",
				"aria-readonly for role=grid");
			assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "row", "first renderer role");
			assert.strictEqual(list.containerNode.children[0].firstElementChild.getAttribute("role"), "gridcell",
				"first gridcell role");
		}
	},

	after: function () {
		if (list) {
			list.destroy();
		}
	}
});

