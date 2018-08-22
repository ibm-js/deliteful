define([
	"intern/chai!assert",
	"dojo/Deferred",
	"decor/ObservableArray",
	"decor/Observable",
	"requirejs-dplugins/jquery!attributes/classes"
], function (assert, Deferred, ObservableArray, Observable, $) {

	return {
		/**
		 * Build a test suite for a List class
		 * @param name {string} the name of the test suite
		 * @param ListConstructor {function} the constructor for the tested List class
		 */
		buildSuite: function (name, ListConstructor) {
			return {
				name: name,
				beforeEach: function () {
					if (this.list) {
						this.list.destroy();
					}
					this.list = new ListConstructor({source: new ObservableArray(
						{label: "item 1"},
						{label: "item 2"},
						{label: "item 3"}
					)});
					this.list.placeAt(document.body);	// StoreMap defers query until node attached to document
				},

				"basic": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{label: "item 1"},
						{label: "item 2"},
						{label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					assert.strictEqual(list.containerNode.children.length, 3, "initial nodelist length");
					assert.strictEqual(list.containerNode.children[0].textContent.trim(),
						"item 1", "initial first item");
					assert.strictEqual(list.containerNode.children[1].textContent.trim(),
						"item 2", "initial second item");
					assert.strictEqual(list.containerNode.children[2].textContent.trim(),
						"item 3", "initial third item");

					list.source = [
						{label: "item 4"},
						{label: "item 5"}
					];
					list.deliver();
					assert.strictEqual(list.containerNode.children.length, 2, "updated nodelist length");
					assert.strictEqual(list.containerNode.children[0].textContent.trim(),
						"item 4", "updated first item");
					assert.strictEqual(list.containerNode.children[1].textContent.trim(),
						"item 5", "updated second item");
				},

				"baseClass update" : function () {
					var list = this.parent.list;
					assert.isTrue($(list).hasClass("d-list"));
					list.baseClass = "d-round-rect-list";
					list.deliver();
					assert.isTrue($(list).hasClass("d-round-rect-list"));
					list.baseClass = "d-list";
					list.deliver();
					assert.isTrue($(list).hasClass("d-list"));
				},

				"scrollDirection horizontal not supported": function () {
					var list = this.parent.list;
					try {
						list.scrollDirection = "horizontal";
					} catch (error) {
						assert.isNotNull(error);
						console.log(error);
						/* jshint maxlen: 124 */
						assert.strictEqual(
							"'horizontal' not supported for scrollDirection, keeping the previous value of 'vertical'",
							error.message,
							"error message");
						assert.strictEqual(list.scrollDirection, "vertical");
					}
				},

				"scrollDirection foo not supported": function () {
					var list = this.parent.list;
					try {
						list.scrollDirection = "foo";
					} catch (error) {
						assert.isNotNull(error);
						console.log(error);
						assert.strictEqual(
							"'foo' not supported for scrollDirection, keeping the previous value of 'vertical'",
							error.message,
							"error message");
						assert.strictEqual(list.scrollDirection, "vertical");
					}
				},

				"default scroll direction is vertical": function () {
					var list = this.parent.list;
					list.scrollDirection = "vertical";
					list.deliver();
					assert.isTrue($(list).hasClass("d-scrollable"));
					assert.isTrue($(list).hasClass("d-scrollable-v"));
				},

				"scroll direction none": function () {
					var list = this.parent.list;
					list.scrollDirection = "none";
					list.deliver();
					list.scrollDirection = "none";
					assert.isTrue($(list).hasClass("d-list"));
				},

				"getItemRenderers": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{label: "item 1"},
						{label: "item 2"},
						{label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					var nodeList = list.getItemRenderers();
					assert.strictEqual(nodeList.length, 3, "initial nodelist length");
					assert.deepEqual(nodeList, [].slice.call(list.containerNode.children), "initial nodelist");
				},

				"getRendererByItemId": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					var children = list.containerNode.children;
					assert.strictEqual(list.getRendererByItemId(list.source[0].id),
						children[0], "first renderer");
					assert.strictEqual(list.getRendererByItemId(list.source[1].id),
						children[1], "second renderer");
					assert.strictEqual(list.getRendererByItemId(list.source[2].id),
						children[2], "third renderer");
					assert.isNull(list.getRendererByItemId("I'm not an existing id"), "non list item");
				},
				"getItemRendererIndex": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					var children = list.containerNode.children;
					assert.strictEqual(list.getItemRendererIndex(children[0]), 0, "first renderer");
					assert.strictEqual(list.getItemRendererIndex(children[1]), 1, "second renderer");
					assert.strictEqual(list.getItemRendererIndex(children[2]), 2, "second renderer");
					assert.strictEqual(list.getItemRendererIndex(list), -1, "non list renderer");
				},

				"getEnclosingRenderer": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					var children = list.containerNode.children;
					assert.strictEqual(list.getEnclosingRenderer(children[0]), children[0], "first");
					assert.strictEqual(list.getEnclosingRenderer(children[0].children[0]), children[0], "second");
					assert.isNull(list.getEnclosingRenderer(list), "third");
				},

				"_renderNewItems": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					list._renderNewItems([{label: "item a"}, {label: "item b"}, {label: "item c"}], true);
					var children = list.containerNode.children;
					assert.strictEqual(children.length, 6, "nb of items");
					assert.strictEqual(children[0].item.label, "item a", "first added 1");
					assert.strictEqual(children[1].item.label, "item b", "first added 2");
					assert.strictEqual(children[2].item.label, "item c", "firstd added 3");
					list._renderNewItems([{label: "item d"}, {label: "item e"}, {label: "item f"}], false);
					children = list.containerNode.children;
					assert.strictEqual(children.length, 9, "nb of items 2");
					assert.strictEqual(children[6].item.label, "item d", "last added 1");
					assert.strictEqual(children[7].item.label, "item e", "last added 2");
					assert.strictEqual(children[8].item.label, "item f", "last added 3");
				},

				"_getFirst": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					var children = list.containerNode.children;
					assert.strictEqual(list._getFirst(), children[0].renderNode);

					list.categoryAttr = "label";
					list.deliver();
					children = list.containerNode.children;
					assert.strictEqual(children[0].className, "d-list-category", "first is category");
					assert.strictEqual(list._getFirst(), children[0].renderNode, "first renderer is category");
				},

				"_getLast": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					var children = list.containerNode.children;
					assert.strictEqual(list._getLast(), children[2].renderNode);
				},

				"update item label": function () {
					var list = new ListConstructor({source: new ObservableArray()});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					for (var i = 0; i < 3; i++) {
						var obj = new Observable({id: i, label: "item " + i});
						list.source.set(i, obj);
					}
					list.deliver();
					list.source[0].set("label", "item a");
					list.deliver();
					var renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");
				},

				"update item: add, update and remove icon" : function () {
					var list = new ListConstructor({source: new ObservableArray()});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document

					for (var i = 0; i < 3; i++) {
						var obj = new Observable({id: i, label: "item " + i});
						list.source.set(i, obj);
					}
					list.deliver();

					// add
					list.source[0].set("iconclass", "my-icon");
					list.source[0].set("label", "item a");
					list.deliver();
					var renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.firstChild.className, "d-list-item-icon my-icon");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");

					// update
					list.source[0].set("iconclass", "my-other-icon");
					list.deliver();
					renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.firstChild.className,
						"d-list-item-icon my-other-icon");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");

					// remove
					list.source.set(0, {id: 0, label: "item b"});
					list.deliver();
					renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item b");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item b");
				},

				"item category attribute is not undefined by StoreMap": function () {
					var list = this.parent.list;
					list.destroy();
					list = new ListConstructor({source: new ObservableArray()});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					list.source.push({label: "item 1", category: "category 1"});
					list.deliver();
					assert.strictEqual(list.containerNode.children[0].item.category, "category 1");
				},

				"query-success event": function () {
					var list = this.parent.list;
					var def = this.async(1000);
					list.destroy();
					list = new ListConstructor({source: new ObservableArray()});
					list.on("query-success", def.callback(function (evt) {
						var renderItems = evt.renderItems;
						assert.isNotNull(renderItems);
						assert.strictEqual(renderItems.length, 2);
						assert.strictEqual(renderItems[0].label, "item 1");
						assert.strictEqual(renderItems[1].label, "item 2");
						def.resolve();
					}));
					list.labelAttr = "name";
					list.source.push({name: "item 1"});
					list.source.push({name: "item 2"});
					list.deliver();
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					return def;
				},

				"first focus apply to the first visible child": function () {
					var list = new ListConstructor({source: new ObservableArray(
						{id: "0", label: "item 1"},
						{id: "1", label: "item 2"},
						{id: "2", label: "item 3"}
					)});
					list.style.height = "200px";
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					list.deliver();
					list.focus();
					var focusedElement = document.activeElement;
					assert.isNotNull(focusedElement, "active element");
					assert.isDefined(focusedElement, "active element");
					assert.strictEqual("item 1", focusedElement.parentNode.item.label, "focused element label");
				},

				"show/hide no items node depending of list's containerNode children": function () {
					var list = new ListConstructor({source: new ObservableArray()});
					list.placeAt(document.body);	// StoreMap defers query until node attached to document
					list.showNoItems = true;
					list.source.push({id: "0", label: "item 0"});
					list.source.push({id: "1", label: "item 1"});
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='false']"),
						".d-list-no-items must be hidden");
					while (list.source.length > 0) {
						list.source.pop();
					}
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='true']"),
					".d-list-no-items must be visible");
					list.source.push({id: "0", label: "item 0"});
					list.source.push({id: "1", label: "item 1"});
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='false']"),
						".d-list-no-items must be hidden");
				}
			};
		}
	};
});
