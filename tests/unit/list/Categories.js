define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List"
], function (registerSuite, assert, List) {

	var list = null;

	var checkCategory = function (node, expectedCategory) {
		assert.equal(node.tagName, "D-LIST-CATEGORY-RENDERER");
		assert.equal(node.className, "d-list-category");
		assert.equal(node.textContent, expectedCategory);
	};

	var checkItem = function (node, expectedLabel) {
		assert.equal(node.tagName, "D-LIST-ITEM-RENDERER");
		assert.equal(node.className, "d-list-item");
		assert.equal(node.getElementsByClassName("d-list-item-label")[0].innerHTML, expectedLabel);
	};

	registerSuite({
		name: "list/Categories",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List();
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.categoryAttr = "category";
			list.store.add({category: "A", label: "item 1"});
			list.store.add({category: "A", label: "item 2"});
			list.store.add({category: "A", label: "item 3"});
			list.store.add({category: "B", label: "item 4"});
			list.store.add({category: "B", label: "item 5"});
			list.store.add({category: "B", label: "item 6"});
			list.store.add({category: "C", label: "item 7"});
			list.store.add({category: "C", label: "item 8"});
			list.store.add({category: "C", label: "item 9"});
		},
		"categorized items" : function () {
			var children = list.getChildren();
			assert.equal(children.length, 12);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "B");
			checkItem(children[5], "item 4");
			checkItem(children[6], "item 5");
			checkItem(children[7], "item 6");
			checkCategory(children[8], "C");
			checkItem(children[9], "item 7");
			checkItem(children[10], "item 8");
			checkItem(children[11], "item 9");
		},
		"remove all items from category (top and bottom of list)" : function () {
			// remove the three first items
			list.store.remove(list.store.data[0].id);
			list.store.remove(list.store.data[0].id);
			list.store.remove(list.store.data[0].id);
			var children = list.getChildren();
			assert.equal(children.length, 8);
			checkCategory(children[0], "B");
			checkItem(children[1], "item 4");
			checkItem(children[2], "item 5");
			checkItem(children[3], "item 6");
			checkCategory(children[4], "C");
			checkItem(children[5], "item 7");
			checkItem(children[6], "item 8");
			checkItem(children[7], "item 9");
			// remove the three last items
			list.store.remove(list.store.data[list.store.data.length - 1].id);
			list.store.remove(list.store.data[list.store.data.length - 1].id);
			list.store.remove(list.store.data[list.store.data.length - 1].id);
			children = list.getChildren();
			assert.equal(children.length, 4);
			checkCategory(children[0], "B");
			checkItem(children[1], "item 4");
			checkItem(children[2], "item 5");
			checkItem(children[3], "item 6");
			// remove two items
			list.store.remove(list.store.data[0].id);
			list.store.remove(list.store.data[0].id);
			children = list.getChildren();
			assert.equal(children.length, 2);
			checkCategory(children[0], "B");
			checkItem(children[1], "item 6");
			// remove the last item
			list.store.remove(list.store.data[0].id);
			children = list.getChildren();
			assert.equal(children.length, 0);
		},
		"remove all items from category (middle of list)" : function () {
			// remove the three items in the middle
			list.store.remove(list.store.data[3].id);
			list.store.remove(list.store.data[3].id);
			list.store.remove(list.store.data[3].id);
			var children = list.getChildren();
			assert.equal(children.length, 8);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "C");
			checkItem(children[5], "item 7");
			checkItem(children[6], "item 8");
			checkItem(children[7], "item 9");
		},
		"add item within existing category section": function () {
			// add at the bottom of the list
			list.store.add({category: "C", label: "item a"});
			var children = list.getChildren();
			assert.equal(children.length, 13);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "B");
			checkItem(children[5], "item 4");
			checkItem(children[6], "item 5");
			checkItem(children[7], "item 6");
			checkCategory(children[8], "C");
			checkItem(children[9], "item 7");
			checkItem(children[10], "item 8");
			checkItem(children[11], "item 9");
			checkItem(children[12], "item a");
			// add at the top of the last category
			list.store.add({category: "C", label: "item b"}, {before: list.store.data[6]});
			children = list.getChildren();
			assert.equal(children.length, 14);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "B");
			checkItem(children[5], "item 4");
			checkItem(children[6], "item 5");
			checkItem(children[7], "item 6");
			checkCategory(children[8], "C");
			checkItem(children[9], "item b");
			checkItem(children[10], "item 7");
			checkItem(children[11], "item 8");
			checkItem(children[12], "item 9");
			checkItem(children[13], "item a");
			// add in the middle of the second category
			list.store.add({category: "B", label: "item c"}, {before: list.store.data[4]});
			children = list.getChildren();
			assert.equal(children.length, 15);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "B");
			checkItem(children[5], "item 4");
			checkItem(children[6], "item c");
			checkItem(children[7], "item 5");
			checkItem(children[8], "item 6");
			checkCategory(children[9], "C");
			checkItem(children[10], "item b");
			checkItem(children[11], "item 7");
			checkItem(children[12], "item 8");
			checkItem(children[13], "item 9");
			checkItem(children[14], "item a");
			// add at the top of the list
			list.store.add({category: "A", label: "item d"}, {before: list.store.data[0]});
			children = list.getChildren();
			assert.equal(children.length, 16);
			checkCategory(children[0], "A");
			checkItem(children[1], "item d");
			checkItem(children[2], "item 1");
			checkItem(children[3], "item 2");
			checkItem(children[4], "item 3");
			checkCategory(children[5], "B");
			checkItem(children[6], "item 4");
			checkItem(children[7], "item c");
			checkItem(children[8], "item 5");
			checkItem(children[9], "item 6");
			checkCategory(children[10], "C");
			checkItem(children[11], "item b");
			checkItem(children[12], "item 7");
			checkItem(children[13], "item 8");
			checkItem(children[14], "item 9");
			checkItem(children[15], "item a");
		},
		"add item with new category": function () {
			// add at the bottom of the list
			list.store.add({category: "D", label: "item a"});
			var children = list.getChildren();
			assert.equal(children.length, 14);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkCategory(children[4], "B");
			checkItem(children[5], "item 4");
			checkItem(children[6], "item 5");
			checkItem(children[7], "item 6");
			checkCategory(children[8], "C");
			checkItem(children[9], "item 7");
			checkItem(children[10], "item 8");
			checkItem(children[11], "item 9");
			checkCategory(children[12], "D");
			checkItem(children[13], "item a");
			// add at the top of the list
			list.store.add({category: "E", label: "item b"}, {before: list.store.data[0]});
			children = list.getChildren();
			assert.equal(children.length, 16);
			checkCategory(children[0], "E");
			checkItem(children[1], "item b");
			checkCategory(children[2], "A");
			checkItem(children[3], "item 1");
			checkItem(children[4], "item 2");
			checkItem(children[5], "item 3");
			checkCategory(children[6], "B");
			checkItem(children[7], "item 4");
			checkItem(children[8], "item 5");
			checkItem(children[9], "item 6");
			checkCategory(children[10], "C");
			checkItem(children[11], "item 7");
			checkItem(children[12], "item 8");
			checkItem(children[13], "item 9");
			checkCategory(children[14], "D");
			checkItem(children[15], "item a");
			// add in the middle of the list
			list.store.add({category: "F", label: "item c"}, {before: list.store.data[8]});
			children = list.getChildren();
			assert.equal(children.length, 19);
			checkCategory(children[0], "E");
			checkItem(children[1], "item b");
			checkCategory(children[2], "A");
			checkItem(children[3], "item 1");
			checkItem(children[4], "item 2");
			checkItem(children[5], "item 3");
			checkCategory(children[6], "B");
			checkItem(children[7], "item 4");
			checkItem(children[8], "item 5");
			checkItem(children[9], "item 6");
			checkCategory(children[10], "C");
			checkItem(children[11], "item 7");
			checkCategory(children[12], "F");
			checkItem(children[13], "item c");
			checkCategory(children[14], "C");
			checkItem(children[15], "item 8");
			checkItem(children[16], "item 9");
			checkCategory(children[17], "D");
			checkItem(children[18], "item a");
		},
		"custom category attribute": function () {
			var dfd = this.async(1000);
			list.categoryAttr = "label";
			setTimeout(dfd.callback(function () {
				var children = list.getChildren();
				assert.equal(children.length, 18);
				checkCategory(children[0], "item 1");
				checkItem(children[1], "item 1");
				checkCategory(children[2], "item 2");
				checkItem(children[3], "item 2");
				checkCategory(children[4], "item 3");
				checkItem(children[5], "item 3");
				checkCategory(children[6], "item 4");
				checkItem(children[7], "item 4");
				checkCategory(children[8], "item 5");
				checkItem(children[9], "item 5");
				checkCategory(children[10], "item 6");
				checkItem(children[11], "item 6");
				checkCategory(children[12], "item 7");
				checkItem(children[13], "item 7");
				checkCategory(children[14], "item 8");
				checkItem(children[15], "item 8");
				checkCategory(children[16], "item 9");
				checkItem(children[17], "item 9");
			}), 0);
			return dfd;
		},
		"custom category function": function () {
			var dfd = this.async(1000);
			list.categoryFunc = function (item) {
				return item.label;
			};
			setTimeout(dfd.callback(function () {
				var children = list.getChildren();
				assert.equal(children.length, 18);
				checkCategory(children[0], "item 1");
				checkItem(children[1], "item 1");
				checkCategory(children[2], "item 2");
				checkItem(children[3], "item 2");
				checkCategory(children[4], "item 3");
				checkItem(children[5], "item 3");
				checkCategory(children[6], "item 4");
				checkItem(children[7], "item 4");
				checkCategory(children[8], "item 5");
				checkItem(children[9], "item 5");
				checkCategory(children[10], "item 6");
				checkItem(children[11], "item 6");
				checkCategory(children[12], "item 7");
				checkItem(children[13], "item 7");
				checkCategory(children[14], "item 8");
				checkItem(children[15], "item 8");
				checkCategory(children[16], "item 9");
				checkItem(children[17], "item 9");
			}), 0);
			return dfd;
		},
		"Add items on top of a list, all list items of the same category": function () {
			list.destroy();
			list = null;
			list = new List();
			document.body.appendChild(list);
			list.startup();
			list.store.filter();
			list.categoryAttr = "category";
			list.store.add({category: "A", label: "item 4"});
			list.store.add({category: "A", label: "item 5"});
			list.store.add({category: "A", label: "item 6"});
			var children = list.getChildren();
			assert.equal(children.length, 4);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 4");
			checkItem(children[2], "item 5");
			checkItem(children[3], "item 6");
			list._renderNewItems([{category: "A", label: "item 1"},
			                     {category: "A", label: "item 2"},
			                     {category: "A", label: "item 3"}], true);
			children = list.getChildren();
   			assert.equal(children.length, 7);
			checkCategory(children[0], "A");
			checkItem(children[1], "item 1");
			checkItem(children[2], "item 2");
			checkItem(children[3], "item 3");
			checkItem(children[4], "item 4");
			checkItem(children[5], "item 5");
			checkItem(children[6], "item 6");
		},
		teardown : function () {
			list.destroy();
			list = null;
		}
	});
});
