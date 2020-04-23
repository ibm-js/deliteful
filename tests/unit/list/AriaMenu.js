import List from "deliteful/list/List";

var registerSuite = intern.getPlugin("interface.object").registerSuite;
var assert = intern.getPlugin("chai").assert;

var list = null;
var data = [ { label: "item 1" }, { label: "item 2" }, { label: "item 3" } ];

registerSuite("list/AriaMenu", {
	beforeEach: function () {
		if (list) {
			list.destroy();
		}
		list = new List({ source: data });
		list.type = "menu";
		document.body.appendChild(list);
		list.deliver();
	},

	tests: {
		"aria properties for role=menu": function () {
			assert.strictEqual(list.type, "menu", "role");
			assert.strictEqual(list.querySelector("[role=menu]").hasAttribute("aria-readonly"), false,
				"aria-readonly only for role=grid");
			assert.strictEqual(list.querySelector("[role=menu]").children[0].getAttribute("role"), "menuitem",
				"first renderer role");
		},

		"programmatic selection": function () {
			// Not sure if you can click menu choices to select them, but you should be able to
			// programatically mark them as selected.  They don't get the aria-selected attribute
			// though because that's not allowed on role=menuitem nodes.

			list.selectionMode = "single";
			list.selectedItem = data[0];
			list.deliver();
			var firstItem = list.querySelector("[role=menu]").children[0];
			assert.match(firstItem.className, /d-selected/, "d-selected class on firstItem");

			list.selectedItem = data[1];
			list.deliver();
			assert.notMatch(firstItem.className, /d-selected/, "d-selected class removed from firstItem");
			var secondItem = list.querySelector("[role=menu]").children[1];
			assert.match(secondItem.className, /d-selected/, "d-selected class on secondItem");
		},

		"aria properties when moving from menu to grid": function () {
			list.type = "grid";
			list.deliver();
			assert.strictEqual(list.type, "grid", "role");
			assert.strictEqual(list.querySelector("[role=grid]").children[0].getAttribute("role"),
				"row", "first renderer role");
			assert.strictEqual(list.querySelector("[role=grid]").children[0].firstElementChild.getAttribute("role"),
				"gridcell", "first gridcell role");
		}
	},

	after: function () {
		if (list) {
			list.destroy();
		}
	}
});

