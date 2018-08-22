define([
	"intern/chai!assert",
	"requirejs-dplugins/Promise!",
	"dstore/Memory",
	"dstore/Trackable",
	"requirejs-dplugins/jquery!attributes/classes"
], function (assert, Promise, Memory, Trackable, $) {

	var Store = Memory.createSubclass([Trackable], {});

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
					this.list = new ListConstructor({source: new Store()});
					this.list.placeAt(document.body);
					this.list.source.add({label: "item 1"});
					this.list.source.add({label: "item 2"});
					this.list.source.add({label: "item 3"});
					this.list.deliver();
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
					}
					assert.strictEqual(list.scrollDirection, "vertical");
				},
				"scrollDirection foo not supported": function () {
					var list = this.parent.list;
					try {
						list.scrollDirection = "foo";
					} catch (error) {
						assert.isNotNull(error);
						assert.strictEqual(
								"'foo' not supported for scrollDirection, keeping the previous value of 'vertical'",
								error.message,
								"error message");
					}
					assert.strictEqual(list.scrollDirection, "vertical");
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
					var list = this.parent.list;
					var nodeList = list.getItemRenderers();
					assert.deepEqual(nodeList, [].slice.call(list.containerNode.children));
				},
				"getRendererByItemId": function () {
					var list = this.parent.list;
					var children = list.containerNode.children;
					assert.strictEqual(list.getRendererByItemId(list.source.data[0].id),
							children[0], "first renderer");
					assert.strictEqual(list.getRendererByItemId(list.source.data[1].id),
							children[1], "second renderer");
					assert.strictEqual(list.getRendererByItemId(list.source.data[2].id),
							children[2], "third renderer");
					assert.isNull(list.getRendererByItemId("I'm not an existing id"), "non list item");
				},
				"getItemRendererIndex": function () {
					var list = this.parent.list;
					var children = list.containerNode.children;
					assert.strictEqual(0, list.getItemRendererIndex(children[0]), "first renderer");
					assert.strictEqual(1, list.getItemRendererIndex(children[1]), "second renderer");
					assert.strictEqual(2, list.getItemRendererIndex(children[2]), "second renderer");
					assert.strictEqual(-1, list.getItemRendererIndex(list), "non list renderer");
				},
				"getEnclosingRenderer": function () {
					var list = this.parent.list;
					var children = list.containerNode.children;
					assert.strictEqual(list.getEnclosingRenderer(children[0]), children[0], "first");
					assert.strictEqual(list.getEnclosingRenderer(children[0].children[0]), children[0], "second");
					assert.isNull(list.getEnclosingRenderer(list), "third");
				},
				"_renderNewItems": function () {
					var list = this.parent.list;
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
					var list = this.parent.list;
					var children = list.containerNode.children;
					assert.strictEqual(list._getFirst(), children[0].renderNode);
					list.categoryAttr = "label";
					list.deliver();
					children = list.containerNode.children;
					assert.strictEqual(children[0].className, "d-list-category", "first is category");
					assert.strictEqual(list._getFirst(), children[0].renderNode, "first renderer is category");
				},
				"_getLast": function () {
					var list = this.parent.list;
					var children = list.containerNode.children;
					assert.strictEqual(list._getLast(), children[2].renderNode);
				},
				"update item label": function () {
					var list = this.parent.list;
					list.source.put({label: "item a"}, {id: list.source.data[0].id});
					list.deliver();
					var renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");
				},
				"update item: add, update and remove icon" : function () {
					var list = this.parent.list;
					// add
					list.source.put({label: "item a", iconclass: "my-icon"}, {id: list.source.data[0].id});
					list.deliver();
					var renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.firstChild.className, "d-list-item-icon my-icon");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");
					// update
					list.source.put({label: "item a", iconclass: "my-other-icon"},
						{id: list.source.data[0].id});
					list.deliver();
					renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.firstChild.className, "d-list-item-icon my-other-icon");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");
					// remove
					list.source.put({label: "item a"}, {id: list.source.data[0].id});
					list.deliver();
					renderer = list.containerNode.children[0];
					assert.strictEqual(renderer.item.label, "item a");
					assert.strictEqual(renderer.renderNode.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.renderNode.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.renderNode.children[1].innerHTML, "item a");
				},
				"item category attribute is not undefined by StoreMap": function () {
					var list = this.parent.list;
					list.destroy();
					list = new ListConstructor({source: new Store()});
					list.placeAt(document.body);
					list.source.add({label: "item 1", category: "category 1"});
					assert.strictEqual(list.containerNode.children[0].item.category, "category 1");
				},
				"query-success event": function () {
					var list = this.parent.list;
					list.destroy();
					list = new ListConstructor({source: new Store()});

					var def = this.async(1000);
					list.on("query-success", def.callback(function (evt) {
						var renderItems = evt.renderItems;
						assert.isNotNull(renderItems);
						assert.strictEqual(renderItems.length, 2);
						assert.strictEqual(renderItems[0].label, "item 1");
						assert.strictEqual(renderItems[1].label, "item 2");
					}));

					list.labelAttr = "name";
					list.source.add({name: "item 1"});
					list.source.add({name: "item 2"});
					list.placeAt(document.body);
				},
				"query-error event": function () {
					var list = this.parent.list;
					var queryErrorEvt = null;
					var source = {
						filter: function () {
							var result = {};
							result.map = function () { return this; };
							result.fetch = function () {
								return Promise.reject("Query Error X");
							};
							return result;
						}
					};
					list.destroy();
					list = new ListConstructor({source: source});
					list.on("query-error", function (evt) {
						queryErrorEvt = evt;
					});
					list.placeAt(document.body);

					var def = this.async(1000);
					setTimeout(def.callback(function () {
						assert.isNotNull(queryErrorEvt);
						assert.strictEqual(queryErrorEvt.error, "Query Error X", "error message");
						assert.strictEqual(list.containerNode.getAttribute("aria-busy"), "false", "aria-busy");
					}), 100);
				},
				"first focus apply to the first visible child": function () {
					var list = this.parent.list;
					list.style.height = "200px";
					for (var i = 0; i < 50; i++) {
						list.source.add({label: "item " + (i + 4)});
					}
					list.focus();

					var def = this.async(1000);
					setTimeout(def.callback(function () {
						var focusedElement = document.activeElement;
						assert.isNotNull(focusedElement, "active element not null");
						assert.isDefined(focusedElement, "active element defined");
						assert.strictEqual("item 1", focusedElement.parentNode.item.label,
								"focused element label");
					}), 10);
				},
				"detach and reattach": function () {
					var list = this.parent.list;

					// Test that detaching and reattaching doesn't leave the list in a strange state.
					// Note that we aren't testing what happens if items are added/removed from the store
					// while the list is detached.  That likely doesn't work.
					list.parentNode.removeChild(list);
					document.body.appendChild(list);
					assert.strictEqual(list.containerNode.getAttribute("aria-busy"), "false",
						"aria-busy false attr #1");

					// Same test but with delays
					var def = this.async(1000);
					list.parentNode.removeChild(list);
					setTimeout(def.rejectOnError(function () {
						document.body.appendChild(list);
						setTimeout(def.callback(function () {
							assert.strictEqual(list.containerNode.getAttribute("aria-busy"), "false",
								"aria-busy false attr #2");
						}), 10);
					}), 10);
				},
				"show/hide no items node depending of list's containerNode children": function () {
					var list = this.parent.list;
					list.showNoItems = true;
					list.deliver();
					while (list.source.data.length > 0) {
						list.source.remove(list.source.data[0].id);
					}
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='true']"),
						".d-list-no-items must be visible");

					// adding again children to the list.
					list.source.add({label: "item 1"});
					list.source.add({label: "item 2"});
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='false']"),
						".d-list-no-items must be hidden");
				},
				"check loading panel": function () {
					var list = this.parent.list;
					if (list.tagName.toLowerCase() === "d-pageable-list") {
						// not applicable test for pageable list.
						return;
					}
					list._busy = true;
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-container[d-shown='false']"),
						".d-list-container must be hidden");
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='false']"),
						".d-list-no-items must be hidden");
					assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='true']"),
						".d-list-loading-panel must be visible");
					list._busy = false;
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-container[d-shown='true']"),
						".d-list-container must be visible");
					assert.isNotNull(list.querySelector(".d-list-no-items[d-shown='false']"),
						".d-list-no-items must be hidden");
					assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='false']"),
						".d-list-loading-panel must be hidden");
				},

				teardown : function () {
					this.list.destroy();
					this.list = null;
				}
			};
		}
	};
});
