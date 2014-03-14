define([
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/list/List",
	"deliteful/list/_DefaultStore",
], function (registerSuite, assert, register, List, DefaultStore) {

	var MockList = register("mock-list", [List], {
		put: null,
		added: null,
		removed: null,
		cleanupMock: function () {
			this.put = [];
			this.added = [];
			this.removed = [];
		},
		initMock: function () {
			this.cleanupMock();
			this.startup();
		},
		itemUpdated: function (index, item, items) {
			this.put.push({index: index, item: item, items: items});
		},
		itemAdded: function (index, item, items) {
			this.added.push({index: index, item: item, items: items});
		},
		itemRemoved: function (index, items, keepSelection) {
			this.removed.push({index: index, items: items, keepSelection: keepSelection});
		}
	});

	var list = null;

	var checkArray = function (checked, count, indexes, expectedValues, hint) {
		assert.equal(checked.length, count, hint + ": nb of items");
		var i, currentObserved, currentExpected, attr = null;
		if (indexes) {
			for (i = 0; i < indexes.length; i++) {
				currentObserved = checked[indexes[i]];
				currentExpected = expectedValues[indexes[i]];
				for (attr in currentExpected) {
					assert.deepEqual(currentObserved[attr], currentExpected[attr], hint + ": " + attr + " value");
				}
			}
		}
	};

	registerSuite({
		name: "list/DefaultStore",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
			list = new MockList();
			list.initMock();
		},
		"addItem with no identity" : function () {
			var item = {label: "firstItem"};
			var id = list.store.add(item);
			assert.isDefined(id, "id should be defined");
			assert.isNotNull(id, "id should be not null");
			checkArray(list.added,
						1,
						[0],
						[{index: 0, item: {id: id,
							category: undefined,
							label: "firstItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null}],
						"added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed, 0, null, null, "removed");
			var result = list.store.filter();
			checkArray(result, 1, [0], [item], "query result");
		},
		"addItem with identity" : function () {
			var item = {id: "item0", label: "firstItem"};
			var id = list.store.add(item);
			assert.equal(id, "item0");
			checkArray(list.added,
						1,
						[0],
						[{index: 0, item: {id: "item0",
							category: undefined,
							label: "firstItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null}],
						"added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed, 0, null, null, "removed");
			var result = list.store.filter();
			checkArray(result, 1, [0], [item], "query result");
		},
		"addItem with identity in options" : function () {
			var item = {label: "firstItem"};
			var id = list.store.add(item, {id: "item0"});
			assert.equal(id, "item0");
			checkArray(list.added,
						1,
						[0],
						[{index: 0, item: {id: "item0",
							category: undefined,
							label: "firstItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null}],
						"added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed, 0, null, null, "removed");
			var result = list.store.filter();
			checkArray(result, 1, [0], [item], "query result");
		},
		"addItem at the end" : function () {
			var item1 = {label: "firstItem"};
			var item2 = {label: "secondItem"};
			var item3 = {label: "thirdItem"};
			var id1 = list.store.add(item1);
			var id2 = list.store.add(item2);
			var id3 = list.store.add(item3);
			checkArray(list.added,
						3,
						[0, 1, 2],
						[{index: 0, item: {id: id1,
							category: undefined,
							label: "firstItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null},
						 {index: 1, item: {id: id2,
							category: undefined,
							label: "secondItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							 }, items: null},
						 {index: 2, item: {id: id3,
							category: undefined,
							label: "thirdItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							 }, items: null}],
						"added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed, 0, null, null, "removed");
			var result = list.store.filter();
			checkArray(result, 3, [0, 1, 2], [item1, item2, item3], "query result");
		},
		"addItem before another one" : function () {
			var item1 = {label: "firstItem"};
			var item2 = {label: "secondItem"};
			var item3 = {label: "thirdItem"};
			var id1 = list.store.add(item1);
			var id3 = list.store.add(item3);
			var id2 = list.store.add(item2, {before: item3});
			checkArray(list.added,
						3,
						[0, 1, 2],
						[{index: 0, item: {id: id1,
							category: undefined,
							label: "firstItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null},
						 {index: 1, item: {id: id3,
							category: undefined,
							label: "thirdItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							 }, items: null},
						 {index: 1, item: {id: id2,
							category: undefined,
							label: "secondItem",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							 }, items: null}],
						"added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed, 0, null, null, "removed");
			var result = list.store.filter();
			checkArray(result, 3, [0, 1, 2], [item1, item2, item3], "query result");
		},
		"add existing item id" : function () {
			list.store.add({id: 1, label: "foo"});
			try {
				list.store.add({id: 1, label: "bar"});
				assert.fail("exception was expected");
			} catch (e) {
				assert.equal(e.message, "Item already exists");
			}
		},
		"get" : function () {
			var id1 = list.store.add({id: "first", label: "first"});
			var id2 = list.store.add({label: "second"});
			var id3 = list.store.add({label: "third"}, {id: "third"});
			assert.equal(id1, "first", "first id");
			assert.isDefined(id2, "second id");
			assert.isNotNull(id2, "second id");
			assert.equal(id3, "third", "third id");
			assert.equal(list.store.get(id1).label, "first", "first item label");
			assert.equal(list.store.get(id2).label, "second", "second item label");
			assert.equal(list.store.get(id3).label, "third", "third item label");
			assert.isUndefined(list.store.get("unexisting id"), "unexisting id");
		},
		"getIdentity" : function () {
			var item1 = {id: "first", label: "first"};
			var id1 = list.store.add(item1);
			var item2 = {label: "second"};
			var id2 = list.store.add(item2);
			var item3 = {label: "third"};
			var id3 = list.store.add(item3, {id: "third"});
			assert.equal(list.store.getIdentity(item1), id1, "id first item");
			assert.equal(list.store.getIdentity(item2), id2, "id second item");
			assert.equal(list.store.getIdentity(item3), id3, "id third item");
		},
		"custom idProperty" : function () {
			list.store.idProperty = "foo";
			var item1 = {foo: "first", label: "first"};
			var id1 = list.store.add(item1);
			assert.equal(id1, "first", "id first item");
			var item2 = {label: "second"};
			var id2 = list.store.add(item2);
			assert.isDefined(list.store.get(id2).foo, "foo attribute second item");
			assert.isNotNull(list.store.get(id2).foo, "foo attribute second item");
			var item3 = {label: "third"};
			var id3 = list.store.add(item3, {id: "third"});
			assert.equal(list.store.get(id3).foo, "third", "foo attribute third item");
		},
		"remove" : function () {
			var item1 = {label: "first"};
			var item2 = {label: "second", id: "second"};
			var item3 = {label: "third"};
			var id1 = list.store.add(item1);
			list.store.add(item2);
			list.store.add(item3, {id: "third"});
			var result = list.store.filter();
			checkArray(result, 3, [0, 1, 2], [item1, item2, item3], "query result");
			list.cleanupMock();
			list.store.remove(id1);
			list.store.remove("second");
			list.store.remove("third");
			checkArray(list.added, 0, null, null, "added");
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed,
						3,
						[0, 1, 2],
						[{index: 0,
						  items: null,
						  keepSelection: false},
						 {index: 0,
						  items: null,
						  keepSelection: false},
						 {index: 0,
						  items: null,
						  keepSelection: false}],
						"removed");
			result = list.store.filter();
			checkArray(result, 0, null, null, "query result");
		},
		"remove unexisting item": function () {
			assert.isUndefined(list.store.remove("non existing id"));
		},
		"update with put" : function () {
			var item1 = {label: "first"};
			var item2 = {label: "second"};
			var id1 = list.store.add(item1);
			var result = list.store.filter();
			checkArray(result, 1, [0], [item1], "query result");
			list.cleanupMock();
			list.store.put(item2, {id: id1});
			assert.equal(list.store.get(id1), item2, "item after update");
			checkArray(list.put,
					1,
					[0],
					[{index: 0, item: {id: id1,
						category: undefined,
						label: "second",
						iconclass: undefined,
						righttext: undefined,
						righticonclass: undefined}, items: null}],
					"put");
			checkArray(list.added, 0, null, null, "added");
			checkArray(list.removed, 0, null, null, "removed");
			result = list.store.filter();
			checkArray(result, 1, [0], [item2], "query result");
		},
		"query" : function () {
			var item1 = {id: 1, label: "first"};
			var item2 = {id: 2, label: "second"};
			var item3 = {id: 3, label: "third"};
			list.store.add(item1);
			list.store.add(item2);
			list.store.add(item3);
			var result = list.store.filter();
			checkArray(result,
					3,
					[0, 1, 2],
					[item1, item2, item3],
					"query result");
		},
		"move with put" : function () {
			var item1 = {id: 1, label: "first"};
			var item2 = {id: 2, label: "second"};
			var item3 = {id: 3, label: "third"};
			list.store.add(item1);
			list.store.add(item2);
			list.store.add(item3);
			list.cleanupMock();
			list.store.put(item3, {before: item2});
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed,
						1,
						[0],
						[{index: 2,
						  items: null,
						  keepSelection: true}],
						"removed");
			checkArray(list.added,
						1,
						[0],
						[{index: 1, item: {id: 3,
							category: undefined,
							label: "third",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null}],
						"added");
			var result = list.store.filter();
			checkArray(result, 3, [0, 1, 2], [item1, item3, item2], "query result after move");
		},
		"move and update with put" : function () {
			var item1 = {id: 1, label: "first"};
			var item2 = {id: 2, label: "second"};
			var item3 = {id: 3, label: "third"};
			var item3updated = {label: "fourth"};
			list.store.add(item1);
			list.store.add(item2);
			list.store.add(item3);
			list.cleanupMock();
			list.store.put(item3updated, {id: 3, before: item2});
			checkArray(list.put, 0, null, null, "put");
			checkArray(list.removed,
						1,
						[0],
						[{index: 2,
						  items: null,
						  keepSelection: true}],
						"removed");
			checkArray(list.added,
						1,
						[0],
						[{index: 1, item: {id: 3,
							category: undefined,
							label: "fourth",
							iconclass: undefined,
							righticonclass: undefined,
							righttext: undefined
							}, items: null}],
						"added");
			var result = list.store.filter();
			checkArray(result, 3, [0, 1, 2], [item1, item3updated, item2], "query result after move");
		},
		"use attribute mapping": function () {
			list.destroy();
			list = new MockList();
			list.labelFunc = function (item) {
				return item.label.toUpperCase();
			};
			list.righttextAttr = "id";
			list.initMock();
			var item1 = {id: 1, label: "first"};
			var item2 = {id: 2, label: "second"};
			var item3 = {id: 3, label: "third"};
			list.store.add(item1);
			list.store.add(item2);
			list.store.add(item3);
			checkArray(list.added,
						3,
						[0, 1, 2],
						[{index: 0,
						  item: {id: 1,
							category: undefined,
							label: "FIRST",
							righttext: 1,
							iconclass: undefined,
							righticonclass: undefined
						  },
						  items: null},
						  {index: 1,
						   item: {id: 2,
							category: undefined,
							label: "SECOND",
							righttext: 2,
							iconclass: undefined,
							righticonclass: undefined,
						   },
						   items: null},
						  {index: 2,
						   item: {id: 3,
							category: undefined,
							label: "THIRD",
							righttext: 3,
							iconclass: undefined,
							righticonclass: undefined
						   },
						   items: null}],
						"added");
		},
		"query paging": function () {
			for (var i = 0; i < 100; i++) {
				list.store.add({label: "item " + i});
			}
			var result = list.store.filter().range(50);
			assert.equal(100, result.total, "total of first query result");
			assert.equal(50, result.length, "length of first query result");
			assert.equal("item 50", result[0].label, "length of first query result");
			result = list.store.filter().range(48, 58);
			assert.equal(100, result.total, "total of second query result");
			assert.equal(10, result.length, "length of second query result");
			assert.equal("item 48", result[0].label, "length of second query result");
			result = list.store.filter().range(0, 8);
			assert.equal(100, result.total, "total of third query result");
			assert.equal(8, result.length, "length of third query result");
			assert.equal("item 0", result[0].label, "length of third query result");
			result = list.store.filter().range(0, 110);
			assert.equal(100, result.total, "total of fourth query result");
			assert.equal(100, result.length, "length of fourth query result");
			assert.equal("item 0", result[0].label, "length of fourth query result");
			result = list.store.filter().range(110);
			assert.equal(100, result.total, "total of fifth query result");
			assert.equal(0, result.length, "length of fifth query result");
		},
		"put items on a non queried store": function () {
			var mock = {
					put: [],
					added: [],
					removed: [],
					itemUpdated: function (event, keepSelection) {
						this.put.push({event: event, keepSelection: keepSelection});
					},
					itemAdded: function (event) {
						this.added.push({event: event});
					},
					itemRemoved: function (event, keepSelection) {
						this.removed.push({event: event, keepSelection: keepSelection});
					}
				};
			var store = new DefaultStore(mock);
			// put item
			store.put({label: "item 0"});
			assert.equal(0, mock.put.length, "put length after first put");
			assert.equal(0, mock.added.length, "added length after first put");
			assert.equal(0, mock.removed.length, "removed");
			assert.equal(1, store.data.length, "number of items in store after first put");
			// move item
			var id = store.put({label: "item 1"});
			assert.equal(0, mock.put.length, "put length after second put");
			assert.equal(0, mock.added.length, "added length after second put");
			assert.equal(0, mock.removed.length, "removed length after second put");
			assert.equal(2, store.data.length, "number of items in store after second put");
			store.put({label: "item 1"}, {id: id, before: store.data[0]});
			assert.equal(0, mock.put.length, "put length after put 3");
			assert.equal(0, mock.added.length, "added length after put 3");
			assert.equal(0, mock.removed.length, "removed length after put 3");
			assert.equal(2, store.data.length, "number of items in store after put 3");
			// update item
			store.put({label: "item -1"}, {id: id});
			assert.equal(0, mock.put.length, "put length after put 4");
			assert.equal(0, mock.added.length, "added length after put 4");
			assert.equal(0, mock.removed.length, "removed length after put 4");
			assert.equal(2, store.data.length, "number of items in store after put 4");
		},
		"remove items on a non queried store": function () {
			var mock = {
					put: [],
					added: [],
					removed: [],
					putItem: function (index, item, items) {
						this.put.push({index: index, item: item, items: items});
					},
					addItem: function (index, item, items) {
						this.added.push({index: index, item: item, items: items});
					},
					removeItem: function (index, item, items, keepSelection) {
						this.removed.push({index: index, item: item, items: items, keepSelection: keepSelection});
					}
				};
			var store = new DefaultStore(mock);
			// put item
			var id = store.put({label: "item 0"});
			// remove item
			store.remove(id);
			assert.equal(0, mock.put.length, "put length");
			assert.equal(0, mock.added.length, "added length");
			assert.equal(0, mock.removed.length, "removed length");
			assert.equal(0, store.data.length, "number of items in store");
		},
		teardown : function () {
			list.destroy();
			list = null;
		}
	});
});
