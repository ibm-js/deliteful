import Memory from "dojo-dstore/Memory";
import Trackable from "dojo-dstore/Trackable";

var assert = intern.getPlugin("chai").assert;

var Store = Memory.createSubclass([ Trackable ], {});

export default {
	/**
	 * Build a test suite for a List class
	 * @param ListConstructor {function} the constructor for the tested List class
	 */
	buildSuite: function (ListConstructor) {
		return {
			beforeEach: function () {
				if (this.list) {
					this.list.destroy();
				}
				this.list = new ListConstructor({ source: new Store() });
				this.list.placeAt(document.body);
				this.list.source.add({ label: "item 1" });
				this.list.source.add({ label: "item 2" });
				this.list.source.add({ label: "item 3" });
				this.list.deliver();
			},

			tests: {
				"baseClass update": function () {
					var list = this.parent.list;
					assert.isTrue(list.classList.contains("d-list"));
					list.baseClass = "d-round-rect-list";
					list.deliver();
					assert.isTrue(list.classList.contains("d-round-rect-list"));
					list.baseClass = "d-list";
					list.deliver();
					assert.isTrue(list.classList.contains("d-list"));
				},

				"scrollDirection horizontal not supported": function () {
					var list = this.parent.list;
					try {
						list.scrollDirection = "horizontal";
					} catch (error) {
						assert.isNotNull(error);
						console.log(error);
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
					assert.isTrue(list.classList.contains("d-scrollable"));
					assert.isTrue(list.classList.contains("d-scrollable-v"));
				},

				"scroll direction none": function () {
					var list = this.parent.list;
					list.scrollDirection = "none";
					list.deliver();
					list.scrollDirection = "none";
					assert.isTrue(list.classList.contains("d-list"));
				},

				"getEnclosingRenderer": function () {
					var list = this.parent.list;
					var children = list.querySelector("[role=grid]").children;
					assert.strictEqual(list.getEnclosingRenderer(children[0]), children[0], "first");
					assert.strictEqual(list.getEnclosingRenderer(children[0].children[0]), children[0], "second");
					assert.isNull(list.getEnclosingRenderer(list), "third");
				},

				"update item label": function () {
					var list = this.parent.list;
					list.source.put({ label: "item a" }, { id: list.source.data[0].id });
					list.deliver();
					var renderer = list.querySelector("[role=grid]").children[0];
					assert.strictEqual(renderer.firstElementChild.children[1].textContent, "item a");
				},

				"update item: add, update and remove icon": function () {
					var list = this.parent.list;
					// add
					list.source.put({ label: "item a", iconclass: "my-icon" }, { id: list.source.data[0].id });
					list.deliver();
					var renderer = list.querySelector("[role=grid]").children[0];
					assert.strictEqual(renderer.firstElementChild.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.firstElementChild.firstElementChild.className, "d-list-item-icon my-icon");
					assert.strictEqual(renderer.firstElementChild.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.firstElementChild.children[1].textContent, "item a");
					// update
					list.source.put({ label: "item a", iconclass: "my-other-icon" },
						{ id: list.source.data[0].id });
					list.deliver();
					renderer = list.querySelector("[role=grid]").children[0];
					assert.strictEqual(renderer.firstElementChild.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.firstElementChild.firstElementChild.className,
						"d-list-item-icon my-other-icon");
					assert.strictEqual(renderer.firstElementChild.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.firstElementChild.children[1].textContent, "item a");
					// remove
					list.source.put({ label: "item a" }, { id: list.source.data[0].id });
					list.deliver();
					renderer = list.querySelector("[role=grid]").children[0];
					assert.strictEqual(renderer.firstElementChild.getAttribute("role"), "gridcell");
					assert.strictEqual(renderer.firstElementChild.children[1].className, "d-list-item-label");
					assert.strictEqual(renderer.firstElementChild.children[1].textContent, "item a");
				},

				"query-success event": function () {
					var list = this.parent.list;
					list.destroy();
					list = new ListConstructor({ source: new Store() });

					var def = this.async(1000);
					list.on("query-success", def.callback(function (evt) {
						var renderItems = evt.renderItems;
						assert.isNotNull(renderItems);
						assert.strictEqual(renderItems.length, 2);
						assert.strictEqual(renderItems[0].label, "item 1");
						assert.strictEqual(renderItems[1].label, "item 2");
					}));

					list.labelAttr = "name";
					list.source.add({ name: "item 1" });
					list.source.add({ name: "item 2" });
					list.placeAt(document.body);
				},

				"query-error event": function () {
					var list = this.parent.list;
					var queryErrorEvt = null;
					var source = {
						fetch: function () {
							return Promise.reject("Query Error X");
						},
						map: function () {
							return this;
						},
						filter: function () {
							return this;
						}
					};
					list.destroy();
					list = new ListConstructor({ source: source });
					list.on("query-error", function (evt) {
						queryErrorEvt = evt;
					});
					list.placeAt(document.body);

					var def = this.async(1000);
					setTimeout(def.callback(function () {
						assert.isNotNull(queryErrorEvt);
						assert.strictEqual(queryErrorEvt.error, "Query Error X", "error message");
					}), 100);
				},

				"first focus apply to the first visible child": function () {
					var list = this.parent.list;
					list.style.height = "200px";
					for (var i = 0; i < 50; i++) {
						list.source.add({ label: "item " + (i + 4) });
					}
					list.focus();

					var def = this.async(1000);
					setTimeout(def.callback(function () {
						var focusedElement = document.activeElement;
						assert.isNotNull(focusedElement, "active element not null");
						assert.isDefined(focusedElement, "active element defined");
						assert.strictEqual(focusedElement.textContent.trim(), "item 1", "focused element label");
					}), 10);
				},

				"detach and reattach": function () {
					var list = this.parent.list;

					// Test that detaching and reattaching doesn't leave the list in a strange state.
					// Note that we aren't testing what happens if items are added/removed from the store
					// while the list is detached.  That likely doesn't work.
					list.parentNode.removeChild(list);
					document.body.appendChild(list);
					assert.strictEqual(list.querySelector("[role=grid]").getAttribute("aria-busy"), "false",
						"aria-busy false attr #1");

					// Same test but with delays
					var def = this.async(1000);
					list.parentNode.removeChild(list);
					setTimeout(def.rejectOnError(function () {
						document.body.appendChild(list);
						setTimeout(def.callback(function () {
							assert.strictEqual(list.querySelector("[role=grid]").getAttribute("aria-busy"), "false",
								"aria-busy false attr #2");
						}), 10);
					}), 10);
				},

				"show/hide no items node depending of list's children": function () {
					var list = this.parent.list;
					list.showNoItems = true;
					list.deliver();
					while (list.source.data.length > 0) {
						list.source.removeSync(list.source.data[0].id);
					}
					list.deliver();
					assert.match(list.textContent, /Nothing to show./, "list content");

					// adding again children to the list.
					list.source.add({ label: "item 1" });
					list.source.add({ label: "item 2" });
					list.deliver();
					assert.notMatch(list.textContent, /Nothing to show./, "list content");
				},

				"check loading panel": function () {
					var list = this.parent.list;
					if (list.tagName.toLowerCase() === "d-pageable-list") {
						// not applicable test for pageable list.
						return;
					}
					list._busy = true;
					list.deliver();
					assert.isNotNull(list.querySelector(".d-list-loading-panel"),
						".d-list-loading-panel must be visible");
					list._busy = false;
					list.deliver();
					assert.isNull(list.querySelector(".d-list-loading-panel"),
						".d-list-loading-panel must be hidden");
				}
			},

			after: function () {
				if (this.list) {
					this.list.destroy();
				}
				this.list = null;
			}
		};
	}
};

