define(["dcl/dcl",
	"delite/register",
	"dojo/_base/lang",
	"dojo/when",
	"dojo/dom-class",
	"dojo/keys",
	"delite/Selection",
	"delite/KeyNav",
	"delite/StoreMap",
	"delite/Invalidating",
	"delite/Scrollable",
	"./ItemRenderer",
	"./CategoryRenderer",
	"dojo/i18n!./List/nls/List",
	"delite/themes/load!./List/themes/{{theme}}/List_css",
	"dojo/has!dojo-bidi?delite/themes/load!./List/themes/{{theme}}/List_rtl_css"
], function (dcl, register, lang, when, domClass, keys, Selection, KeyNav, StoreMap,
		Invalidating, Scrollable, ItemRenderer, CategoryRenderer, messages) {

	// module:
	//		deliteful/list/List

	var List = dcl([Invalidating, Selection, KeyNav, StoreMap, Scrollable], {
		// summary:
		//		A widget that renders a scrollable list of items.
		//
		// description:
		//		The List widget renders a scrollable list of items that are retrieved from a Store.
		//		Its custom element tag is d-list.
		//
		//		## Scroll capabilities
		//
		//		If you do not want the list to be scrollable, you can set its scrollDirection attribute
		//		to "none" in order to remove the default scrolling capability.
		//
		//		## Store capabilities
		//
		//		If the store the items are retrieved from is observable, the widget will react to addition,
		//		deletion, move and update of the store content to refresh its rendering accordingly.
		//
		//		If you do not specify the store to retrieve the items from, the widget uses a default
		//		in memory store implementation that can be retrieved in the store attributes, as in
		//		the following example:
		//
		//			var list = register.createElement("d-list");
		//			var defaultStore = list.store;
		//
		//		This default store can be populated programmatically using the add and put methods
		//		defined by the store API, and it supports the before options in both methods to easily
		//		order elements in the list, as in the following example:
		//
		//			var list = register.createElement("d-list");
		//			var defaultStore = list.store;
		//			var item1 = {...};
		//			var item2 = {...};
		//			defaultStore.add(item1);
		//			defaultStore.add(item2, {before: item1});
		//
		//		Note that the default store does not support ordering and filtering, so you must use
		//		another store implementation to do this (Memory store, for example).
		//
		//		When creating a list widget declaratively, it is possible to use markup to add items to
		//		the list store using the d-list-store and d-list-store-items tags, as in the following
		//		example:
		//
		//			<d-list>
		//				<d-list-store>
		//					<d-list-store-item item="{...}"></d-list-store-item>
		//					<d-list-store-item item="{...}"></d-list-store-item>
		//					<d-list-store-item item="{...}"></d-list-store-item>
		//					...
		//				</d-list-store>
		//			</d-list>
		//
		//		Note that items are appended to the store in the order they are declared in the markup.
		//
		//		The actual rendering of the items in the list is performed by an item renderer widget.
		//		The default one is deliteful/list/ItemRenderer, but another one can be specified
		//		using the itemRenderer attribute of the list, as in the following example:
		//
		//			define(["delite/register", "deliteful/list/ItemRenderer"],
		//				function (register, ItemRenderer) {
		//					var MyCustomRenderer = register("d-book-item", [HTMLElement, ItemRenderer], {
		//						render: function () {
		//							this.containerNode.innerHTML = "<div class='title'>" + this.item.title + "</div><div class='isbn'>ISBN: " + this.item.isbn + "</div>";
		//							this.setFocusableChildren(this.querySelector(".title"),  this.querySelector(".isbn"));
		//						}
		//					});
		//					var list = register.createElement("d-list");
		//					list.itemRenderer = myCustomRenderer;
		//			});
		//
		//		If you are using a custom type of items but want to render them using the default renderer,
		//		you can redefine the itemToRenderItem method (inherited from delite/Store) so that it creates
		//		items for the default renderer, as in the following example:
		//
		//			var list = register.createElement("d-list");
		//			list.itemToRenderItem = function (myItem) {
		//				var itemForDefaultRenderer = {};
		//				itemForDefaultRenderer.label = myItem.title;
		//				...
		//				return itemForDefaultRenderer;
		//			};
		//
		//		Because the List widget inherit from delite/StoreMap, you can also define the mapping between
		//		your store items and the ones expected by the renderer as in the following example:
		//
		//			require([
		//					"delite/register",
		//					"deliteful/list/List"
		//				], function (register, List) {
		//					var MyList = register("m-list",
		//							[List, StoreMap],
		//							{labelAttr: "title",
		//							 righttextFunc: function (item, store, value) {
		//								 return item.title.split(" ")[0];
		//							}});
		//					var list = register.createElement("m-list");
		//					list.store.add({title: "first item"});
		//					...
		//					document.body.appendChild(list);
		//					list.startup();
		//			});
		//
		//		Errors encountered when querying the store are reported by the widget through a "query-error" event.
		//		It should be listened to in order to react to it in the application, as in the following example:
		//
		//			var list = register.createElement("d-list");
		//			list.on("query-error", function (error) {
		//				// Report the error to the user
		//				...
		//			});
		//
		//		## Categorized items
		//
		//		The List widget supports categorized items, that are rendered with a category header that separates
		//		each category of items in the list. To enable this feature, use the categoryAttr attribute to
		//		define the name of the item attribute that holds the category of the item, as in the following
		//		example:
		//
		//			var list = register.createElement("d-list");
		//			list.categoryAttribute = "category";
		//			list.store.add({label: "first item", category: "Category A"});
		//			list.store.add({label: "second item", category: "Category A"});
		//			list.store.add({label: "third item", category: "Category B"});
		//
		//		An alternative is to set categoryFunc to a function that extract the category from the store item,
		//		as in the following example:
		//
		//			var list = register.createElement("d-list");
		//			list.categoryFunc = function(item, store) {
		//				return item.category;
		//			});
		//			list.store.add({label: "first item", category: "Category A"});
		//			list.store.add({label: "second item", category: "Category A"});
		//			list.store.add({label: "third item", category: "Category B"});
		//
		//		## Selection support
		//
		//		The list uses the delite/Selection mixin to provides support for selectable items. By default, items
		//		in the list are not selectable, but you can change this behaviour using the selectionMode attribute
		//		of the widget:
		//
		//			var list = register.createElement("d-list");
		//			list.selectionMode = "multiple";
		//
		//		When the selection mode is "single", a click or tap on a item (or a press on the ENTER or SPACE key
		//		when an item got the focus) select it and deselect any previously selected item. When the selection
		//		mode is "multiple", a click or tap on an item (or a press on the ENTER or SPACE key when an item got
		//		the focus) toggle its selected state.
		//
		//		When the current selection change, a "selection-change" event is emitted. Its oldValue attribute
		//		contains the previous selection, and its newValue attribute contains the new selection.
		//
		//		the d-selected CSS class is applied to items currently selected in the list, so you can define your
		//		own CSS rules to easily customize how selected items are rendered.
		//
		//		## Keyboard navigation
		//
		//		The List widget uses delite/KeyNav to provide keyboard navigation. When the widget got the focus with
		//		keyboard navigation, the first item displayed at the top of the scroll viewport got the focus.
		//		The list items can then be navigated using the UP and DOWN arrow key, and the List will scroll
		//		accordingly when you reach the top or the bottom of the scroll viewport. You can also search for items
		//		by typing a word on the keyboard, and the first item which label begins with the word will get
		//		the focus. When a List item got the focus, you can also use the LEFT and RIGHT keys to navigate
		//		within it. Pressing the UP or ARROW key again with set the focus back to the item. While navigating
		//		within the item, you can also type words on the keyboard to search for text labels (for example to
		//		move from left to right label).
		//
		//		## Styling
		//
		//		The List widget comes with two different styling that are applied by setting the baseClass attribute
		//		to one of the following values:
		//		- "d-list" (default): the list is displayed with an edge to edge layout;
		//		- "d-rounded-list": the list has rounded corners and both a left and right margin.
		//

		/*=====
		// store: dojo/store/Store
		//		Dojo object store that contains the items to render in the list.
		//		If no value is provided for this attribute, the List will initialize
		//		it with an internal store implementation. Note that this internal store
		//		implementation ignore any query options and return all the items from
		//		the store, in the order they were added to the store.
		store: null,

		// query: Object
		//		Query to pass to the store to retrieve the items to render in the list.
		query: {},

		// queryOptions: dojo/store/api/Store.QueryOptions?
		//		Options to be applied when querying the store.
		queryOptions: null,
		=====*/

		// itemRenderer: deliteful/list/ItemRenderer subclass
		//		The widget class to use to render list items.
		//		It MUST extend deliteful/list/ItemRenderer.
		itemRenderer: ItemRenderer,

		// categoryRenderer: deliteful/list/CategoryRenderer subclass
		//		The widget class to use to render category headers when the list items are categorized.
		//		It MUST extend deliteful/list/CategoryRenderer.
		categoryRenderer: CategoryRenderer,

		// categoryAttr: String
		//		Name of the list item attribute that define the category of a list item.
		//		If falsy and categoryFunc is also falsy, the list is not categorized.
		categoryAttr: "",

		// categoryFunc: String
		//		A function that extract the category of a list item from the following input parameters/
		//		- item: the list item from the store
		//		- store: the store
		//		If falsy and categoryAttr is also falsy, the list is not categorized.
		categoryFunc: null,

		// baseClass: String
		//	The base class that defines the style of the list.
		//	Available values are:
		//		- "d-list" (default): render a list with no rounded corners and no left and right margins;
		//		- "d-round-rect-list": render a list with rounded corners and left and right margins.
		baseClass: "d-list",
		_setBaseClassAttr: function (value) {
			if (this.baseClass !== value) {
				domClass.replace(this, value, this.baseClass);
				this._set("baseClass", value);
			}
		},

		/*=====
		// scrollDirection: String
		//		"vertical" for a scrollable List, "none" for a non scrollable List.
		scrollDirection: "vertical",
		=====*/
		_setScrollDirectionAttr: function (value) {
			if (value === "horizontal") {
				this.scrollDirection = "none";
				throw new Error(messages["horizontal-scroll-not-supported"]);
			} else {
				this._set("scrollDirection", value);
			}
		},

		// selectionMode: String
		//		The selection mode for list items (see delite/Selection).
		selectionMode: "none",

		// copyAllItemProps: boolean
		//		we set it to true to that all the store items property are copied into the
		//		render item by delite/StoreMap.itemToRenderItem.
		// tags:
		//		protected
		copyAllItemProps: true,

		// CSS classes internally referenced by the List widget
		_cssClasses: {item: "d-list-item",
					  category: "d-list-category",
					  loading: "d-loading"},

		/*======
		// Handle for the selection click event handler 
		_selectionClickHandle: null,
		=====*/
		
		//////////// Widget life cycle ///////////////////////////////////////

		preCreate: function () {
			// summary:
			//		Set invalidating properties.
			// tags:
			//		protected
			this.addInvalidatingProperties({
				"categoryAttr": "invalidateProperty",
				"categoryFunc": "invalidateProperty",
				"itemRenderer": "invalidateProperty",
				"categoryRenderer": "invalidateProperty",
				"selectionMode": "invalidateProperty"
			});
		},

		buildRendering: function () {
			// summary:
			//		Initialize the widget node and set the container node.
			// tags:
			//		protected
			this.style.display = "block";
			this.containerNode = this;
			// Aria attributes
			this.setAttribute("role", "list");
			this.setAttribute("aria-label", messages["aria-label"]);
		},

		createdCallback: dcl.superCall(function (sup) {
			// summary:
			//		Create the default store, if necessary, after all attributes values are set on the widget.
			// tags:
			//		protected
			return function () {
				if (sup) {
					sup.apply(this, arguments);
				}
				var list = this;
				if (!this.store) {
					this.store = {
						data: [],
						_ids: [],
						idProperty: "id",
						_queried: false,
						get: function (id) {
							var index = this._ids.indexOf(id);
							if (index >= 0) {
								return this.data[index];
							}
						},
						query: function (query, options) {
							var results;
							if (options && (options.start || options.count)) {
								results = this.data.slice(options.start || 0,
										(options.start || 0) + (options.count || Infinity));
							} else {
								results = this.data.slice();
							}
							results.total = this.data.length;
							this._queried = true;
							return results;
						},
						getIdentity: function (item) {
							return item[this.idProperty];
						},
						put: function (item, options) {
							var beforeIndex = -1;
							var itemBeforeUpdate;
							var id = item[this.idProperty] = (options && "id" in options)
								? options.id : this.idProperty in item ? item[this.idProperty] : Math.random();
							var existingIndex = this._ids.indexOf(id);
							if (options && options.before) {
								if (this.idProperty in options.before) {
									beforeIndex = this._ids.indexOf(options.before[this.idProperty]);
								} else {
									beforeIndex = this.data.indexOf(options.before);
								}
							}
							if (existingIndex >= 0) {
								// item exists in store
								if (options && options.overwrite === false) {
									throw new Error(messages["exception-item-already-exists"]);
								}
								// update the item
								itemBeforeUpdate = this.data[existingIndex];
								this.data[existingIndex] = item;
								if (beforeIndex >= 0 && beforeIndex !== existingIndex) {
									// move the item
									this.data.splice(beforeIndex, 0, this.data.splice(existingIndex, 1)[0]);
									this._ids.splice(beforeIndex, 0, this._ids.splice(existingIndex, 1)[0]);
									if (this._queried) {
										list.removeItem(existingIndex,
												list.itemToRenderItem(itemBeforeUpdate), null, true);
										list.addItem(beforeIndex, list.itemToRenderItem(item), null);
									}
								} else {
									if (this._queried) {
										list.putItem(existingIndex, list.itemToRenderItem(item), null);
									}
								}
							} else {
								// new item to add to store
								if (beforeIndex >= 0) {
									this.data.splice(beforeIndex, 0, item);
									this._ids.splice(beforeIndex, 0, id);
								} else {
									this.data.push(item);
									this._ids.push(id);
								}
								if (this._queried) {
									list.addItem(beforeIndex >= 0 ? beforeIndex : this.data.length - 1,
											list.itemToRenderItem(item), null);
								}
							}
							return id;
						},
						add: function (item, options) {
							var opts = options || {};
							opts.overwrite = false;
							return this.put(item, opts);
						},
						remove: function (id) {
							var index = this._ids.indexOf(id), item;
							if (index >= 0 && index < this.data.length) {
								item = this.data.splice(index, 1)[0];
								this._ids.splice(index, 1);
								if (this._queried) {
									list.removeItem(index, list.itemToRenderItem(item), null, false);
								}
								return true;
							}
						}
					};
				}
			};
		}),

		enteredViewCallback: function () {
			// FIXME: THIS IS A WORKAROUND, BECAUSE Widget.enteredViewCallback IS RESETING THE TAB INDEX TO -1.
			// => WITH THIS WORKAROUND, ANY CUSTOM TABINDEX SET ON A WIDGET NODE IS IGNORED AND REPLACED WITH 0
			this._enteredView = true;
			if (!this.isLeftToRight()) {
				domClass.add(this, "d-rtl");
			}
			this.setAttribute("tabindex", "0");
			this.tabIndex = "0";
			domClass.add(this, this.baseClass);
			// END OF WORKAROUND
		},

		startup: dcl.superCall(function (sup) {
			// summary:
			//		Starts the widget: parse the content of the widget node to clean it,
			//		add items to the store if specified in markup.
			return function () {
				this._processAndRemoveContent(this, {"D-LIST-STORE": function (node) {
					this._processAndRemoveContent(node, {"D-LIST-STORE-ITEM": function (node) {
						var itemAttribute = node.getAttribute("item");
						if (itemAttribute) {
							// Reusing the widget mechanism to extract attribute value.
							// FIXME: should not have to manipulate node._propCaseMap but use a "more public" method ?
							node._propCaseMap = {item: "item"};
							node.item = {};
							this.store.add(this.mapAttributes.call(node).item);
						}
					}});
				}});
				this._setBusy(true);
				this.on("query-error", lang.hitch(this, function () {
					this._setBusy(false);
				}));
				if (sup) {
					sup.call(this, arguments);
				}
			};
		}),

		refreshProperties: dcl.superCall(function (sup) {
			// summary:
			//		List attributes have been updated.
			// tags:
			//		protected
			return function (props) {
				if (props.selectionMode) {
					if (this.selectionMode === "none") {
						if (this._selectionClickHandle) {
							this._selectionClickHandle.remove();
							this._selectionClickHandle = null;
						}
					} else {
						if (!this._selectionClickHandle) {
							this._selectionClickHandle = this.on("click", lang.hitch(this, "_handleSelection"));
						}
					}
				}
				if (props.itemRenderer
					|| (this._isCategorized()
							&& (props.categoryAttr || props.categoryFunc || props.categoryRenderer))) {
					if (this._started) {
						this._setBusy(true);
						props.store = true; // to toggle a reload of the list.
					}
				}
				if (sup) {
					sup.call(this, props);
				}
			};
		}),

		//////////// Public methods ///////////////////////////////////////

		getRendererByItem: function (/*Object*/item) {
			// summary:
			//		Returns the renderer currently displaying a specific item.
			//		This method uses the getIdentity method to compare items.
			// item: Object
			//		The item displayed by the renderer.
			var renderers = this.containerNode.querySelectorAll("." + this._cssClasses.item);
			var id = this.getIdentity(item);
			var renderer, i;
			for (i = 0; i < renderers.length; i++) {
				renderer = renderers.item(i);
				if (this.getIdentity(renderer.item) === id) {
					return renderer; // Widget
				}
			}
			return null;
		},

		getItemRendererByIndex: function (/*int*/index) {
			// summary:
			//		Returns the item renderer at a specific index in the List.
			// index: int
			//		The index of the item renderer in the list (first item renderer index is 0).
			return this.containerNode.querySelectorAll("." + this._cssClasses.item).item(index);
		},

		getItemRendererIndex: function (/*Object*/renderer) {
			// summary:
			//		Returns the index of an item renderer in the List, or -1 if
			//		the item renderer is not found in the list.
			// renderer: Object
			//		The item renderer.
			var result = -1;
			if (renderer.item) {
				var id = this.getIdentity(renderer.item);
				var nodeList = this.containerNode.querySelectorAll("." + this._cssClasses.item);
				for (var i = 0; i < nodeList.length; i++) {
					var currentRenderer = nodeList.item(i);
					if (this.getIdentity(currentRenderer.item) === id) {
						result = i;
						break;
					}
				}
			}
			return result;
		},

		getEnclosingRenderer: function (/*DOMNode*/node) {
			// summary:
			//		Returns the renderer enclosing a dom node.
			// node: DOMNode
			//		The dom node.
			var currentNode = node;
			while (currentNode) {
				if (currentNode.parentNode && domClass.contains(currentNode.parentNode,
						this.baseClass)) {
					break;
				}
				currentNode = currentNode.parentNode;
			}
			return currentNode ? currentNode : null; // Widget
		},

		//////////// delite/Selection implementation ///////////////////////////////////////

		getIdentity: function (/*Object*/item) {
			// summary:
			//		Returns the identity of an item.
			// item: Object
			//		The item.
			// tags:
			//		protected
			return this.store.getIdentity(item); // Object
		},

		updateRenderers: function (/*Array*/items) {
			// summary:
			//		Update renderers when the selection has changed.
			// items: Array
			//		The items which renderers must be updated.
			// tags:
			//		protected
			var i = 0, currentItem, renderer;
			if (this.selectionMode !== "none") {
				for (; i < items.length; i++) {
					currentItem = items[i];
					renderer = this.getRendererByItem(currentItem);
					if (renderer) {
						domClass.toggle(renderer, "d-selected", this.isSelected(currentItem));
					}
				}
			}
		},

		_handleSelection: function (/*Event*/event) {
			// summary:
			//		Event handler that performs items (de)selection.
			// event: Event
			//		The event the handler was called for.
			// tags:
			//		protected
			var item, itemSelected, eventRenderer, oldSelection;
			eventRenderer = this.getEnclosingRenderer(event.target || event.srcElement);
			if (eventRenderer) {
				item = eventRenderer.item;
				if (item) {
					oldSelection = this[this.selectionMode === "single" ? "selectedItem" : "selectedItems"];
					itemSelected = !this.isSelected(item);
					this.setSelected(item, itemSelected);
					this.dispatchSelectionChange(oldSelection,
							this[this.selectionMode === "single" ? "selectedItem" : "selectedItems"],
							eventRenderer,
							event);
				}
			}
		},

		//////////// Private methods ///////////////////////////////////////

		_processAndRemoveContent: function (/*DomNode*/node, /*Object*/tagHandlers) {
			// summary:
			//		process the content of a dom node using tag handlers and remove this content. 
			// node: Object
			//		the dom node to process
			// tagHandlers: Object
			//		a map which keys are tag names and values are functions that are executed
			//		when a node with the corresponding tag has been found under node. The
			//		function takes one parameter, that is the node that has been found. Note
			//		that the function is run in the context of the widget, to allow easy
			//		recursive processing.
			// tags:
			//		private
			var i, len, child, tagName;
			if (node.childNodes.length > 1) {
				len = node.childNodes.length;
				for (i = 0; i < len; i++) {
					child = node.firstChild;
					if (child) {
						tagName = child.tagName;
						if (tagName && tagHandlers[tagName]) {
							tagHandlers[tagName].call(this, child);
						}
						if (child.destroy) {
							child.destroy();
						} else {
							child.parentNode.removeChild(child);
						}
					}
				}
			}
		},

		_setBusy: function (status) {
			// summary:
			//		Set the "busy" status of the widget.
			// status: boolean
			//		true if the list is busy loading and rendering its data.
			//		false otherwise.
			// tags:
			//		private
			domClass.toggle(this, this._cssClasses.loading, status);
			if (status) {
				this.setAttribute("aria-busy", "true");
			} else {
				this.removeAttribute("aria-busy");
			}
		},

		_isCategorized: function () {
			return this.categoryAttr || this.categoryFunc;
		},

		//////////// Renderers life cycle ///////////////////////////////////////

		_renderNewItems: function (/*Array*/ items, /*boolean*/atTheTop) {
			// summary:
			//		Render new items within the list widget.
			// items: Array
			//		The new items to render.
			// atTheTop:
			//		If true, the new items are rendered at the top of the list.
			//		If false, they are rendered at the bottom of the list.
			// tags:
			//		private
			if (!this.containerNode.firstElementChild) {
				this.containerNode.appendChild(this._createRenderers(items, 0, items.length, null));
			} else {
				if (atTheTop) {
					this.containerNode.insertBefore(this._createRenderers(items, 0, items.length, null),
							this.containerNode.firstElementChild);
				} else {
					this.containerNode.appendChild(this._createRenderers(items, 0, items.length,
							this._getLastRenderer().item));
				}
			}
		},

		_createRenderers: function (/*Array*/ items, /*int*/fromIndex, /*int*/count, /*Object*/previousItem) {
			// summary:
			//		Create renderers for a list of items (including the category renderers if the list
			//      is categorized).
			// items: Array
			//		An array that contains the items to create renderers for.
			// fromIndex: int
			//		The index of the first item in the array of items
			//		(no renderer will be created for the items before this index).
			// count: int
			//		The number of items to use from the array of items, starting from the fromIndex position
			//		(no renderer will be created for the items that follows).
			// previousItem: Object
			//		The item that precede the first one for which a renderer will be created. This is only usefull for
			//		categorized lists.
			// returns:
			//		A DocumentFragment that contains the renderers.
			var currentIndex = fromIndex,
				currentItem, toIndex = fromIndex + count - 1;
			var documentFragment = document.createDocumentFragment();
			for (; currentIndex <= toIndex; currentIndex++) {
				currentItem = items[currentIndex];
				if (this._isCategorized()
					&& (!previousItem || currentItem.category !== previousItem.category)) {
					documentFragment.appendChild(this._createCategoryRenderer(currentItem.category));
				}
				documentFragment.appendChild(this._createItemRenderer(currentItem));
				previousItem = currentItem;
			}
			return documentFragment; // DocumentFragment
		},

		_addItemRenderer: function (/*Widget*/renderer, /*int*/atIndex) {
			// summary:
			//		Add an item renderer to the List, updating category renderers if needed.
			// renderer: List/ItemRenderer subclass
			//		The renderer to add to the list.
			// atIndex: int
			//		The index (not counting category renderers) where to add the item renderer in the list.
			var spec = this._getInsertSpec(renderer, atIndex);
			if (spec.nodeRef) {
				this.insertBefore(renderer, spec.nodeRef);
				if (spec.addCategoryAfter) {
					this.insertBefore(this._createCategoryRenderer(spec.nodeRef.item.category),
							spec.nodeRef);
				}
			} else {
				this.appendChild(renderer);
			}
			if (spec.addCategoryBefore) {
				this.insertBefore(this._createCategoryRenderer(renderer.item.category), renderer);
			}
		},

		_getInsertSpec: function (/*Widget*/renderer, /*int*/atIndex) {
			// summary:
			//		Get a specification for the insertion of an item renderer in the list.
			// description:
			//		Returns an object that contains the following attributes:
			//		- nodeRef: the node before which to insert the item renderer
			//		- addCategoryBefore: true if a category header should be inserted before the item renderer
			//		- addCategoryAfter: true if a category header should be inserted after the item renderer
			// renderer: List/ItemRenderer subclass
			//		The renderer to add to the list.
			// atIndex: int
			//		The index (not counting category renderers) where to add the item renderer in the list.
			var result = {nodeRef: atIndex >= 0 ? this.getItemRendererByIndex(atIndex) : null,
						  addCategoryBefore: false,
						  addCategoryAfter: false};
			if (this._isCategorized()) {
				var previousRenderer = result.nodeRef
										? this._getNextRenderer(result.nodeRef, -1)
										: this._getLastRenderer();
				if (!previousRenderer) {
					result.addCategoryBefore = true;
				} else {
					if (!this._sameCategory(renderer, previousRenderer)) {
						if (this._isCategoryRenderer(previousRenderer)) {
							result.nodeRef = previousRenderer;
							previousRenderer = this._getNextRenderer(previousRenderer, -1);
							if (!previousRenderer
								|| (previousRenderer && !this._sameCategory(renderer, previousRenderer))) {
								result.addCategoryBefore = true;
							}
						} else {
							result.addCategoryBefore = true;
						}
					}
				}
				if (result.nodeRef
					&& !this._isCategoryRenderer(result.nodeRef)
					&& !this._sameCategory(result.nodeRef, renderer)) {
					result.addCategoryAfter = true;
				}
			}
			return result; // Object
		},

		_removeRenderer: function (/*Widget*/renderer, /*Boolean*/keepSelection) {
			// summary:
			//		Remove a renderer from the List, updating category renderers if needed.
			// renderer: List/ItemRenderer or List/CategoryRenderer subclass
			//		The renderer to remove from the list.
			// keepSelection: Boolean
			//		Set to true if the renderer item should not be removed from the list of selected items.
			if (this._isCategorized() && !this._isCategoryRenderer(renderer)) {
				// remove the previous category header if necessary
				var previousRenderer = this._getNextRenderer(renderer, -1);
				if (previousRenderer && this._isCategoryRenderer(previousRenderer)) {
					var nextRenderer = this._getNextRenderer(renderer, 1);
					if (!nextRenderer || !this._sameCategory(renderer, nextRenderer)) {
						this._removeRenderer(previousRenderer);
					}
				}
			}
			// Update focus if necessary
			if (this._getFocusedRenderer() === renderer) {
				var nextFocusRenderer = this._getNext(renderer, 1) || this._getNext(renderer, -1);
				if (nextFocusRenderer) {
					this.focusChild(nextFocusRenderer);
				}
			}
			if (!keepSelection && !this._isCategoryRenderer(renderer) && this.isSelected(renderer.item)) {
				// deselected the item before removing the renderer
				this.setSelected(renderer.item, false);
			}
			// remove and destroy the renderer
			this.removeChild(renderer);
			renderer.destroy();
		},

		_createItemRenderer: function (/*Object*/item) {
			// summary:
			//		Create a renderer instance for an item.
			// item: Object
			//		The item to render.
			// returns:
			//		An instance of item renderer that renders the item.
			var renderer = new this.itemRenderer({tabindex: "-1"});
			renderer.startup();
			renderer.item = item;
			if (this.selectionMode !== "none") {
				domClass.toggle(renderer, "d-selected", this.isSelected(item));
			}
			return renderer; // Widget
		},

		_createCategoryRenderer: function (/*String*/category) {
			// summary:
			//		Create a renderer instance for a category.
			// category: String
			//		The category to render.
			// returns:
			//		An instance of category renderer that renders the category.
			var renderer = new this.categoryRenderer({category: category, tabindex: "-1"});
			renderer.startup();
			return renderer;
		},

		_isCategoryRenderer: function (/*Widget*/renderer) {
			// summary:
			//		test if a widget is a category renderer.
			return domClass.contains(renderer, this._cssClasses.category);
		},

		_sameCategory: function (/*Widget*/renderer1, /*Widget*/renderer2) {
			// summary:
			//		Returns true if two renderers have the same category, false otherwise
			// renderer1: Widget
			//		The first renderer.
			// renderer2; Widget
			//		The second renderer.
			var category1 = this._isCategoryRenderer(renderer1) ? renderer1.category : renderer1.item.category;
			var category2 = this._isCategoryRenderer(renderer2) ? renderer2.category : renderer2.item.category;
			return category1 === category2; // boolean
		},

		_getNextRenderer: function (/*Widget*/renderer, /*int*/dir) {
			// summary:
			//		Returns the renderer that comes immediately after of before another one.
			// renderer: Widget
			//		The renderer immediately before or after the one to return.
			// dir: int
			//		1 to return the renderer that comes immediately after renderer, -1 to
			//		return the one that comes immediately before.
			if (dir >= 0) {
				return renderer.nextElementSibling; // Widget
			} else {
				return renderer.previousElementSibling; // Widget
			}
		},

		_getFirstRenderer: function () {
			// summary:
			//		Returns the first renderer in the list.
			return this.containerNode
						.querySelector("." + this._cssClasses.item + ", ." + this._cssClasses.category); // Widget
		},

		_getLastRenderer: function () {
			// summary:
			//		Returns the last renderer in the list.
			var renderers = this.containerNode
								.querySelectorAll("." + this._cssClasses.item + ", ." + this._cssClasses.category);
			return renderers.item(renderers.length - 1);
		},

		////////////delite/Store implementation ///////////////////////////////////////

		initItems: function (/*Array*/items) {
			// summary:
			//		Populate the list using the items retrieved from the store.
			// tags:
			//		protected
			this._processAndRemoveContent(this, {});
			this._renderNewItems(items, false);
			this._setBusy(false);
		},

		removeItem: function (/*jshint unused:vars*/index, item, /*jshint unused:vars*/items, keepSelection) {
			// summary:
			//		Function to call when an item is removed from the store, to update
			//		the content of the list widget accordingly.
			// index: int
			//		The widget does not use this parameter.
			// item: Object
			//		The item that has been removed from the store.
			// items: Array
			//		The widget does not use this parameter.
			// keepSelection: Boolean
			//		Set to true if the item should not be removed from the list of selected items.
			// tags:
			//		protected
			var renderer = this.getRendererByItem(item);
			if (renderer) {
				this._removeRenderer(renderer, keepSelection);
			}
		},

		putItem: function (index, item, /*jshint unused:vars*/items) {
			// summary:
			//		Function to call when an item is updated in the store, to update
			//		the content of the list widget accordingly.
			// index: int
			//		The index of the item.
			// item: Object
			//		The item that has been updated the store.
			// items: Array
			//		The widget does not use this parameter.
			// tags:
			//		protected
			var renderer = this.getItemRendererByIndex(index);
			if (renderer) {
				renderer.item = item;
			}
		},

		addItem: function (index, item, /*jshint unused:vars*/items) {
			// summary:
			//		Function to call when an item is added to the store, to update
			//		the content of the list widget accordingly.
			// index:
			//		The index at which the item has been added to the store.
			// item: Object
			//		The item that has been added to the store.
			// items: Array
			//		The widget does not use this parameter.
			// tags:
			//		private
			var newRenderer = this._createItemRenderer(item);
			this._addItemRenderer(newRenderer, index);
		},

		//////////// delite/Scrollable extension ///////////////////////////////////////

		getTopDistance: function (node) {
			// summary:
			//		Returns the distance between the top of the node and 
			//		the top of the scrolling container.
			// tags:
			//		protected
			return node.offsetTop - this.getCurrentScroll().y;
		},

		getBottomDistance: function (node) {
			// summary:
			//		Returns the distance between the bottom of the node and 
			//		the bottom of the scrolling container.
			// tags:
			//		protected
			var clientRect = this.getBoundingClientRect();
			return node.offsetTop +
				node.offsetHeight -
				this.getCurrentScroll().y -
				(clientRect.bottom - clientRect.top);
		},

		//////////// Keyboard navigation (KeyNav implementation) ///////////////////////////////////////

		_onContainerKeydown: dcl.before(function (evt) {
			// summary:
			//		Handle keydown events
			// tags:
			//		private
			var renderer = this._getFocusedRenderer();
			if (renderer && renderer.onKeydown) {
				// onKeydown implementation can cancel the default action
				renderer.onKeydown(evt);
			}
			if (!evt.defaultPrevented) {
				if ((evt.keyCode === keys.SPACE && !this._searchTimer) || evt.keyCode === keys.ENTER) {
					this._actionKeydownHandler(evt);
				}
			}
		}),

		_actionKeydownHandler: function (evt) {
			// summary:
			//		Handle SPACE and ENTER keys
			// tags:
			//		private
			if (this.selectionMode !== "none") {
				evt.preventDefault();
				this._handleSelection(evt);
			}
		},

		childSelector: function (child) {
			// tags:
			//		private
			return child !== this;
		},

		_getFirst: function () {
			// tags:
			//		private
			var renderer = this._getFirstRenderer();
			while (renderer) {
				if (this.getTopDistance(renderer) >= 0) {
					break;
				}
				renderer = renderer.nextElementSibling;
			}
			return renderer;
		},

		_getLast: function () {
			// tags:
			//		private
			var renderer = this._getLastRenderer();
			while (renderer) {
				if (this.getBottomDistance(renderer) <= 0) {
					break;
				}
				renderer = renderer.previousElementSibling;
			}
			return renderer;
		},

		_getNext: function (child, dir) {
			// tags:
			//		private
			var focusedRenderer, refChild, returned = null;
			if (this.focusedChild) {
				focusedRenderer = this._getFocusedRenderer();
				if (focusedRenderer === this.focusedChild) {
					// The renderer itself has the focus
					refChild = child || this.focusedChild;
					if (refChild) {
						// do not use _nextRenderer and _previousRenderer as we want to include the pageloader
						// if it exists
						returned = refChild[(dir === 1) ? "nextElementSibling" : "previousElementSibling"];
					}
				} else {
					// A descendant of the renderer has the focus
					// FIXME: can it be a category header, with no _getNextFocusableChild method ?
					returned = focusedRenderer._getNextFocusableChild(child, dir);
				}
			} else {
				returned = (dir === 1 ? this._getFirst() : this._getLast());
			}
			return returned;
		},

		_onLeftArrow: function () {
			// tags:
			//		private
			var nextChild, focusedRenderer = this._getFocusedRenderer();
			if (focusedRenderer && focusedRenderer._getNextFocusableChild) {
				nextChild = focusedRenderer._getNextFocusableChild(null, -1);
				if (nextChild) {
					this.focusChild(nextChild);
				}
			}
		},

		_onRightArrow: function () {
			// tags:
			//		private
			var nextChild, focusedRenderer = this._getFocusedRenderer();
			if (focusedRenderer && focusedRenderer._getNextFocusableChild) {
				nextChild = focusedRenderer._getNextFocusableChild(null, 1);
				if (nextChild) {
					this.focusChild(nextChild);
				}
			}
		},

		_onDownArrow: function () {
			// tags:
			//		private
			this._focusNextChild(1);
		},

		_onUpArrow: function () {
			// tags:
			//		private
			this._focusNextChild(-1);
		},

		_focusNextChild: function (dir) {
			// tags:
			//		private
			var child, renderer = this._getFocusedRenderer();
			if (renderer) {
				if (renderer === this.focusedChild) {
					child = this._getNext(renderer, dir);
					if (!child) {
						child = renderer;
					}
				} else {
					child = renderer;
				}
				this.focusChild(child);
				return child;
			}
		},

		_getFocusedRenderer: function () {
			// summary:
			//		Returns the renderer that currently got the focused or is
			//		an ancestor of the focused node.
			// tags:
			//		private
			return this.focusedChild ? this.getEnclosingRenderer(this.focusedChild) : null; /*Widget*/
		}

	});

	return register("d-list", [HTMLElement, List]);

});