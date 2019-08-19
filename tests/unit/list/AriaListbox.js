define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var List = require("deliteful/list/List");

	var list = null;

	registerSuite("list/AriaListbox", {
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List({source: [{label: "item 1"}, {label: "item 2"}, {label: "item 3"}]});
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

			"aria properties for role=listbox": function () {
				list.type = "listbox";
				list.deliver();
				assert.strictEqual(list.type, "listbox", "role");
				assert.strictEqual(list.containerNode.hasAttribute("aria-readonly"), false,
					"aria-readonly only for role=grid");
				assert.strictEqual(list.containerNode.children[0].getAttribute("role"), "option",
					"first renderer role");
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
});
