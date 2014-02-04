define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/list/List",
	"dojo/i18n!deliteful/list/List/nls/List"
], function (registerSuite, assert, List, listMessages) {

	var list = null;

	registerSuite({
		name: "list/List",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new List();
			list.startup();
			list.store.add({label: "item 1"});
			list.store.add({label: "item 2"});
			list.store.add({label: "item 3"});
		},
		"baseClass update" : function () {
			assert.equal(list.className, "d-list");
			list.baseClass = "d-round-rect-list";
			assert.equal(list.className, "d-round-rect-list");
			list.baseClass = "d-list";
			assert.equal(list.className, "d-list");
		},
		"scrollDirection horizontal not supported": function () {
			try {
				list.scrollDirection = "horizontal";
			} catch (error) {
				assert.isNotNull(error);
				console.log(error);
				assert.equal(error.message, listMessages["horizontal-scroll-not-supported"], "error message");
				assert.equal(list.scrollDirection, "none");
			}
		},
		"default scroll direction is vertical": function () {
			var dfd = this.async(1000);
			setTimeout(dfd.callback(function () {
				list.scrollDirection = "vertical";
				assert.equal(list.className, "d-list d-scrollable");
			}), 0);
			return dfd;
		},
		"scroll direction none": function () {
			var dfd = this.async(1000);
			list.scrollDirection = "none";
			setTimeout(dfd.callback(function () {
				list.scrollDirection = "none";
				assert.equal(list.className, "d-list");
			}), 0);
			return dfd;
		},
		"getRendererByItem": function () {
			var children = list.getChildren();
			assert.equal(list.getRendererByItem(list.store.data[0]), children[0], "first renderer");
			assert.equal(list.getRendererByItem(list.store.data[1]), children[1], "second renderer");
			assert.equal(list.getRendererByItem(list.store.data[2]), children[2], "third renderer");
			assert.isNull(list.getRendererByItem({label: "I do not exist"}), "non list item");
		},
		"getItemRendererIndex": function () {
			var children = list.getChildren();
			assert.equal(0, list.getItemRendererIndex(children[0]), "first renderer");
			assert.equal(1, list.getItemRendererIndex(children[1]), "second renderer");
			assert.equal(2, list.getItemRendererIndex(children[2]), "second renderer");
			assert.equal(-1, list.getItemRendererIndex(list), "non list renderer");
		},
		"getEnclosingRenderer": function () {
			var children = list.getChildren();
			assert.equal(list.getEnclosingRenderer(children[0]), children[0], "first");
			assert.equal(list.getEnclosingRenderer(children[0].getChildren()[0]), children[0], "second");
			assert.isNull(list.getEnclosingRenderer(list), "third");
		},
		"_renderNewItems": function () {
			list._renderNewItems([{label: "item a"}, {label: "item b"}, {label: "item c"}], true);
			var children = list.getChildren();
			assert.equal(children.length, 6, "nb of items");
			assert.equal(children[0].item.label, "item a", "first added 1");
			assert.equal(children[1].item.label, "item b", "first added 2");
			assert.equal(children[2].item.label, "item c", "firstd added 3");
			list._renderNewItems([{label: "item d"}, {label: "item e"}, {label: "item f"}], false);
			children = list.getChildren();
			assert.equal(children.length, 9, "nb of items 2");
			assert.equal(children[6].item.label, "item d", "last added 1");
			assert.equal(children[7].item.label, "item e", "last added 2");
			assert.equal(children[8].item.label, "item f", "last added 3");
		},
		"_getFirstRenderer": function () {
			var dfd = this.async(1000);
			var children = list.getChildren();
			assert.equal(list._getFirstRenderer(), children[0]);
			list.categoryAttr = "label";
			setTimeout(function () {
				children = list.getChildren();
				assert.equal(children[0].category, "item 1", "first is category");
				assert.equal(list._getFirstRenderer(), children[0], "first renderer is category");
				dfd.resolve();
			}, 0);
			return dfd;
		},
		"_getLastRenderer": function () {
			var children = list.getChildren();
			assert.equal(list._getLastRenderer(), children[2]);
		},
		"update item label": function () {
			list.store.put({label: "item a"}, {id: list.store.data[0].id});
			var children = list.getChildren();
			assert.equal(children[0].item.label, "item a");
			assert.equal(children[0].getChildren()[0].innerHTML, "item a");
		},
		"update item: add and remove icon" : function () {
			list.store.put({label: "item a", icon: "../../images/plus.gif"}, {id: list.store.data[0].id});
			var children = list.getChildren();
			assert.equal(children[0].item.label, "item a");
			assert.equal(children[0].getChildren()[0].className, "d-list-item-icon");
			assert(children[0].getChildren()[0].src.match(/images\/plus.gif$/));
			assert.equal(children[0].getChildren()[1].className, "d-list-item-label");
			assert.equal(children[0].getChildren()[1].innerHTML, "item a");
			list.store.put({label: "item a"}, {id: list.store.data[0].id});
			children = list.getChildren();
			assert.equal(children[0].item.label, "item a");
			assert.equal(children[0].getChildren()[0].className, "d-list-item-label");
			assert.equal(children[0].getChildren()[0].innerHTML, "item a");
		},
		"item category attribute is not undefined by StoreMap": function () {
			list.destroy();
			list = new List();
			list.startup();
			list.store.add({label: "item 1", category: "category 1"});
			assert.equal(list.getChildren()[0].item.category, "category 1");
		},
		teardown : function () {
			list.destroy();
			list = null;
		}
	});
});
