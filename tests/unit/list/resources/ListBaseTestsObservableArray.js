define([
	"intern/chai!assert",
	"dojo/Deferred",
	"decor/ObservableArray",
	"decor/Observable",
	"requirejs-dplugins/jquery!attributes/classes"
], function (assert, Deferred, ObservableArray, Observable, $) {

	var waitForCondition = function (func, timeout, interval) {
		var wait = function (def, start) {
			setTimeout(function () {
				if (func()) {
					def.resolve();
				} else {
					if (new Date() - start > timeout) {
						def.reject(new Error("timeout"));
					} else {
						wait(def, start);
					}
				}
			}, interval);
		};
		var def = new Deferred();
		var start = new Date();
		wait(def, start);
		return def;
	};

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
					this.list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(this.list);
					this.list.attachedCallback();
					this.list.source.push({label: "item 1"});
					this.list.source.push({label: "item 2"});
					this.list.source.push({label: "item 3"});
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
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({label: "item 1"});
						list.source.push({label: "item 2"});
						list.source.push({label: "item 3"});
						list.deliver();
						var nodeList = list.getItemRenderers();
						assert.deepEqual(nodeList, [].slice.call(list.children));
					}));
					return d;
				},
				"getRendererByItemId": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						var children = list.children;
						assert.strictEqual(list.getRendererByItemId(list.source[0].id),
							children[0], "first renderer");
						assert.strictEqual(list.getRendererByItemId(list.source[1].id),
							children[1], "second renderer");
						assert.strictEqual(list.getRendererByItemId(list.source[2].id),
							children[2], "third renderer");
						assert.isNull(list.getRendererByItemId("I'm not an existing id"), "non list item");
					}));
					return d;
				},
				"getItemRendererIndex": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						var children = list.children;
						assert.strictEqual(0, list.getItemRendererIndex(children[0]), "first renderer");
						assert.strictEqual(1, list.getItemRendererIndex(children[1]), "second renderer");
						assert.strictEqual(2, list.getItemRendererIndex(children[2]), "second renderer");
						assert.strictEqual(-1, list.getItemRendererIndex(list), "non list renderer");
					}));
					return d;
				},
				"getEnclosingRenderer": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						var children = list.children;
						assert.strictEqual(list.getEnclosingRenderer(children[0]), children[0], "first");
						assert.strictEqual(list.getEnclosingRenderer(children[0].children[0]), children[0], "second");
						assert.isNull(list.getEnclosingRenderer(list), "third");
					}));
					return d;
				},
				"_renderNewItems": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						list._renderNewItems([{label: "item a"}, {label: "item b"}, {label: "item c"}], true);
						var children = list.children;
						assert.strictEqual(children.length, 6, "nb of items");
						assert.strictEqual(children[0].item.label, "item a", "first added 1");
						assert.strictEqual(children[1].item.label, "item b", "first added 2");
						assert.strictEqual(children[2].item.label, "item c", "firstd added 3");
						list._renderNewItems([{label: "item d"}, {label: "item e"}, {label: "item f"}], false);
						children = list.children;
						assert.strictEqual(children.length, 9, "nb of items 2");
						assert.strictEqual(children[6].item.label, "item d", "last added 1");
						assert.strictEqual(children[7].item.label, "item e", "last added 2");
						assert.strictEqual(children[8].item.label, "item f", "last added 3");
					}));
					return d;
				},
				"_getFirst": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						var children = list.children;
						assert.strictEqual(list._getFirst(), children[0].renderNode);
						list.categoryAttr = "label";
						list.deliver();
						list.on("query-success", d.callback(function () {
							children = list.children;
							assert.strictEqual(children[0].className, "d-list-category", "first is category");
							assert.strictEqual(list._getFirst(), children[0].renderNode, "first renderer is category");
						}));
					}));
					return d;
				},
				"_getLast": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						var children = list.children;
						assert.strictEqual(list._getLast(), children[2].renderNode);
					}));
					return d;
				},
				"update item label": function () {
					var d = this.async(3000);
					var TIMEOUT = 2000;
					var INTERVAL = 100;
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.rejectOnError(function () {
						list.attachedCallback();
						for (var i = 0; i < 3; i++) {
							var obj = new Observable({id: i, label: "item " + i});
							list.source.set(i, obj);
						}
						list.deliver();
						list.source[0].set("label", "item a");
						list.deliver();
						var renderer = list.children[0];
						waitForCondition(function () {
							return renderer.item.label === "item a";
						}, TIMEOUT, INTERVAL).then(d.callback(function () {
							assert.strictEqual(renderer.item.label, "item a");
							assert.strictEqual(renderer.firstChild.children[1].innerHTML, "item a");
						}));
					}));
					return d;
				},
				"update item: add, update and remove icon" : function () {
					var d = this.async(1500);
					var TIMEOUT = 2000;
					var INTERVAL = 100;
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.rejectOnError(function () {
						list.attachedCallback();
						for (var i = 0; i < 3; i++) {
							var obj = new Observable({id: i, label: "item " + i});
							list.source.set(i, obj);
						}
						list.deliver();
						// add
						list.source[0].set("iconclass", "my-icon");
						list.source[0].set("label", "item a");
						list.deliver();
						var renderer = list.children[0];
						waitForCondition(function () {
							return renderer.item.iconclass === "my-icon";
						}, TIMEOUT, INTERVAL).then(d.rejectOnError(function () {
							assert.strictEqual(renderer.item.label, "item a");
							assert.strictEqual(renderer.firstChild.getAttribute("role"), "gridcell");
							assert.strictEqual(renderer.firstChild.firstChild.className, "d-list-item-icon my-icon");
							assert.strictEqual(renderer.firstChild.children[1].className, "d-list-item-label");
							assert.strictEqual(renderer.firstChild.children[1].innerHTML, "item a");
							// update
							list.source[0].set("iconclass", "my-other-icon");
							list.deliver();
							renderer = list.children[0];
							waitForCondition(function () {
								return renderer.item.iconclass === "my-other-icon";
							}, TIMEOUT, INTERVAL).then(d.rejectOnError(function () {
								assert.strictEqual(renderer.item.label, "item a");
								assert.strictEqual(renderer.firstChild.getAttribute("role"), "gridcell");
								assert.strictEqual(renderer.firstChild.firstChild.className,
									"d-list-item-icon my-other-icon");
								assert.strictEqual(renderer.firstChild.children[1].className, "d-list-item-label");
								assert.strictEqual(renderer.firstChild.children[1].innerHTML, "item a");
								// remove
								list.source.set(0, {id: 0, label: "item b"});
								list.deliver();
								renderer = list.children[0];
								waitForCondition(function () {
									return list.textContent.indexOf("item b") >= 0;
								}, TIMEOUT, INTERVAL).then(d.callback(function () {
									assert.strictEqual(renderer.item.label, "item b");
									assert.strictEqual(renderer.firstChild.getAttribute("role"), "gridcell");
									assert.strictEqual(renderer.firstChild.children[1].className, "d-list-item-label");
									assert.strictEqual(renderer.firstChild.children[1].innerHTML, "item b");
								}));
							}));
						}));
					}));
					return d;
				},
				"item category attribute is not undefined by StoreMap": function () {
					var d = this.async(1500);
					var list = this.parent.list;
					list.destroy();
					list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.attachedCallback();
					list.on("query-success", d.callback(function () {
						list.source.push({label: "item 1", category: "category 1"});
						list.deliver();
						assert.strictEqual(list.children[0].item.category, "category 1");
					}));
					return d;
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
					document.body.appendChild(list);
					list.attachedCallback();
					return def;
				},
				"first focus apply to the first visible child": function () {
					var d = this.async(1500);
					var list = new ListConstructor({source: new ObservableArray()});
					document.body.appendChild(list);
					list.on("query-success", d.callback(function () {
						list.attachedCallback();
						list.source.push({id: "0", label: "item 1"});
						list.source.push({id: "1", label: "item 2"});
						list.source.push({id: "2", label: "item 3"});
						list.deliver();
						list.style.height = "200px";
						for (var i = 0; i < 50; i++) {
							list.source.push({label: "item " + i });
						}
						list.focus();
						list.deliver();
						var focusedElement = document.activeElement;
						assert.isNotNull(focusedElement, "active element");
						assert.isDefined(focusedElement, "active element");
						assert.strictEqual("item 1", focusedElement.parentNode.item.label, "focused element label");
						d.resolve();
					}));
					return d;
				},
				teardown : function () {
				}
			};
		}
	};
});
